import os
import json
from supabase import create_client, Client
import stripe

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def backfill_books_to_stripe():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    books_response = supabase.from_('books').select('*').is_('product_id', None).execute()


    books = books_response.data

    for book in books:
        book_id = book['id']
        title = book['title']
        description = book.get('description') or ''
        author = book['author']
        isbn = book['isbn']
        genres = book.get('genre') or []
        price = int(float(book['price']) * 100)
        currency = 'cad'
        language = book.get('language') or ''
        publisher = book.get('publisher') or ''
        edition = book.get('edition') or ''
        condition = book.get('condition') or ''
        image_directory = book.get('image_directory') or ''
        num_images = book.get('num_images') or 0

        image_urls = []
        if image_directory and num_images > 0:
            if not image_directory.endswith('/'):
                image_directory += '/'

            for i in range(num_images):
                image_urls.append(f"{image_directory}image-{i + 1}.png")
        else:
            image_urls = None

        metadata = {
            'bookId': str(book_id),
            'author': author,
            'isbn': isbn,
            'genres': json.dumps(genres),
            'publisher': publisher,
            'language': language,
            'edition': edition,
        }

        for key in metadata:
            if isinstance(metadata[key], str):
                metadata[key] = metadata[key][:500]

        try:
            stripe_product = stripe.Product.create(
                name=title,
                description=description or None,
                images=image_urls or None,
                metadata=metadata
            )
            product_id = stripe_product['id']

            stripe_price = stripe.Price.create(
                product=product_id,
                unit_amount=price,
                currency=currency,
                nickname=f'Price for {title}',
                metadata={}
            )
            price_id = stripe_price['id']

            product_data = {
                'id': product_id,
                'active': stripe_product['active'],
                'name': stripe_product['name'],
                'description': stripe_product['description'],
                'image': image_urls[0] if image_urls else None,
                'metadata': metadata,
                'book_id': book_id
            }

            price_data = {
                'id': price_id,
                'product_id': product_id,
                'active': stripe_price['active'],
                'description': stripe_price.get('nickname'),
                'unit_amount': stripe_price['unit_amount'],
                'currency': stripe_price['currency'],
                'type': stripe_price['type'],
                'metadata': stripe_price['metadata']
            }

            supabase.table('products').insert(product_data).execute()


            supabase.table('prices').insert(price_data).execute()


            supabase.table('books').update({'product_id': product_id}).eq('id', book_id).execute()

            print(f"Backfilled product and price for book: {title}")

        except Exception as e:
            print(f"An error occurred for book '{title}': {e}")

if __name__ == '__main__':
    backfill_books_to_stripe()
