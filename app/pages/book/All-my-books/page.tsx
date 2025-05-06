"use client";

import BookCard from "@/components/Card/BookCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { Spin, Empty, Alert, Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface Book {
  _id: string;
  title: string;
  author: string;
  bookimg: string;
  condition: string;
  status: string;
  description: string;
  Category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/book/getmybooks?page=${pagination.page}&limit=${pagination.limit}`, {
          headers: {
            userid: localStorage.getItem('userId') // Get from your auth system
          }
        });
        
        setBooks(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError(err instanceof Error ? err.message : "Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
        />
      </div>
    );
  }

  return (
    <div className="p-4 ">
      <h1 className="text-3xl font-bold mb-8 mt-2 md:mt-20">My Books Collection</h1>
      
      {books.length === 0 ? (
        <Empty description="No books found in your collection" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {books.map((books) => (
              <BookCard key={books._id} book={books} />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}