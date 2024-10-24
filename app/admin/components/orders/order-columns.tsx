"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { OrderWithItemsType } from "@/lib/schemas/schemas";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export const orderColumns: ColumnDef<OrderWithItemsType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
  {
    accessorKey: "ordered_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ordered On" />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.original.ordered_at), "yyyy-MM-dd")}</div>
    ),
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.items.length > 0 ? (
          row.original.items.map((item) => (
            <div key={item.id}>{item.book_title}</div>
          ))
        ) : (
          <div>No items</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <Badge variant="default">{row.original.status}</Badge>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <Link href={`/admin/orders/${row.original.id}`}>
        <Button variant="outline" size="sm">
          View Order
        </Button>
      </Link>
    ),
  },
];
