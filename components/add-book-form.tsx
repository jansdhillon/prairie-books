"use client";

import React, { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";

export default function AddBookForm({addBookAction}: {addBookAction: (formData: FormData) => void;}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addBookAction(formData);
  }
  return (
      <form onSubmit={handleSubmit} method="POST">
        <div >
          <label htmlFor="title">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
          />
        </div>
        <div >
          <label htmlFor="author">
            Author<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            id="author"
            required
          />
        </div>
        <div >
          <label htmlFor="isbn">
            ISBN<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="isbn"
            id="isbn"
            required
          />
        </div>
        <div >
          <label htmlFor="price">
            Price ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            required
          />
        </div>
        {/* Genre */}
        <div >
          <label htmlFor="genre" >
            Genre
          </label>
          <input
            type="text"
            name="genre"
            id="genre"
          />
        </div>
        <div >
          <label htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
          ></textarea>
        </div>
        <div >
          <label htmlFor="publisher">
            Publisher
          </label>
          <input
            type="text"
            name="publisher"
            id="publisher"
          />
        </div>
        <div >
          <label htmlFor="language">
            Language
          </label>
          <input
            type="text"
            name="language"
            id="language"
          />
        </div>
        <div >
          <label htmlFor="book-cover">
            Cover Image
          </label>
          <input
            type="file"
            name="book-cover"
            id="book-cover"
          />
        </div>
        <div>
          <Button type="submit">Add Book</Button>
        </div>
      </form>
  );
}
