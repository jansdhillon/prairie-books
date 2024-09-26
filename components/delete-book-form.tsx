"use client";

import { ReactNode } from "react";
import { FormMessage, Message } from "./form-message";
import { SubmitButton } from "./submit-button";
import { Input } from "./ui/input";

export const DeleteBookForm = ({
  deleteBook,
  bookId,
  searchParams,
  alertDialogAction,
}: {
  deleteBook: (formData: FormData) => void;
  bookId: string;
  searchParams: Message;
  alertDialogAction: ReactNode
}) => {


  console.log("DeleteBookForm", { deleteBook, bookId, searchParams });

  return (
    <form className="">
      <Input type="hidden" name="book-id" defaultValue={bookId} readOnly />
      <SubmitButton
        type="submit"
        variant="ghost"
        className="bg-inherit hover:bg-transparent"
        pendingText="Removing..."
        formAction={deleteBook}
      >
        {alertDialogAction}
      </SubmitButton>
    </form>
  );
};
