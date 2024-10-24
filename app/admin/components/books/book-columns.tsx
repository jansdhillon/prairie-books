"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { BookType } from "@/lib/types/types";
import Image from "next/image";
import { format } from "date-fns";

export const bookColumns: ColumnDef<BookType>[] = [

  {
    accessorKey: "cover",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cover" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[50px] md:max-w-[200px] truncate font-medium">
            {row?.original.image_directory && (
              <Image
                src={`${row?.original?.image_directory}image-1.png`}
                alt={row?.original.title}
                width={50}
                height={50}
              />
            )}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] md:max-w-[200px] lg:max-w-[300px] truncate font-medium text-ellipsis">
            {row.original.title || "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    accessorFn: (row) => row.author,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] md:max-w-[200px] truncate font-medium">
            {row.getValue("author")}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    accessorFn: (row) => row.created_at,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posted On" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] md:max-w-[200px] truncate font-medium">
            {format(new Date(row.getValue("created_at")), "PP")}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-center"
      />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
