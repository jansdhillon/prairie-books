"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "./submit-button";
import { FormMessage, Message } from "./form-message";
import { BookType } from "./book-display";

export default function EditBookForm({
  editBookAction,
  book,
  searchParams,
}: {
  editBookAction: (formData: FormData) => void;
  book: BookType;
  searchParams: Message;
}) {
  console.log(book);
  const formRef = useRef<HTMLFormElement>(null);


  return (
    <form
      className="space-y-2 max-w-2xl mx-auto"
      ref={formRef}
    >
      {/* {searchParams && <FormMessage message={searchParams} />} */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Edit Book Details</h2>
        <p className="text-muted-foreground">
          Update the details of the book below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title<span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            name="title"
            id="title"
            defaultValue={book?.title || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">
            Author<span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            name="author"
            id="author"
            defaultValue={book?.author || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isbn">
            ISBN<span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            name="isbn"
            id="isbn"
            defaultValue={book?.isbn || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">
            Price ($)<span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            name="price"
            id="price"
            step="0.01"
            defaultValue={book?.price || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            type="text"
            name="genre"
            id="genre"
            defaultValue={book?.genre || ""}
            placeholder="Horror"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            type="text"
            name="publisher"
            id="publisher"
            defaultValue={book?.publisher || ""}
            placeholder="Penguin"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edition">Edition</Label>
          <Input
            type="text"
            name="edition"
            id="edition"
            defaultValue={book?.edition || ""}
            placeholder="First"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Input
            type="text"
            name="condition"
            id="condition"
            defaultValue={book?.condition || ""}
            placeholder="Like New"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="original-release-date">Original Release Date</Label>
          <Input
            type="date"
            name="original-release-date"
            id="original-release-date"
            defaultValue={book?.original_release_date || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publication-date">Publication Date</Label>
          <Input
            type="date"
            name="publication-date"
            id="publication-date"
            defaultValue={book?.publication_date || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            type="text"
            name="language"
            id="language"
            defaultValue={book?.language || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="images">Images</Label>
          <Input
            type="file"
            name="images"
            id="images"
            accept="image/*"
            multiple
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          rows={4}
          defaultValue={book?.description || ""}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is-featured"
          name="is-featured"
          defaultChecked={book?.is_featured || false}
        />
        <Label htmlFor="is-featured">Feature this book</Label>
      </div>
      <div className="absolute opacity-0"><Label htmlFor="book-id">Book Id</Label><Input name="book-id" defaultValue={book?.id} readOnly/></div>

      <div className="flex justify-end">
        <SubmitButton
          type="submit"
          className="w-full sm:w-auto"
          formAction={editBookAction}
        >
          Save Changes
        </SubmitButton>
      </div>
    </form>
  );
}
