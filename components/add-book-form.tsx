"use client";

import React, { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";

export default function AddBookForm({addBookAction}: {addBookAction: (formData: FormData) => void;}) {
  return (
      <form action={addBookAction} method="POST">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium ">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium ">
            Author<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            id="author"
            required
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isbn" className="block text-sm font-medium ">
            ISBN<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="isbn"
            id="isbn"
            required
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium ">
            Price ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {/* Genre */}
        <div className="mb-4">
          <label htmlFor="genre" className="block text-sm font-medium ">
            Genre
          </label>
          <input
            type="text"
            name="genre"
            id="genre"
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium ">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="publisher" className="block text-sm font-medium ">
            Publisher
          </label>
          <input
            type="text"
            name="publisher"
            id="publisher"
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium ">
            Language
          </label>
          <input
            type="text"
            name="language"
            id="language"
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cover_image_url" className="block text-sm font-medium ">
            Cover Image URL
          </label>
          <input
            type="url"
            name="cover_image_url"
            id="cover_image_url"
            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mt-6">
          <Button type="submit">Add Book</Button>
        </div>
      </form>
  );
}
