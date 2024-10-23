import BookDisplay  from '@/app/books/components/book-display'
import { getBookById } from '@/app/actions/get-book-by-id'
import { BookDetails } from '@/app/books/components/book-details'

export default async function BookDetailsPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id)

  if (!book) {
    return <div>Book not found</div>
  }

  return <BookDetails book={book} />
}
