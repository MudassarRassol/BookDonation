import { UploadImage } from "@/libs/uploadimg";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Book from "@/models/BookSchema";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id: bookId } = await params;
    const userId = req.headers.get("userid");

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(
        { message: "Invalid book ID" },
        { status: 400 }
      );
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Handle FormData
    const formData = await req.formData();
    const title = formData.get("title");
    const author = formData.get("author");
    const condition = formData.get("condition");
    const category = formData.get("Category");
    const description = formData.get("description");
    const bookimg = formData.get("bookimg") as File | null;
    // Verify book exists and belongs to user
    const existingBook = await Book.findOne({
      _id: bookId,
      userId
    });

    if (!existingBook) {
      return NextResponse.json(
        { message: "Book not found or unauthorized" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      title: FormDataEntryValue | null;
      author: FormDataEntryValue | null;
      condition: FormDataEntryValue | null;
      description: FormDataEntryValue | null;
      Category: FormDataEntryValue | null;
      updatedAt: Date;
      bookimg?: string;
    } = {
      title,
      author,
      condition,
      description,
      Category: category,
      updatedAt: new Date()
    };

    // Handle image upload if new image provided
    if (bookimg) {
      const imageUrl = await UploadImage(bookimg, "image-upload") as string;
      if (!imageUrl) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 400 }
        );
      }
      updateData.bookimg = String(imageUrl);
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true }
    );

    if (!updatedBook) {
      throw new Error("Failed to update book");
    }

    return NextResponse.json(
      {
        message: "Book updated successfully",
        book: updatedBook
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}