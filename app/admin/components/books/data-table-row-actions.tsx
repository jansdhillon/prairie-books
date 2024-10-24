"use client";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { BookSchema } from "@/lib/schemas/schemas";
import { Ellipsis, Eye, Pen, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBook } from "@/app/actions/delete-book";
import { getProductByBookId } from "@/app/actions/get-product";
import { DeleteBookForm } from "./delete-book-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const book = BookSchema.parse(row.original);

  return (
    <>
      <div className="hidden md:flex justify-center items-center gap-4">
        <Link
          href={`/books/${book.id}`}
          className="flex justify-center items-center "
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Eye size={16} />
            </TooltipTrigger>
            <TooltipContent>View Book</TooltipContent>
          </Tooltip>
        </Link>
        <Link href={`/admin/edit/${book.id}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Pen className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Edit Book</TooltipContent>
          </Tooltip>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger className="text-destructive hover:text-destructive/90 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Trash className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Delete Book</TooltipContent>
            </Tooltip>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xs">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                book.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <DeleteBookForm
                deleteBook={deleteBook}
                bookId={book.id}
                getProductByBookId={getProductByBookId}
                alertDialogAction={
                  <AlertDialogAction
                    type="submit"
                    className="h-10 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                }
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex md:hidden justify-center items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <Ellipsis size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-3 items-start p-4 text-sm">
            {" "}
            <Link href={`/books/${book.id}`}>
              <button>View</button>
            </Link>
            <Separator />
            <Link href={`/admin/edit/${book.id}`}>
              <button>Edit</button>
            </Link>
            <Separator />
            <AlertDialog>
              <AlertDialogTrigger className="text-destructive hover:text-destructive/90 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-xs">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this book.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <DeleteBookForm
                    deleteBook={deleteBook}
                    bookId={book.id}
                    getProductByBookId={getProductByBookId}
                    alertDialogAction={
                      <AlertDialogAction
                        type="submit"
                        className="h-10 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    }
                  />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
