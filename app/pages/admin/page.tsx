"use client";

import { useState, useEffect } from 'react';
import { Layout, Menu, Spin, Button, Dropdown, message } from 'antd';
import DashboardStats from '@/components/admin/DashboardStats/page';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  GiftOutlined,

  LogoutOutlined,
  MenuOutlined,
  UserOutlined as UserIcon
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Books from '@/components/admin/BooksTable/page';

import AllDonationsPage from '@/components/admin/DonationsTable/page';
import UserManagementTable from '@/components/admin/UsersTable/page';
const { Header, Content, Sider } = Layout;

// ... (keep your existing interfaces and mock data)

export default function AdminDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  // Authentication Check (Mock)
  const isAdmin = true; // Replace with real auth check

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, router]);

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <BookOutlined />, label: 'Books' },
    { key: '3', icon: <GiftOutlined />, label: 'Donations' },
    { key: '4', icon: <UserOutlined />, label: 'Users' }
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear local storage
        localStorage.clear();
        // Redirect to login
        router.push('/login');
      } else {
        message.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1': return <DashboardStats/>;
      case '2': return <Books/>;
      case '3': return <AllDonationsPage/>;
      case '4': return <UserManagementTable/>;
      default: return <div>Select a menu item</div>;
    }
  };

  const isMobile = screenWidth < 768;

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  if (!isAdmin) return <Spin fullscreen />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div className="text-white text-xl font-bold p-4">
          {collapsed ? 'AD' : 'ADMIN'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: 0, 
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: isMobile ? 16 : 24,
          paddingRight: isMobile ? 16 : 24,
        }}>
          {isMobile && (
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginRight: 16 }}
            />
          )}
          
          <div className='flex-1'></div>
          
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button 
              type="text" 
              icon={<UserIcon />} 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                height: '100%'
              }}
            >
              {!isMobile && 'Admin'}
            </Button>
          </Dropdown>
        </Header>

        <Content className="m-0 md:m-4">
          <div className="p-2 md:p-6 bg-white min-h-[calc(100vh-32px)]">
            {loading ? (
              <Spin size="large" className="w-full mt-8" />
            ) : (
              renderContent()
            )}
          </div>
        </Content>
      </Layout>
    </Layout> 
  );
}