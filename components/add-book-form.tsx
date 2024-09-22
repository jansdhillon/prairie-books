"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "./submit-button";
import { FormMessage, Message } from "./form-message";

export default function AddBookForm({
  addBookAction,
  searchParams,
}: {
  addBookAction: (formData: FormData) => void;
  searchParams: Message;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    await addBookAction(formData);

    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <form
      className="space-y-2 max-w-2xl mx-auto"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      {searchParams && <FormMessage message={searchParams} />}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add New Book</h2>
        <p className="text-muted-foreground">
          Fill in the details to add a new book to the store.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title<span className="text-destructive">*</span>
          </Label>
          <Input type="text" name="title" id="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">
            Author<span className="text-destructive">*</span>
          </Label>
          <Input type="text" name="author" id="author" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isbn">
            ISBN<span className="text-destructive">*</span>
          </Label>
          <Input type="text" name="isbn" id="isbn" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">
            Price ($)<span className="text-destructive">*</span>
          </Label>
          <Input type="number" name="price" id="price" step="0.01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input type="text" name="genre" id="genre" placeholder="Horror" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            type="text"
            name="publisher"
            id="publisher"
            placeholder="Penguin"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edition">Edition</Label>
          <Input type="text" name="edition" id="edition" placeholder="First" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Input
            type="text"
            name="condition"
            id="condition"
            placeholder="Like New"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="original-release-date">Original Release Date</Label>
          <Input
            type="date"
            name="original-release-date"
            id="original-release-date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publication-date">Publication Date</Label>
          <Input type="date" name="publication-date" id="publication-date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input type="text" name="language" id="language" />
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
        <Textarea name="description" id="description" rows={4} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is-featured" name="is-featured" />
        <Label htmlFor="is-featured">Feature this book</Label>
      </div>

      <div className="flex justify-end">
        <SubmitButton
          type="submit"
          className="w-full sm:w-auto"
          formAction={addBookAction}
        >
          Add Book
        </SubmitButton>
      </div>
    </form>
  );
}
