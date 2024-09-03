import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {BookHeart} from "lucide-react";
import {BookType} from "@/lib/types";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";

export default function BookStore({books}: { books: BookType[] }) {
    console.log("books", books);
    return (
        <div className="space-y-6 container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Available Books</h1>
            <Separator/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.map((book: BookType) => (
                    <Card key={book.id} className="flex flex-col">
                        <CardHeader>
                            {book.cover ? (
                                <Image
                                    src={"/Hemingway_farewell.png"}
                                    alt={`Cover of ${book.title}`}
                                    className="w-48 h-48 object-cover rounded-md"
                                    width={48}
                                    height={48}
                                />
                            ) : (
                                <>
                                    <p className="relative top-20 left-12 font-bold">
                                        No image found
                                    </p>
                                    <BookHeart className="w-full h-36 stroke-primary/20 "/>
                                </>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardTitle className="mb-2">{book.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Genre: {book.genre}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Author: {book.author}
                            </p>


                        </CardContent>
                        <CardFooter className={"flex gap-3 justify-around"}>
                            <p className="mt-2 font-bold">${book.price.toFixed(2)}</p>
                            <Button className="w-50">Buy</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
