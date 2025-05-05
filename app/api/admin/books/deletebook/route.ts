// api/admin/books/deletebook/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book } from "@/models/model";

export async function DELETE(request: Request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Book deleted successfully",
        book: deletedBook
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Delete Book Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to delete book",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}