"use server";
import { Storage } from "@google-cloud/storage";

export const getBookCover = async (isbn: string) => {
  const storage = new Storage();
  const bookCoverImage = await storage
    .bucket("kathrins-books-images")
    .file(`${isbn}.png`)
    .download({"decompress": true});

    const blob = new Blob(bookCoverImage, {type: "image/png"});

    return blob;
};
