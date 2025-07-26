"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  Spin, Input, Select, Button, Empty, Alert, Pagination, Tabs, Badge, Card, Image,
  Tag, Avatar, Tooltip, Layout, Row, Col, Space, Typography, Drawer
} from "antd";
import {
  LoadingOutlined, SearchOutlined, ReloadOutlined, EyeOutlined,
  UserOutlined, ClockCircleOutlined, FilterOutlined
} from "@ant-design/icons";
import Link from "next/link";
import debounce from "lodash.debounce";

const { Content } = Layout;
const { Search } = Input;
const { Text } = Typography;

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

const conditionOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const categoryOptions = [
  { value: 'Fiction', label: 'Fiction' },
  { value: 'Non-Fiction', label: 'Non-Fiction' },
  { value: 'Science Fiction', label: 'Science Fiction' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Biography', label: 'Biography' },
  { value: 'History', label: 'History' },
  { value: 'Self-Help', label: 'Self-Help' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Mystery', label: 'Mystery' },
  { value: 'Thriller', label: 'Thriller' },
  { value: '9th', label: '9th' },
  { value: '10th', label: '10th' },
  { value: '11th', label: '11th' },
  { value: '12th', label: '12th' },
];

const BookBrowserPage = () => {
  const { userid, role } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", condition: "", status: "", category: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchBooks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        role === 'recipient' || role === 'donor' ? '/api/book/getallbooks' : '/api/book/guestallbook',
        {
          params: {
            page,
            limit: pagination.limit,
            search: filters.search,
            condition: filters.condition,
            status: filters.status,
            category: filters.category
          },
          headers: { userid, role }
        }
      );

      if (response.data.success) {
        setBooks(response.data.data);
        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        });
      } else {
        setError(response.status == 501 ? "No Intertnet Connection " : response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, role, userid]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchBooks = useCallback(
    debounce((page = 1) => fetchBooks(page), 500),
    [fetchBooks]
  );

  useEffect(() => {
    debouncedFetchBooks();
    return () => debouncedFetchBooks.cancel();
  }, [filters, activeTab, debouncedFetchBooks]);

  const handleSearch = (value: string) => setFilters({ ...filters, search: value });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      if (key === 'status') {
        const newTab = value === 'Available' ? 'available' : value === 'Not Available' ? 'unavailable' : 'all';
        setActiveTab(newTab);
      }
      return { ...prev, [key]: value };
    });
  };

  const resetFilters = () => {
    setFilters({ search: "", condition: "", status: "", category: "" });
    setActiveTab("all");
    setDrawerVisible(false);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    const statusFilter = key === "available" ? "Available" : key === "unavailable" ? "Not Available" : "";
    setFilters(prev => ({ ...prev, status: statusFilter }));
  };

  const getStatusCounts = () => {
    const available = books.filter(b => b.status === "Available").length;
    const unavailable = books.filter(b => b.status === "Not Available").length;
    return { available, unavailable, total: books.length };
  };

  const getConditionColor = (condition: string) => ({
    NEW: "green", GOOD: "blue", FAIR: "orange", POOR: "red"
  }[condition] || "gray");

  const getStatusColor = (status: string) => ({
    Available: "success", "Not Available": "error"
  }[status] || "default");

 const getCategoryColor = (category: string) => ({
  Fiction: "magenta",
  "Non-Fiction": "cyan",
  "Science Fiction": "purple",
  Fantasy: "gold",
  Biography: "orange",
  History: "red",
  "Self-Help": "green",
  Romance: "pink",
  Mystery: "geekblue",
  Thriller: "volcano",
  "9th": "blue",
  "10th": "lime",
  "11th": "green",
  "12th": "purple"
}[category] || "default");

  const statusCounts = getStatusCounts();

  return (
    <Layout className="min-h-screen md:mt-20">
      <Content className="bg-white p-4 sm:p-8 w-full">
        <div className="mx-auto">
          <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle" className="mb-4">
  <Col xs={24} sm={6} md={4} lg={3}>
    <Text strong className="text-lg whitespace-nowrap">
      {
        role === "recipient"  ? "All Books" :"My Books" 
      }
    </Text>
  </Col>
  <Col xs={24} sm={18} md={20} lg={21}>
    <Search
      className="w-full"
      placeholder="Search by title, author, or description"
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      onSearch={handleSearch}
    />
  </Col>
</Row>
            <Button
                  icon={<FilterOutlined />}
                  block
                  onClick={() => setDrawerVisible(true)}
                  className=" w-auto max-w-[120px] ml-auto mt-3  float-right"
                >
                  Filters
                </Button>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              className="mt-4"
              items={[
                {
                  key: "all",
                  label: <span>All Books <Badge count={statusCounts.total} /></span>,
                },
                {
                  key: "available",
                  label: <span>Available <Badge count={statusCounts.available} /></span>,
                },
                {
                  key: "unavailable",
                  label: <span>Unavailable <Badge count={statusCounts.unavailable} /></span>,
                },
              ]}
            />
          </Card>
          <br />
          <Card className="shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
              </div>
            ) : error ? (
              <Alert message="Error" description={error} type="error" showIcon closable />
            ) : books.length === 0 ? (
              <div className="p-8 text-center">
                <Empty
                  description={<Text type="secondary" className="text-lg">No books found</Text>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Button type="primary" onClick={resetFilters} className="mt-4">Clear Filters</Button>
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}  >
                  {books.map((book) => (
                    <Col key={book._id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        cover={
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={book.bookimg || "/book-placeholder.jpg"}
                              alt={book.title}
                              height="100%"
                              width="100%"
                              style={{ objectFit: 'cover' }}
                              preview={false}
                            />
                          </div>
                        }
                        actions={[
                          <Link href={`/pages/book/${book._id}`} key="view">
                            <Tooltip title="View Details">
                              <Button type="text" icon={<EyeOutlined />} />
                            </Tooltip>
                          </Link>
                        ]}
                      >
                        <Card.Meta
                          title={<Text strong ellipsis={{ tooltip: book.title }}>{book.title}</Text>}
                          description={
                            <>
                              <Text type="secondary">by {book.author}</Text>
                              <div className="mt-2">
                                <Space size={[4, 4]} wrap>
                                  <Tag color={getStatusColor(book.status)}>{book.status}</Tag>
                                  <Tag color={getConditionColor(book.condition)}>{book.condition}</Tag>
                                  <Tag color={getCategoryColor(book.Category)}>{book.Category}</Tag>
                                </Space>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Space>
                                  <Avatar src={book.userId?.userdetailsId?.profilephoto} icon={<UserOutlined />} size="small" />
                                  <Text type="secondary">{book.userId?.userdetailsId?.username || "Anonymous"}</Text>
                                </Space>
                                <Tooltip title={`Added ${new Date(book.createdAt).toLocaleDateString()}`}>
                                  <Text type="secondary">
                                    <ClockCircleOutlined className="mr-1" />
                                    {new Date(book.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </Text>
                                </Tooltip>
                              </div>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>

                <div className="flex justify-center mt-8">
                  <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onChange={fetchBooks}
                    showSizeChanger={false}
                    hideOnSinglePage={true}
                  />
                </div>
              </>
            )}
          </Card>

          {/* Responsive Filter Drawer */}
          <Drawer
            title="Filters"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={280}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select
                placeholder="Condition"
                value={filters.condition || undefined}
                onChange={(value) => handleFilterChange("condition", value)}
                options={conditionOptions}
                allowClear
              />
              <Select
                placeholder="Category"
                value={filters.category || undefined}
                onChange={(value) => handleFilterChange("category", value)}
                options={categoryOptions}
                allowClear
              />
              <Button icon={<ReloadOutlined />} onClick={resetFilters} block>
                Reset Filters
              </Button>
            </Space>
          </Drawer>
        </div>
      </Content>
    </Layout>
  );
};

export default BookBrowserPage;
