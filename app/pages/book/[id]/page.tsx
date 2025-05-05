"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Empty,
  Button,
  Modal,
  message,
  Divider,
  Avatar,
  Tooltip,
} from "antd";
import toast, { Toaster } from "react-hot-toast";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BookLoader from "@/components/Loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Book {
  _id: string;
  title: string;
  author: string;
  bookimg: string;
  condition: string;
  status: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  bookownername: string;
  bookownerphoto: string;
  Category: string;
  isFavorite?: boolean;
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const { role, login, varify, userid } = useSelector(
    (state: RootState) => state.user
  );
  console.log(role, login, varify, userid);
  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/book/bookdetailsbyid/${id}`);

      console.log("1");

      if (response.status === 200) {
        const bookData = response.data.data;

        if (localStorage.getItem("login")) {
          try {
            console.log("run ");
            const favResponse = await axios.post(`/api/check`, {
              data: {
                bookId: id,
                userId: localStorage.getItem("userid"),
              },
            });
            console.log(favResponse);
            console.log(favResponse);
            bookData.isFavorite = favResponse.data.isFavorite;
          } catch (favError) {
            toast.error(
              response.data.message || "Failed to check favorite status"
            );
            console.error("Error checking favorite status:", favError);
            bookData.isFavorite = false;
          }
        }

        setBook({
          ...bookData,
          bookownername: bookData.user?.userdetailsId?.username || "Anonymous",
          bookownerphoto: bookData.user?.userdetailsId?.profilephoto || "",
        });
      } else {
        setError(response.data.message || "Book not found");
      }
    } catch (err) {
      console.error("Failed to fetch book:", err);
      setError(err instanceof Error ? err.message : "Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const toggleFavorite = async () => {
    if (!login) {
      message.warning("Please login to add to favorites");
      return;
    }
    try {
      setFavoriteLoading(true);
      if (book?.isFavorite) {
        await axios.delete("/api/faviourts", {
          data: {
            bookId: id,
            userId: userid,
          },
        });
        toast.success("Removed from favorites");
      } else {
        await axios.post("/api/faviourts", {
          bookId: id,
          userId: userid,
        });
        toast.success("Added to favorites");
      }
      // Update local state immediately for better UX
      setBook((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    } catch (err) {
      console.error("Favorite action failed:", err);
      message.error(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update favorites"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(`/api/book/bookdeletbyid/${id}`);
      if (response.data.success) {
        message.success("Book deleted successfully");
        router.push("/pages/book/All-my-books");
      } else {
        message.error(response.data.message || "Failed to delete book");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Failed to delete book");
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
    }
  };

  const handleRequest = async () => {
    try {
      setIsRequesting(true);
      const formData = new FormData();
      formData.append("bookid", book?._id?.toString() || "");
      formData.append("donorid", book?.userId || "");

      const response = await axios.post(`/api/request/bookrequest`, formData);
      if (response.status === 200) {
        message.success("Book request sent successfully");
        fetchBook();
        setRequestModalVisible(false);
      } else {
        message.error(response.data.message || "Failed to send request");
        setRequestModalVisible(false);
      }
    } catch (err) {
      console.error("Request failed:", err);
      setRequestModalVisible(false);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Failed to send request");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleChatWithDonor = () => {
    if (!login) {
      message.warning("Please login to chat with the donor");
      return;
    }
    router.push(`/pages/chat/${book?.userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[89vh]">
        <BookLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center gap-3 h-[89vh]">
        <div className="max-w-md p-6 md:mt-28">
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
          <br />
          <Button type="primary" onClick={() => router.back()} block>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="max-w-md p-6 text-center">
          <Empty description="Book not found" />
          <Button type="primary" onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getConditionColor = () => {
    switch (book.condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = () => {
    switch (book.Category) {
      case "Fiction":
        return "bg-purple-100 text-purple-800";
      case "Non-Fiction":
        return "bg-cyan-100 text-cyan-800";
      case "Science Fiction":
        return "bg-indigo-100 text-indigo-800";
      case "Fantasy":
        return "bg-fuchsia-100 text-fuchsia-800";
      case "Biography":
        return "bg-amber-100 text-amber-800";
      case "History":
        return "bg-red-100 text-red-800";
      case "Self-Help":
        return "bg-emerald-100 text-emerald-800";
      case "Romance":
        return "bg-pink-100 text-pink-800";
      case "Mystery":
        return "bg-gray-100 text-gray-800";
      case "Thriller":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 md:mt-12">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Books
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50">
            <h1 className="text-xl p-3 md:p-0 md:text-2xl font-bold text-gray-800">
              {book.title}
            </h1>

            <div className="flex items-center gap-4">
              {login && role === "donor" && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/pages/book/edit/${book._id}`}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      className="flex items-center"
                    >
                      Edit
                    </Button>
                  </Link>

                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setDeleteModalVisible(true)}
                    className="flex items-center"
                  >
                    Delete
                  </Button>
                </div>
              )}
              {login &&
              role === "recipient" &&
              varify === "verified" &&
              book.status !== "Not Available" ? (
                <Button
                  type="primary"
                  className="flex items-center gap-2"
                  onClick={() => setRequestModalVisible(true)}
                >
                  <EditOutlined /> Request
                </Button>
              ) : login &&
                role === "recipient" &&
                book.status !== "Not Available" ? (
                <Button
                  type="primary"
                  className="flex items-center gap-2"
                  onClick={() => router.push(`/pages/profile`)}
                >
                  <EditOutlined /> Verify your account
                </Button>
              ) : (
                role === "recipient" && (
                  <span className="text-gray-500">
                    Book is Already Requested
                  </span>
                )
              )}
              {!login && (
                <Link href="/pages/sign-in" className="text-blue-500">
                  Login for request book
                </Link>
              )}
            </div>

            <Tooltip
              title={
                book?.isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Button
                type="text"
                icon={
                  book?.isFavorite ? (
                    <HeartFilled className="text-red-500" />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={toggleFavorite}
                loading={favoriteLoading}
                className="flex items-center hover:text-red-500"
              />
            </Tooltip>
          </div>

          <div className="p-6 md:flex gap-8">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md">
                <Image
                  src={book.bookimg || "/book-placeholder.jpg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>

            <div className="md:w-2/3 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Link
                    href={`/pages/donor-profile/${book.userId}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Avatar
                      src={book?.bookownerphoto}
                      shape="square"
                      size={60}
                      gap={2}
                      icon={<UserOutlined />}
                      className="cursor-pointer"
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/pages/donor-profile/${book.userId}`}
                      className="flex items-center hover:underline cursor-pointer"
                    >
                      <h2 className="text-sm font-semibold text-gray-500">
                        Added By
                        <ArrowRightOutlined className="ml-2" />
                      </h2>
                    </Link>
                    <Link
                      href={`/pages/donor-profile/${book.userId}`}
                      className="text-md md:text-xl text-gray-800 font-bold mt-1 hover:underline cursor-pointer"
                    >
                      {book?.bookownername || "Anonymous"}
                    </Link>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm sm:text-md md:text-lg font-semibold text-gray-500">
                    Author
                  </h2>
                  <p className="text-lg md:text-xl text-gray-800 mt-1">
                    {book.author}
                  </p>
                </div>
              </div>
              <Divider className="my-2" />

              <div className="grid grid-rows-2 grid-cols-2 md:grid-rows-1 md:grid-cols-3 gap-4">
                <div className="border-r">
                  <h2 className="text-sm sm:text-md md:text-lg font-semibold text-gray-500">
                    Condition
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getConditionColor()}`}
                  >
                    {book.condition}
                  </span>
                </div>
                <div className="border-r">
                  <h2 className="text-sm sm:text-md md:text-lg font-semibold text-gray-500">
                    Category
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getCategoryColor()}`}
                  >
                    {book.Category}
                  </span>
                </div>

                <div className="border-t m-auto w-full md:border-0">
                  <h2 className="text-sm sm:text-md md:text-lg font-semibold text-gray-500">
                    Status
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                      book.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
              </div>

              <Divider className="my-2" />

              <div>
                <h2 className="text-lg font-semibold text-gray-500">
                  Description
                </h2>
                <div className="text-gray-700 mt-2 whitespace-pre-line bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto border border-gray-200">
                  {book.description || "No description available"}
                </div>
              </div>

              <Divider className="my-2" />

              <div className="text-sm text-gray-400 flex justify-between items-center">
                <p>
                  Added {dayjs(book.createdAt).fromNow()} •{" "}
                  {dayjs(book.createdAt).format("MMMM D, YYYY")}
                </p>
                <Button
                  icon={<MessageOutlined />}
                  onClick={handleChatWithDonor}
                  disabled={!book.userId}
                >
                  Chat with Donor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={deleting}
        okText="Delete"
        okButtonProps={{ danger: true }}
        centered
      >
        <p className="my-4">
          Are you sure you want to delete this book? This action cannot be
          undone.
        </p>
      </Modal>

      <Modal
        title="Confirm Book Request"
        open={requestModalVisible}
        onOk={handleRequest}
        onCancel={() => setRequestModalVisible(false)}
        confirmLoading={isRequesting}
        okText="Confirm Request"
        okButtonProps={{ type: "primary" }}
        centered
      >
        <p className="my-4">
          Are you sure you want to request this book? Once submitted, the owner
          will be notified of your request.
        </p>
      </Modal>
    </div>
  );
}
