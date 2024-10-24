"use client";
import { ColumnDef } from "@tanstack/react-table";
import { OrderItemType } from "@/lib/types/types";
import Image from "next/image";

export const orderItemColumns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "image_directory",
    header: "Book",
    cell: ({ row }) =>
      row.original.image_directory ? (
        <Image
          src={`${row.original.image_directory}image-1.png`}
          alt={row?.original.book_title || "Book"}
          width={50}
          height={50}
        />
      ) : null,
  },
  {
    accessorKey: "book_title",
    header: "Title",
    cell: ({ row }) => row.original.book_title,
  },
  {
    accessorKey: "book_author",
    header: "Author(s)",
    cell: ({ row }) => row.original.book_author,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
];
