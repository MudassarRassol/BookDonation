"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import nodata from "@/assests/hand-drawn-no-data-concept.png"
import {
  Button,
  Card,
  Image,
  Tag,
  Tooltip,
  Pagination,
  message,
  Skeleton,
  Row,
  Col,
  Typography
} from "antd";
import {
  HeartFilled,
  ArrowLeftOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  HeartOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookLoader from "@/components/Loader/Loader";

const { Title, Text } = Typography;

interface Book {
  _id: string;
  title: string;
  author: string;
  bookimg: string;
  condition: string;
  status: string;
  description: string;
  Category: string;
  userId: {
    userdetailsId: {
      profilephoto: string;
      username: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { userid, login } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
  });

  const fetchFavoriteBooks = async (page = 1) => {
    if (!login) return;
    
    try {
      setLoading(true);
      const response = await axios.get("/api/allfav", {
        params: {
          page,
          limit: pagination.limit,
        },
      });

      if (response.data.success) {
        setBooks(response.data.data);
        setPagination({
          ...pagination,
          page,
          total: response.data.total,
        });
      } else {
        message.error(response.data.message || "Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      message.error("Failed to load favorite books");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (bookId: string) => {
    try {
      setRemovingId(bookId);
      const response = await axios.delete("/api/faviourts", {
        data: {
          bookId: bookId,
          userId: userid,
        },
      });

      if (response.data.success) {
        message.success("Removed from favorites");
        fetchFavoriteBooks(pagination.page);
      } else {
        message.error(response.data.message || "Failed to remove");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      message.error("Failed to remove from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    if (login) {
      fetchFavoriteBooks();
    } else {
      setLoading(false);
    }
  }, [login]);

  // if (!login) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
  //       <Empty
  //         image="/empty-favorites.svg"
  //         imageStyle={{ height: 260 }}
  //         description={
  //           <Title level={4} className="text-gray-600 mt-4">
  //             Please login to view your favorite books
  //           </Title>
  //         }
  //       />
  //       <Space className="mt-6">
  //         <Button
  //           type="primary"
  //           size="large"
  //           onClick={() => router.push("/pages/sign-in")}
  //         >
  //           Sign In
  //         </Button>
  //         <Button
  //           size="large"
  //           onClick={() => router.push("/pages/sign-up")}
  //         >
  //           Create Account
  //         </Button>
  //       </Space>
  //     </div>
  //   );
  // }

  if (loading && books.length === 0) {
    return (
      <div className=" w-full h-screen flex justify-center items-center ">
        <BookLoader />
      </div>
    );
  }

  if (books.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 md:mt-20">

            <Image
            src={nodata.src}
            alt="No data available"
            width={300}
            height={300}
            />
            <Title level={4} className="text-gray-600 mt-4">
              Your favorites list is empty
            </Title>
        <Button
          type="primary"
          size="large"
          className="mt-6"
          onClick={() => router.push("/pages/book/All-books")}
        >
          Discover Books
        </Button>
      </div>
    );
  }



  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Available: "success",
      "Not Available": "error",
    };
    return statusMap[status] || "default";
  };

  return (
    <div className="min-h-screen  md:mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Title level={2} className="!mb-2 text-gray-800 ">
              My Favorite Books
            </Title>
            <Text type="secondary">
              {pagination.total} book{pagination.total !== 1 ? 's' : ''} in your collection
            </Text>
          </div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="flex items-center"
          >
            Back
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {books.map((book) => (
            <Col xs={24} sm={12} md={8} lg={5} key={book._id}>
              <Card
                hoverable
                cover={
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={book.bookimg || "/book-placeholder.jpg"}
                      alt={book.title}
                      fill
                      className="object-cover cursor-pointer aspect-square "
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      // height={300}

                      preview={false}
                      placeholder={
                        <Skeleton.Image active className="w-full h-full" />
                      }
                    />

                  </div>
                }
                actions={[
                  <Tooltip title="View Details" key="view">
                    <Link href={`/pages/book/${book._id}`}>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        className="text-blue-500"
                      />
                    </Link>
                  </Tooltip>,
                  <Tooltip title="Remove from favorites" key="favorite">
                    <Button
                      type="text"
                      icon={
                        removingId === book._id ? (
                          <HeartOutlined className="text-gray-400" />
                        ) : (
                          <HeartFilled className="text-red-500" />
                        )
                      }
                      loading={removingId === book._id}
                      onClick={() => removeFavorite(book._id)}
                      disabled={removingId === book._id}
                    />
                  </Tooltip>,
                ]}
                className="h-full flex flex-col"
                bodyStyle={{ flexGrow: 1 }}
              >
<div className="flex items-center justify-between gap-2">
  <Title
    level={5}
    className="!mb-0 !text-sm text-gray-800 truncate w-2/3"
    title={book.title}
  >
    {book.title}
  </Title>
  <Tooltip
    title={`Added ${new Date(book.createdAt).toLocaleDateString()}`}
  >
    <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
      <ClockCircleOutlined className="mr-1" />
      {new Date(book.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}
    </div>
  </Tooltip>
</div>

              </Card>
            </Col>
          ))}
        </Row>

        {pagination.total > pagination.limit && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={fetchFavoriteBooks}
              showSizeChanger={false}
              responsive
              className="mt-8"
            />
          </div>
        )}
      </div>
    </div>
  );
}