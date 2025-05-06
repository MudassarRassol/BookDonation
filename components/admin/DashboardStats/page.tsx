'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Table, Tag, Avatar, Alert } from 'antd';
import { 
  BookOutlined, GiftOutlined, UserOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import axios from 'axios';
import { Breakpoint } from 'antd';


interface DashboardStats {
  totalBooks: number;
  totalDonations: number;
  totalUsers: number;
  pendingDonations: number;
  approvedDonations: number;
  rejectedDonations: number;
}

interface MonthlyData {
  name: string;
  books: number;
  donations: number;
}

interface UserStats {
  totalUsers: number;
  admins: number;
  librarians: number;
  members: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface Donation {
  key: string;
  bookName: string;
  donorEmail: string;
  status: string;
  date: string;
  bookImage: string;
}

const STATUS_COLORS: { [key: string]: string } = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red'
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('')
  console.log('userStats', userStats)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          statsRes, 
          monthlyRes, 
          userRes, 
          catRes, 
          donationsRes
        ] = await Promise.all([
          axios.get('/api/admin/getstats'),
          axios.get('/api/admin/monthly-stats'),
          axios.get('/api/admin/user-stats'),
          axios.get('/api/admin/book-categories'),
          axios.get('/api/admin/recent-donations')
        ]);

        console.log('API Responses:', {
          stats: statsRes.data,
          monthly: monthlyRes.data,
          users: userRes.data,
          categories: catRes.data,
          donations: donationsRes.data
        });

        setStats(statsRes.data.data);
        setMonthlyData(monthlyRes.data.data);
        setUserStats(userRes.data.data);
        setCategories(catRes.data.data);
        setRecentDonations(donationsRes.data.data);
        console.log(
          statsRes
        )
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const lineChartData = monthlyData.map(item => ({
    month: item.name,
    books: item.books,
    donations: item.donations
  }));


  const donationStatusData = stats ? [
    { type: 'Pending', value: stats.pendingDonations },
    { type: 'Approved', value: stats.approvedDonations },
    { type: 'Rejected', value: stats.rejectedDonations }
  ] : [];

  console.log('Chart Data:', donationStatusData);

  const columnChartData = categories.map(item => ({
    category: item.name,
    value: item.value
  }));

  // Table columns
  const donationColumns = [
    { 
      title: 'Book Cover',
      key: 'bookImage',
      dataIndex: 'bookImage',
      width: 100,
      responsive: ['md'] as Breakpoint[],
      render: (_: unknown, record: Donation) => (
        <Avatar 
          src={record.bookImage} 
          alt={record.bookName}
          shape="square"
          style={{ 
            width: 50, 
            height: 50, 
            borderRadius: 4,
            objectFit: 'cover' 
          }}
        />
      )
    },
    { 
      title: 'Book', 
      dataIndex: 'bookName', 
      key: 'bookName',
      responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[]
    },
    { 
      title: 'Donor', 
      dataIndex: 'donorEmail', 
      key: 'donor',
      responsive: ['sm', 'md', 'lg'] as Breakpoint[]
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[],
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status.toLowerCase()]}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      responsive: ['md', 'lg'] as Breakpoint[]
    }
  ];

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spin size="large" tip="Loading Dashboard..." />
    </div>
  );

  if (error) return (
    <div className="w-full h-screen flex items-center justify-center">
      <Alert message={error} type="error" showIcon />
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base">Real-time statistics and insights</p>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6 md:mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm hover:shadow-md transition-all h-full">
            <Statistic
              title="Total Books"
              value={stats?.totalBooks ?? 0}
              prefix={<BookOutlined className="text-blue-500" />}
              className="p-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm hover:shadow-md transition-all h-full">
            <Statistic
              title="Total Donations"
              value={stats?.totalDonations ?? 0}
              prefix={<GiftOutlined className="text-green-500" />}
              className="p-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm hover:shadow-md transition-all h-full">
            <Statistic
              title="Total Users"
              value={stats?.totalUsers ?? 0}
              prefix={<UserOutlined className="text-purple-500" />}
              className="p-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm hover:shadow-md transition-all h-full">
            <Statistic
              title="Pending Donations"
              value={stats?.pendingDonations ?? 0}
              prefix={<HistoryOutlined className="text-yellow-500" />}
              className="p-2"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-6 md:mb-8">
        {/* Monthly Progress - Line Chart */}
        <Col xs={24} md={12}>
          <Card 
            title="Monthly Progress" 
            hoverable 
            className="shadow-sm hover:shadow-md transition-all h-full"
          >
            <div className="h-[300px]">
              {lineChartData.length > 0 ? (
                <Line 
                  data={lineChartData}
                  xField="month"
                  yField="books"
                  seriesField="type"
                  color="#1979C9"
                  xAxis={{ title: { text: 'Month' } }}
                  yAxis={{ title: { text: 'Count' } }}
                  legend={{ position: 'top' }}
                  smooth
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Alert message="No monthly data available" type="info" showIcon />
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* User Distribution - Pie Chart
        <Col xs={24} md={12}>
          <Card 
            title="User Distribution" 
            hoverable 
            className="shadow-sm hover:shadow-md transition-all h-full"
          >
            <div className="h-[300px]">
              {pieChartData.length > 0 ? (
                <Pie 
                  data={pieChartData}
                  angleField="name"
                  colorField="type"
                  radius={0.8}
                  label={{ type: 'outer', content: '{name}: {percentage}' }}
                  interactions={[{ type: 'element-active' }]}
                  color={['#0088FE', '#00C49F', '#FFBB28']}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Alert message="No user data available" type="info" showIcon />
                </div>
              )}
            </div>
          </Card>
        </Col> */}

        {/* Top Book Categories - Column Chart */}
        <Col xs={24} md={12}>
          <Card 
            title="Top Book Categories" 
            hoverable 
            className="shadow-sm hover:shadow-md transition-all h-full"
          >
            <div className="h-[300px]">
              {columnChartData.length > 0 ? (
                <Column 
                  data={columnChartData}
                  xField="category"
                  yField="value"
                  label={{ position: 'middle' }}
                  color="#4FAAEB"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Alert message="No category data available" type="info" showIcon />
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Donation Status - Pie Chart */}
        <Col xs={24} md={12}>
  <Card 
    title="Donation Status" 
    hoverable 
    className="shadow-sm hover:shadow-md transition-all h-full"
  >
    <div className="h-[300px]">
      {donationStatusData.length > 0 ? (
        <Pie 
          data={donationStatusData}
          angleField="value"
          colorField="type"
          radius={0.8}
          innerRadius={0.6}
          label={{
            type: 'outer',
            content: '{name} ({percentage})',
            style: {
              fill: '#333',
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
          legend={{
            position: 'bottom',
            itemName: {
              style: {
                fill: '#666',
              },
            },
          }}
          interactions={[
            { type: 'element-active' },
            { type: 'legend-highlight' }
          ]}
          color={['#FFBB28', '#52C41A', '#F5222D']}
          statistic={{
            title: {
              style: {
                color: '#333',
              },
              content: 'Total',
            },
            content: {
              style: {
                color: '#333',
                fontSize: '24px',
                fontWeight: 'bold',
              },
              formatter: () => {
                const total = donationStatusData.reduce((sum, item) => sum + item.value, 0);
                return `${total}`;
              },
            },
          }}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <Alert message="No donation data available" type="info" showIcon />
        </div>
      )}
    </div>
  </Card>
</Col>
      </Row>

      {/* Recent Donations Table */}
      <Card 
        title="Recent Donations" 
        hoverable 
        className="shadow-sm hover:shadow-md transition-all"
      >
        <Table
          columns={donationColumns}
          dataSource={recentDonations}
          pagination={{ 
            pageSize: 5,
            responsive: true,
            showSizeChanger: false
          }}
          scroll={{ x: true }}
          size="middle"
        />
      </Card>
    </div>
  );
}