"use client";

import Link from "next/link";
import { EyeOutlined } from "@ant-design/icons";
import { Image } from "antd";

interface UserInfo {
  username: string;
  city: string;
  profilephoto: string;
}

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    bookimg: string;
    condition: string;
    status: string;
    description: string;
    Category: string;
    userId: string | UserInfo;
    createdAt: string;
    updatedAt: string;
  };
}

const conditionClasses = {
  new: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
};

const categoryClasses = {
  Fiction: "bg-blue-100 text-blue-800",
  "Non-Fiction": "bg-green-100 text-green-800",
  "Science Fiction": "bg-purple-100 text-purple-800",
  Fantasy: "bg-yellow-100 text-yellow-800",
  Biography: "bg-orange-100 text-orange-800",
  History: "bg-red-100 text-red-800",
  "Self-Help": "bg-teal-100 text-teal-800",
  Romance: "bg-pink-100 text-pink-800",
  Mystery: "bg-indigo-100 text-indigo-800",
  Thriller: "bg-gray-100 text-gray-800",

  // School-level categories
  "9th": "bg-sky-100 text-sky-800",
  "10th": "bg-emerald-100 text-emerald-800",
  "11th": "bg-lime-100 text-lime-800",
  "12th": "bg-amber-100 text-amber-800",
};

const BookCard = ({ book }: BookCardProps) => {
  // Get user info whether it's embedded or just an ID
  const userInfo = typeof book.userId === "object" ? book.userId : null;

  // Format date (e.g., "Mar 28, 2025")
  const formattedDate = new Date(book.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
      {/* Book Image with Date Badge */}
      <div className="relative h-56 w-full">
        <Link href={`/pages/book/${book._id}`}>
          <Image
            src={book.bookimg}
            alt={book.title}
            className="object-cover cursor-pointer"
            width={"100%"}
            height={"100%"}
            preview={true}
          />
        </Link>

        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {formattedDate}
        </div>

        <span
          className={`${
            categoryClasses[book.Category as keyof typeof categoryClasses] ||
            "bg-gray-100 text-gray-800"
          } text-xs px-2 py-1 rounded absolute top-1 right-1  backdrop-blur-lg `}
        >
          {book.Category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 relative">
        <div className="flex justify-between items-start relative">
          <div className="w-full" >
            <div className="flex items-center justify-between w-full  ">
              <h3 className="font-semibold text-lg line-clamp-1">
                {book.title}
              </h3>
              <span
                className={`${
                  conditionClasses[
                    book.condition.toLowerCase() as keyof typeof conditionClasses
                  ] || "bg-gray-100 text-gray-800"
                } text-xs px-2 py-1 rounded`}
              >
                {book.condition}
              </span>
            </div>

            <p className="text-gray-600 text-sm">
              {book.author === "No author name provided" ? " No author " : book.author}
            </p>
            {userInfo && (
              <p className="text-gray-500 text-xs mt-1">
                {userInfo.city && `${userInfo.city}`}
              </p>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-1">
          {book.description === "No description provided"
            ? "No description"
            : book.description}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span
            className={`text-xs px-2 py-1 rounded ${
              book.status === "Available"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.status}
          </span>

          <Link
            href={`/pages/book/${book._id}`}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <EyeOutlined />
            <span className="text-sm">View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
