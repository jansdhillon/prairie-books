"use client"

import { useState, useEffect } from "react"
import { fetchBooks } from "../actions/fetch-books"
import { Separator } from "@/components/ui/separator"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { BookType } from "@/components/book-display"
import { Book } from "@/components/book"
import Loading from "../loading"

export default function AllBooksPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 6
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks()
        setBooks(fetchedBooks)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getBooks()
  }, [])

  const totalPages = Math.ceil(books.length / booksPerPage)
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <p className="text-lg text-red-500">Error: {error}</p>
  }

  return (
    <div className="flex flex-1 flex-col space-y-6 ">
      <h1 className="text-3xl font-bold text-left">All Books</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        Explore the entire collection of books.
      </p>

      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentBooks.map((book) => (
             <Book key={book.id} book={book} />

            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === index + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(index + 1)
                      }}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <p className="text-lg text-muted-foreground">No books available at the moment.</p>
      )}
    </div>
  )
}
