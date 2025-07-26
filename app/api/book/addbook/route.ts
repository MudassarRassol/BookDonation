import { UploadImage } from "@/libs/uploadimg";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Book from "@/models/BookSchema";
import Bookcheck from "@/models/BookCheckSchema";
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    // Extract and validate userId
    const userId = req.headers.get("userid");
    // Handle FormData
    const formData = await req.formData();
    console.log(formData);
    // Trim all string inputs and validate
    const title = formData.get("title");

    const condition = formData.get("condition");
    // const description = formData.get("description") ? formData.get("description") : "";
    const Category = formData.get("Category");
    const city = formData.get("city");
    const bookimg = formData.get("bookimg") as File;
    const author =
      formData.get("author")?.toString().trim() || "No author name provided";
    const description =
      formData.get("description")?.toString().trim() ||
      "No description provided";

    if (!bookimg) {
      return NextResponse.json(
        { message: "Book image is required" },
        { status: 400 }
      );
    }

    // const authordata = author ? author  : "No author name provided";

    // Upload image
    const imageUrl = await UploadImage(bookimg, "image-upload");
    if (imageUrl) {
      const bookadded = new Book({
        title,
        condition,
        bookimg: imageUrl,
        userId, // Convert to ObjectId
        status: "Available", // Default status,
        Category,
        city,
        description: description,
        author: author,
      });
      await bookadded.save();

      if (bookadded) {
        const backup = new Bookcheck({
          bookid: bookadded._id,
          delete: false,
        });

        await backup.save();

        if (backup) {
          return NextResponse.json(
            {
              message: "Book added successfully",
              book: bookadded,
            },
            { status: 201 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { message: "Book image upload failed" },
        { status: 400 }
      );
    }
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
