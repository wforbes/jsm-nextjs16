import books from "@/app/api/db"
import { NextResponse as Response, NextRequest as Request } from "next/server";

export async function PUT(request: Request, context: { params: { id: string } }) {

    const id = +context.params.id;
    const book = await request.json();
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return Response.json({ message: "Book not found" }, { status: 404 });
    }
    books[index] = book;
    return Response.json(books);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    //const id = +context.params.id; // this tutorial code wont work... gotta await params promise
    const { id } = await params;
    const index = books.findIndex(b => b.id === +id);

    if (index === -1) {
        return Response.json({ message: "Book not found" }, { status: 404 });
    }
    books.splice(index, 1);
    console.log(books);
    return Response.json(books);
}