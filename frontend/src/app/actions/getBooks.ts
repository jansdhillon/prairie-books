"use server";

export const getBooks = async (pb: any) => {
  try {
    const books = await pb.collection("books").getFullList();
    console.log(books);
    return books;
  } catch {
    console.error("Error fetching books");
    return [];
  }
};
