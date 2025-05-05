'use client';
import { Table, Tag, Avatar, Button, Modal, Descriptions, Image, Spin, message, Input, Select, Space } from 'antd';
import { EyeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  status: 'verified' | 'non-verified';
  account: string;
  createdAt: string;
  updatedAt: string;
  userdetailsId: {
    _id: string;
    username: string;
    city: string;
    address: string;
    profilephoto: string;
    role: 'admin' | 'donor' | 'recipient';
  };
}

const UserManagementTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/getalluser');
        setUsers(response.data.Users);
        setFilteredUsers(response.data.Users);
      } catch (error) {
        message.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    
    // Apply search filter (now searches username, city, email, and address)
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(user => 
        user.userdetailsId?.username?.toLowerCase().includes(lowerSearch) ||
        user.userdetailsId?.city?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.userdetailsId?.address?.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      result = result.filter(user => user.userdetailsId?.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [searchText, roleFilter, statusFilter, users]);

  const showUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const resetFilters = () => {
    setSearchText('');
    setRoleFilter(null);
    setStatusFilter(null);
    setFilteredUsers(users);
  };

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      render: (_: any, record: User) => (
        <div className="flex items-center">
          <Avatar 
            src={record.userdetailsId?.profilephoto} 
            alt={record.userdetailsId?.username}
            size="large"
          />
          <span className="ml-2 font-medium">{record.userdetailsId?.username}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'verified' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (_: any, record: User) => (
        <Tag color={
          record.userdetailsId?.role === 'admin' ? 'red' : 
          record.userdetailsId?.role === 'donor' ? 'blue' : 'green'
        }>
          {record.userdetailsId?.role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'City',
      key: 'city',
      render: (_: any, record: User) => (
        <span>{record.userdetailsId?.city || 'N/A'}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => showUserDetails(record)}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Space size="large" wrap>
          <Input
            placeholder="Search by name, city, email or address"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          
          <Select
            placeholder="Filter by role"
            style={{ width: 150 }}
            allowClear
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'donor', label: 'Donor' },
              { value: 'recipient', label: 'Recipient' },
            ]}
          />

          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: 'verified', label: 'Verified' },
              { value: 'non-verified', label: 'Non-verified' },
            ]}
          />

          <Button 
            type="default" 
            icon={<ReloadOutlined />} 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        title="User Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Profile Photo">
              <Image
                width={150}
                src={selectedUser.userdetailsId?.profilephoto}
                alt={selectedUser.userdetailsId?.username}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {selectedUser.userdetailsId?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={
                selectedUser.userdetailsId?.role === 'admin' ? 'red' : 
                selectedUser.userdetailsId?.role === 'donor' ? 'blue' : 'green'
              }>
                {selectedUser.userdetailsId?.role?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedUser.status === 'verified' ? 'green' : 'orange'}>
                {selectedUser.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {selectedUser.userdetailsId?.city || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {selectedUser.userdetailsId?.address || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Account Status">
              <Tag color={selectedUser.account === 'active' ? 'green' : 'red'}>
                {selectedUser.account.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Account Created">
              {new Date(selectedUser.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {new Date(selectedUser.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementTable;