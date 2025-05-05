"use client";

import BookCard from "@/components/Card/BookCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { Spin, Empty, Alert, Pagination, Input, Select, Row, Col } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";

interface Book {
  _id: string;
  title: string;
  author: string;
  bookimg: string;
  condition: string;
  status: string;
  description: string;
  userId: {
    username: string;
    city: string;
    profilephoto: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    condition: "",
    status: ""
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0
  });


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          status: filters.status
        });
        
        if (searchQuery) params.append('search', searchQuery);
        if (filters.condition) params.append('condition', filters.condition);
    
        const response = await axios.get(`/api/book/guestallbooks?${params.toString()}`);
        const data =  response.data;
        console.log(data)
        if (response.status === 200) {
          setBooks(data.data || []);
          console.log(books)
          setPagination(prev => ({
            ...prev,
            total: data.data.pagination?.total || 0
          }));
        } else {
          throw new Error(data.data.message || 'Failed to load books');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [pagination.page, searchQuery, filters.condition, filters.status]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleConditionFilter = (value: string) => {
    setFilters(prev => ({ ...prev, condition: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8 mt-2 md:mt-20">Browse All Books</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by title or author"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by condition"
              style={{ width: '100%' }}
              onChange={handleConditionFilter}
              allowClear
              options={[
                { value: 'New', label: 'New' },
                { value: 'Good', label: 'Good' },
                { value: 'Fair', label: 'Fair' },
                { value: 'Poor', label: 'Poor' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by availability"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={handleStatusFilter}
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'Not Available', label: 'Not Available' },
              ]}
            />
          </Col>
        </Row>
      </div>

{books.length === 0 ? (
        <Empty description="No books found matching your criteria" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {books && books.map((book) => (
              <BookCard 
                key={book._id} 
                book={{
                  ...book,
                  username: book.userId?.username,
                  city: book.userId?.city,
                  profilephoto: book.userId?.profilephoto
                }} 
              />
            ))}
          </div>
          
          <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
        </>
      )}
    </div>
  );
}