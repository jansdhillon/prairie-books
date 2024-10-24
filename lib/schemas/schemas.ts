import { z } from 'zod';

const OrderStatusEnum = z.enum(["Delivered", "Shipped", "Ordered", "Failed", "pending"]);

export const OrderSchema = z.object({
  id: z.string(),
  items_total: z.number().nullable(),
  ordered_at: z.string(),
  session_id: z.string().nullable(),
  shipping_cost: z.number().nullable(),
  status: OrderStatusEnum.nullable(),
  user_id: z.string(),
});

export type OrderType = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  book_author: z.string().nullable(),
  book_id: z.string(),
  book_title: z.string().nullable(),
  id: z.string(),
  image_directory: z.string().nullable(),
  order_id: z.string(),
  price: z.number(),
  product_id: z.string().nullable(),
  quantity: z.number(),
});

export type OrderItemType = z.infer<typeof OrderItemSchema>;

export type OrderWithItemsType = OrderType & {
  items: OrderItemType[];
};


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
