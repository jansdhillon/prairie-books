"use client";

import React, { FormEvent, Suspense, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "./submit-button";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Separator } from "./ui/separator";

export default function AddBookForm({
  addBookAction,
}: {
  addBookAction: (formData: FormData) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("genres", genres.join(","));
    addBookAction(formData);
    if (formRef.current) {
      formRef.current.reset();
    }
    setIsSubmitting(false);
    setGenres([]);
  };

  const [genres, setGenres] = useState<string[]>([]);
  const [currentGenre, setCurrentGenre] = useState("");

  const handleAddGenre = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentGenre.trim() !== "") {
      e.preventDefault();
      if (!genres.includes(currentGenre.trim())) {
        setGenres([...genres, currentGenre.trim()]);
      }
      setCurrentGenre("");
    } else if (e.key === "Backspace" && currentGenre === "") {
      setGenres(genres.slice(0, genres.length - 1));
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
  };

  return (
    <form className="space-y-2 w-sm md:w-2xl mx-auto" ref={formRef}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add New Book</h2>
        <Separator />
        <p className="text-muted-foreground">
          Fill in the details to add a new book to the store.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title<span className="text-destructive">*</span>
          </Label>
          <Input type="text" name="title" id="title" required placeholder="The Count of Monte Cristo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">
            Author<span className="text-destructive">*</span>
          </Label>
          <Input type="text" name="author" id="author" required placeholder="Alexandre Dumas" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">
            Price ($)<span className="text-destructive">*</span>
          </Label>
          <Input type="number" name="price" id="price" step="0.01" placeholder="10" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isbn">
            ISBN
          </Label>
          <Input type="text" name="isbn" id="isbn" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              name="genre"
              id="genre"
              placeholder="Enter genres and press Enter"
              value={currentGenre}
              onChange={(e) => setCurrentGenre(e.target.value)}
              onKeyDown={handleAddGenre}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {genres.map((genre, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center"
              >
                {genre}
                <X
                  className="ml-2 h-4 w-4 cursor-pointer"
                  onClick={() => removeGenre(genre)}
                />
              </Badge>
            ))}
          </div>
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
        {/* <div className="space-y-2">
          <Label htmlFor="original-release-date">Original Release Date</Label>
          <Input
            type="date"
            name="original-release-date"
            id="original-release-date"
          />
        </div> */}{" "}
        {/*removed by request*/}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input type="number" name="quantity" id="quantity" defaultValue={1}  />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publication-date">Publication Date</Label>
          <Input type="date" name="publication-date" id="publication-date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input type="text" name="language" id="language" defaultValue={"English"} />
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
      <div className="flex items-center space-x-2 ">
        <Checkbox id="is-featured" name="is-featured" />
        <Label htmlFor="is-featured">Feature this book</Label>
      </div>
      <div className="flex justify-end pt-2">
        <SubmitButton
          type="submit"
          variant={"default"}
          className="w-full sm:w-auto"
          pendingText="Adding..."
          formAction={handleSubmit}
          disabled={isSubmitting}
        >
          Add Book
        </SubmitButton>
      </div>
    </form>
  );
}
