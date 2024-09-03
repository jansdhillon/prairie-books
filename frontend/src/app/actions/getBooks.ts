"use server";

export const getBooks = async (pb: any) => {
    try {
        return (await pb.collection("books").getList(1, 50,
        )).items;
    } catch {
        console.error("Error fetching books");
        return [];
    }
};
