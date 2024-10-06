"use client";

import { useState, useEffect } from "react";
import { fetchBooks } from "../actions/fetch-books";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Book } from "@/components/book";
import Loading from "../loading";
import { BookType } from "@/lib/types/types";

export default function AllBooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        const fetchedBooks = await fetchBooks();
        setBooks(fetchedBooks);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const getPaginationRange = () => {
    const maxPagesToShow = 1;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let start = currentPage - halfRange;
    let end = currentPage + halfRange;

    if (start < 1) {
      start = 1;
      end = Math.min(maxPagesToShow, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    return pages;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex flex-1 flex-col space-y-6 ">
      <h1 className="text-3xl font-bold text-left">All Books</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        Explore the entire collection of books.
      </p>

      {!loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentBooks.map((book) => (
              <Book key={book.id} book={book} />
            ))}
          </div>

          <Pagination >
            <PaginationContent className="overflow-hidden">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>

              {paginationRange[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {paginationRange[0] > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {paginationRange.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {paginationRange[paginationRange.length - 1] < totalPages && (
                <>
                  {paginationRange[paginationRange.length - 1] <
                    totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === totalPages}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
