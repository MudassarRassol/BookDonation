'use client';

import { useState, useEffect } from 'react';
import { Card, Tabs, Table, Tag, Avatar, Input, Select, Space, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import BookLoader from '@/components/Loader/Loader';
import axios from 'axios';
import dayjs from 'dayjs';

interface Donation {
  key: string;
  bookName: string;
  bookImage: string | null;
  donorName: string;
  donorEmail: string;
  userEmail: string;
  status: string;
  date: string;
}

const STATUS_COLORS: { [key: string]: string } = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
};

export default function AllDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [donorFilter, setDonorFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get('/api/admin/alldonation');
        const processedData = res.data.data.map((donation: Donation) => ({
          ...donation,
          bookImage: donation.bookImage || null // Convert empty string to null
        }));
        setDonations(processedData);
      } catch {
        setError('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const resetFilters = () => {
    setSearchText('');
    setDateFilter(null);
    setDonorFilter(null);
    setActiveTab('all');
  };

  const filteredDonations = donations.filter((donation) => {
    if (activeTab !== 'all' && donation.status.toLowerCase() !== activeTab) {
      return false;
    }
    
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      if (
        !donation.bookName.toLowerCase().includes(lowerSearch) &&
        !donation.donorName.toLowerCase().includes(lowerSearch) &&
        !donation.donorEmail.toLowerCase().includes(lowerSearch) &&
        !donation.userEmail.toLowerCase().includes(lowerSearch)
      ) {
        return false;
      }
    }
    
    if (dateFilter && !dayjs(donation.date).isSame(dateFilter, 'day')) {
      return false;
    }
    
    if (donorFilter && donation.donorEmail !== donorFilter) {
      return false;
    }
    
    return true;
  });

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'bookImage',
      key: 'bookImage',
      render: (image: string | null, record: Donation) => (
        image ? (
          <Avatar
            src={image}
            alt={record.bookName}
            shape="square"
            style={{
              width: 50,
              height: 50,
              borderRadius: 4,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Avatar
            shape="square"
            style={{
              width: 50,
              height: 50,
              borderRadius: 4,
              backgroundColor: '#f0f2f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {record.bookName.charAt(0).toUpperCase()}
          </Avatar>
        )
      ),
      width: 80,
    },
    { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
    { title: 'Donor Name', dataIndex: 'donorName', key: 'donorName' },
    { title: 'Donor Email', dataIndex: 'donorEmail', key: 'donorEmail' },
    { title: 'User Email', dataIndex: 'userEmail', key: 'userEmail' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status.toLowerCase()]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY h:mm A')
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <BookLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Donations</h1>
        <p className="text-gray-600">View and filter donations by status</p>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-all mb-6">
        <Space size="large" wrap>
          <Input
            placeholder="Search by book, donor, or email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          
          <DatePicker
            placeholder="Filter by date"
            value={dateFilter}
            onChange={setDateFilter}
            style={{ width: 200 }}
            allowClear
          />
          
          <Select
            placeholder="Filter by donor"
            style={{ width: 250 }}
            allowClear
            value={donorFilter}
            onChange={setDonorFilter}
            options={Array.from(new Set(donations.map(d => d.donorEmail)))
              .filter(email => email)
              .map(email => ({
                value: email,
                label: email,
              }))}
            showSearch
            optionFilterProp="label"
          />
          
          <Button 
            type="default" 
            icon={<ReloadOutlined />} 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </Space>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'All Donations' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
          ]}
        />

        <Table
          columns={columns}
          dataSource={filteredDonations}
          pagination={{ pageSize: 6 }}
          scroll={{ x: true }}
          rowKey="key"
        />
      </Card>
    </div>
  );
}