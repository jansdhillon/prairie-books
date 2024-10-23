import { z } from 'zod';

export const BookSchema = z.object({
  author: z.string(),
  condition: z.string().nullable(),
  created_at: z.string().nullable(),
  description: z.string().nullable(),
  edition: z.string().nullable(),
  genre: z.array(z.string()).nullable(),
  id: z.string(),
  image_directory: z.string().nullable(),
  is_featured: z.boolean().nullable(),
  isbn: z.string().nullable(),
  language: z.string().nullable(),
  num_images: z.number().nullable(),
  original_release_date: z.string().nullable(),
  price: z.number(),
  product_id: z.string().nullable(),
  publication_date: z.string().nullable(),
  publisher: z.string().nullable(),
  stock: z.number(),
  title: z.string(),
});

export type BookType = z.infer<typeof BookSchema>;
