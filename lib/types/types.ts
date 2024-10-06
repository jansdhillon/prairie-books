import { Database } from "@/utils/database.types";

export type CartType = Database["public"]["Tables"]["cart"]["Row"];

export type CartItemType = Database["public"]["Tables"]["cart_items"]["Row"];

export type OrderType = Database["public"]["Tables"]["orders"]["Row"];

export type OrderItemType = Database["public"]["Tables"]["order_items"]["Row"];

export type UserType = Database["public"]["Tables"]["users"]["Row"];

export type BookType = Database["public"]["Tables"]["books"]["Row"];

export type ProductType = Database["public"]["Tables"]["products"]["Row"];

export type PriceType = Database["public"]["Tables"]["prices"]["Row"];

export type PaymentType = Database["public"]["Tables"]["payments"]["Row"];
