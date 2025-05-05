"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { 
  Spin, 
  Input, 
  Select, 
  Button, 
  Empty, 
  Alert, 
  Pagination,
  Tabs,
  Badge,
  Card,
  Image,
  Tag,
  Avatar,
  Tooltip
} from "antd";
import { 
  LoadingOutlined, 
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import Link from "next/link";
import debounce from "lodash.debounce";

const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

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
    }
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

const BookBrowserPage = () => {
  const { userid, role } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    search: "",
    condition: "",
    status: "",
    category: ""
  });
  const [activeTab, setActiveTab] = useState("all");

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        search: filters.search,
        condition: filters.condition,
        status: filters.status,
        category: filters.category
      };

      const headers = {
        userid,
        role
      };

      const response = await axios.get(`${role === 'recipient' || role === 'donor' ? '/api/book/getallbooks' : '/api/book/guestallbook'}`, { params, headers });
      console.log(response)
      if (response.data.success) {
        setBooks(response.data.data);
        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        });
      } else {
        setError(response.data.message || "Failed to load books");
      }
    } catch (err) {
      setError("Failed to fetch books");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchBooks = useCallback(
    debounce((page = 1) => fetchBooks(page), 500),
    [filters, role, userid]
  );

  useEffect(() => {
    debouncedFetchBooks();
    return () => debouncedFetchBooks.cancel();
  }, [filters, activeTab, debouncedFetchBooks]);

  const handleSearch = (value: string) => {
    setFilters({...filters, search: value});
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const newFilters = {...prev, [key]: value};
      if (key === 'status') {
        let newTab = 'all';
        if (value === 'Available') newTab = 'available';
        if (value === 'Not Available') newTab = 'unavailable';
        setActiveTab(newTab);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      condition: "",
      status: "",
      category: ""
    });
    setActiveTab("all");
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    let statusFilter = "";
    if (key === "available") statusFilter = "Available";
    if (key === "unavailable") statusFilter = "Not Available";
    setFilters(prev => ({...prev, status: statusFilter}));
  };

  const getStatusCounts = () => {
    const available = books.filter(b => b.status === "Available").length;
    const unavailable = books.filter(b => b.status === "Not Available").length;
    return { available, unavailable, total: books.length };
  };

  const statusCounts = getStatusCounts();

  const getConditionColor = (condition: string) => {
    const conditionMap: Record<string, string> = {
      NEW: "green",
      GOOD: "blue",
      FAIR: "orange",
      POOR: "red"
    };
    return conditionMap[condition] || "gray";
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Available: "success",
      "Not Available": "error"
    };
    return statusMap[status] || "default";
  };

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      Fiction: "magenta",
      "Non-Fiction": "cyan",
      "Science Fiction": "purple",
      Fantasy: "gold",
      Biography: "orange",
      History: "red",
      "Self-Help": "green",
      Romance: "pink",
      Mystery: "geekblue",
      Thriller: "volcano"
    };
    return categoryMap[category] || "default";
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:mt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {role === "donor" ? "My Books Library" : "Book Exchange Marketplace"}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {role === "donor" 
              ? "Manage your donated books" 
              : "Find your next great read"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Search
              placeholder="Search by title, author, or description"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              onSearch={handleSearch}
              className="flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select
              placeholder="Condition"
              style={{ width: 120 }}
              allowClear
              value={filters.condition || null}
              onChange={(value) => handleFilterChange("condition", value)}
              options={conditionOptions}
            />

            <Select
              placeholder="Category"
              style={{ width: 160 }}
              allowClear
              value={filters.category || null}
              onChange={(value) => handleFilterChange("category", value)}
            >
              <Option value="Fiction">Fiction</Option>
              <Option value="Non-Fiction">Non-Fiction</Option>
              <Option value="Science Fiction">Science Fiction</Option>
              <Option value="Fantasy">Fantasy</Option>
              <Option value="Biography">Biography</Option>
              <Option value="History">History</Option>
              <Option value="Self-Help">Self-Help</Option>
              <Option value="Romance">Romance</Option>
              <Option value="Mystery">Mystery</Option>
              <Option value="Thriller">Thriller</Option>
            </Select>

            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetFilters}
              className="ml-auto"
            >
              Reset Filters
            </Button>
          </div>

          <div className="mt-4">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: "all",
                  label: (
                    <span className="flex items-center">
                      All Books <Badge count={statusCounts.total} className="ml-2" />
                    </span>
                  ),
                },
                {
                  key: "available",
                  label: (
                    <span className="flex items-center">
                      Available <Badge count={statusCounts.available} className="ml-2" />
                    </span>
                  ),
                },
                {
                  key: "unavailable",
                  label: (
                    <span className="flex items-center">
                      Unavailable <Badge count={statusCounts.unavailable} className="ml-2" />
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
          )}

          {error && !loading && (
            <div className="p-4">
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
              />
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="p-8 text-center">
              <Empty
                description={
                  <span className="text-gray-600 text-lg">
                    No books found matching your criteria
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <Button 
                type="primary" 
                onClick={resetFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                 <Card
                 className="shadow-md hover:shadow-lg transition-shadow duration-300"
                 key={book._id}
                 hoverable
                 cover={
                   <div className="relative h-48">
                     <Image
                       src={book.bookimg || "/book-placeholder.jpg"}
                       alt={book.title}
                       height={200}
                       width={"100%"}
                       className="object-cover w-full "
                     />
                   </div>
                 }
                 actions={[
                   <Link href={`/pages/book/${book._id}`} key="view">
                     <Tooltip title="View Details">
                       <EyeOutlined className="text-blue-500" />
                     </Tooltip>
                   </Link>
                 ]}
               >
                 <Meta
                   title={
                     <span className="font-semibold flex justify-between items-center text-black">
                       {book.title}
                       <div className="text-xsm text-gray-500">
                       by {book.author}
                       </div>
                     </span>
                   }
                   description={
                     <div className="space-y-2">
                       <div className="flex flex-wrap gap-1">
                         <Tag color={getStatusColor(book.status)}>{book.status}</Tag>
                         <Tooltip title={`Condition: ${book.condition}`}>
                           <Tag color={getConditionColor(book.condition)}>{book.condition}</Tag>
                         </Tooltip>
                         <Tag color={getCategoryColor(book.Category)}>{book.Category}</Tag>
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center">
                           {book.userId?.userdetailsId?.profilephoto ? (
                             <Avatar
                               src={book.userId.userdetailsId.profilephoto}
                               size="small"
                               className="mr-2"
                             />
                           ) : (
                             <Avatar icon={<UserOutlined />} size="small" className="mr-2" />
                           )}
                           <span className="text-sm text-gray-800">
                             {book.userId?.userdetailsId?.username || "Anonymous"}
                           </span>
                         </div>
                         <Tooltip title={`Added ${new Date(book.createdAt).toLocaleDateString()}`}>
                           <div className="flex items-center text-xs text-gray-500">
                             <ClockCircleOutlined className="mr-1" />
                             {new Date(book.createdAt).toLocaleDateString('en-US', {
                               month: 'short',
                               day: 'numeric',
                             })}
                           </div>
                         </Tooltip>
                       </div>
                     </div>
                   }
                 />
               </Card>
               
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Pagination
                  current={pagination.page}
                  total={pagination.total}
                  pageSize={pagination.limit}
                  onChange={fetchBooks}
                  showSizeChanger={false}
                  hideOnSinglePage={true}
                  className="pagination"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookBrowserPage;