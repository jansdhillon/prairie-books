"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BookType } from "@/lib/types/types";
import { DataTablePagination } from "./data-table-pagination";
import { Book } from "../../../components/book";
import { DataTableToolbar } from "./data-table-toolbar";

interface BookPageProps {
  books: BookType[];
  title: string;
  subtitle: string;
}

export const BookPage = ({ books, title, subtitle }: BookPageProps) => {
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const columns: ColumnDef<BookType>[] = [
    {
      header: "Book",
      accessorKey: "title",
      cell: ({ row }) => {
        const book = row.original;
        return <Book key={book.id} book={book} />;
      },
      enableSorting: true,
    },
    {
      header: "Author",
      accessorKey: "author",
      cell: ({ row }) => null,
      enableSorting: true,
    },
    {
      header: "Genre",
      accessorKey: "genre",
      cell: ({ row }) => {
        null;
      },
      filterFn: (row, columnId, filterValue) => {
        const genres = row.getValue(columnId) as string[];
        return filterValue.every((filter: any) => genres.includes(filter));
      },
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => null,
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: books,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  const genreOptions = Array.from(
    new Set(books.flatMap((book) => book.genre ?? []))
  )?.map((genre) => ({ label: genre, value: genre }));

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">{subtitle}</p>

      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        genreOptions={genreOptions}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="h-full">
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id} className="h-full">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
};
