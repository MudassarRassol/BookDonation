"use client";

import BookCard from "@/components/Card/BookCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { Spin, Empty, Alert } from "antd";
import { LoadingOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import 'swiper/css';
import 'swiper/css/pagination';
import Link from "next/link";
const GetRecentBOOK = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        role === 'donor' 
          ? "/api/book/getdonorrecent" 
          : role === 'recipient' 
            ? '/api/book/getreceipentrecent' 
            : '/api/book/getguestrecent'
      );
      setBooks(response.data.books || []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError(err instanceof Error ? err.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [role]); // Add role as dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="p-4">
        <Empty
          description="No books found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {
            role === 'donor' ? ' Your Recent Books' : ' Recent Books '
          }
        </h2>
        <Link href="/pages/BookBrowserPage" className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer">
          See All <ArrowRightOutlined className="ml-1" />
        </Link>
      </div>

      {/* Mobile/Tablet View - Swiper Carousel */}
      <div className="md:hidden">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="book-swiper"
          breakpoints={{
            375: {
              slidesPerView: 1.3,
              spaceBetween: 15
            },
            425: {
              slidesPerView: 1.5,
              spaceBetween: 15
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 25
            }
          }}
        >
          {books.map((book, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View - Grid Layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default GetRecentBOOK;