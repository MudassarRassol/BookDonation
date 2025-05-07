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

export default function AdminDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const isAdmin = true; // Replace with real auth check

  // Set initial screen width and handle resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Redirect if not admin
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
        localStorage.clear();
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

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout
      }
    ]
  };

  if (!isAdmin) return <Spin tip="Loading...">
  <div>Content being loaded...</div>
</Spin>
;

  return (
    <Layout className="min-h-screen w-full">
      {/* Fixed Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        width={250}
        className="fixed h-full overflow-y-auto z-20"
        trigger={null}
      >
        <div className="text-white text-xl font-bold p-4 h-16 flex items-center justify-center">
          {collapsed ? 'AD' : 'ADMIN DASHBOARD'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
          className="h-[calc(100%-64px)] border-r-0"
        />
      </Sider>

      {/* Main Content Area with dynamic margin */}
      <Layout 
        className={`transition-all duration-200 min-h-screen ${collapsed ? 'ml-[80px]' : 'ml-[250px]'}`}
        style={{ background: '#f0f2f5' }}
      >
        {/* Fixed Header */}
        <Header className="fixed top-0 right-0 w-[calc(100%-250px)] z-10 bg-white shadow-sm flex items-center justify-between px-6 h-16" 
          style={{ 
            width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
            transition: 'width 0.2s'
          }}
        >
          <div className="flex items-center">
            {isMobile && (
              <Button 
                type="text" 
                icon={<MenuOutlined />} 
                onClick={() => setCollapsed(!collapsed)}
                className="mr-4"
              />
            )}
          </div>
          
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button 
              type="text" 
              icon={<UserIcon />} 
              className="flex items-center"
            >
              {!isMobile && 'Admin User'}
            </Button>
          </Dropdown>
        </Header>

        {/* Scrollable Content */}
        <Content className="mt-16 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow p-6 min-h-[calc(100vh-112px)]">
            {loading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Spin size='large' >
                Loading content...
                </Spin>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}