"use client";

import React, { useState, useEffect } from "react";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import axios from "axios";
import Input from "@/components/Input";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import BookLoader from "@/components/Loader/Loader";

interface BookData {
  title: string;
  author: string;
  condition: string;
  description: string;
  bookimg?: string;
  Category?: string;
  bookId?: string; // Added bookId property
}

const EditBookPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [data, setData] = useState<BookData>({
    title: "",
    author: "",
    condition: "",
    description: "",
    Category: "",
  });

  // Fetch existing book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/book/bookdetailsbyid`,
                                        data{
                                          id
                                        });
        if (response.data.success) {
          const book = response.data.data;
          setData({
            title: book.title,
            author: book.author,
            condition: book.condition,
            description: book.description,
            bookimg: book.bookimg,
            Category: book.Category,
            bookId : book._id
          });
          if (book.bookimg) {
            setImagePreview(book.bookimg);
          }
        } else {
          setError(response.data.message || "Failed to load book");
          toast.error(response.data.message || "Failed to load book");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load book details");
        toast.error("Failed to load book details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImage(selectedFile);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!data.title || !data.author || !data.condition || !data.description) {
      setError("All fields are required");
      setLoading(false);
      toast.error("Please fill all required fields");
      return;
    }

    if (data.title.length < 4) {
      setError("Title must be at least 4 characters");
      setLoading(false);
      return;
    }

    if (data.author.length < 3) {
      setError("Author name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (data.description.length < 10) {
      setError("Description must be at least 10 characters");
      setLoading(false);
      return;
    }



    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("condition", data.condition);
    formData.append("description", data.description);
    formData.append("Category", data.Category || "");
    if (data.bookId) {
      formData.append("bookId", data.bookId);
    }
    if (image) {
      formData.append("bookimg", image);
    }

    try {
      const response = await axios.put(`/api/book/editbook`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Book updated successfully", {
          duration: 3000,
          position: "top-center",
        });
        setTimeout(() => router.push(`/pages/book/${id}`), 1500);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <BookLoader/>
        <p className="mt-4 text-lg text-gray-600">Loading book details...</p>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br mt-10  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeftOutlined className="mr-2" />
          Back to Book
        </button>

        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Image Upload - Fixed Section */}
            <div className="md:w-1/3 p-6 border-r border-gray-200 flex flex-col">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md group">
                {imagePreview || data.bookimg ? (
                  <Image
                    src={imagePreview || data.bookimg || ""}
                    alt="Book Cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <label
                  htmlFor="bookimg"
                  className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center cursor-pointer transition-all duration-300"
                >
                  <div className="bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <EditOutlined className="text-xl text-blue-600" />
                  </div>
                </label>
                <input
                 title="file"
                  onChange={handleFileChange}
                  type="file"
                  id="bookimg"
                  name="bookimg"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center">
                Click on the image to change the book cover
              </p>
            </div>

            {/* Book Form - Fixed Section */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Edit Book Details
              </h1>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      name="title"
                      type="text"
                      placeholder="Book Title"
                      value={data.title}
                      onChange={handleChange}
                      required
                      length={4}
                    />
                  </div>

                  <div>
                    <Input
                      name="author"
                      type="text"
                      placeholder="Author Name"
                      value={data.author}
                      onChange={handleChange}
                      required
                      length={3}
                    />
                  </div>
                  <br />
                  <div>
                    <select
                      name="condition"
                      value={data.condition}
                      onChange={handleChange}
                      title="condtion"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="" disabled>
                        Select Book Condition
                      </option>
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="Category"
                      value={data.Category}
                      onChange={handleChange}
                      required
                      title="category"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="" disabled>
                        Select Book Category
                      </option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Biography">Biography</option>
                      <option value="History">History</option>
                      <option value="Self-Help">Self-Help</option>
                      <option value="Romance">Romance</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Thriller">Thriller</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    placeholder="Enter book description..."
                    required
                    minLength={10}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    text={loading ? "Updating..." : "Update Book"}
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default EditBookPage;
