import { NextResponse as Response, NextRequest as Request } from "next/server";
import books from "@/app/api/db"

export async function GET() {
    return Response.json(books);
}

export async function POST(request: Request) {
    const book = await request.json();
    const nextId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    book.id = nextId;
    books.push(book);

    return Response.json(books);
}