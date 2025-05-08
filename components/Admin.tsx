"use client";

import { useState, useEffect } from 'react';
import { Layout, Menu, Spin, Button, Drawer } from 'antd';
import DashboardStats from '@/components/admin/DashboardStats/page';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  GiftOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Books from '@/components/admin/BooksTable/page';
import axios from 'axios';
import AllDonationsPage from '@/components/admin/DonationsTable/page';
import UserManagementTable from '@/components/admin/UsersTable/page';
import { useDispatch } from 'react-redux';
import {  clearLocalStorage } from "@/app/redux/counterSlice";
const { Header, Content } = Layout;

export default function AdminDashboard() {
   const dispatch = useDispatch();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
    
    if (role !== 'admin') {
      router.push('/');
    }
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.delete('/api/auth/logout');
      if (response.status === 200) {
         dispatch(clearLocalStorage());
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      window.location.href = '/';
    } finally {
      setLoading(false);
      setMobileMenuVisible(false);
    }
  };

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard', onClick: () => setSelectedKey('1') },
    { key: '2', icon: <BookOutlined />, label: 'Books', onClick: () => setSelectedKey('2') },
    { key: '3', icon: <GiftOutlined />, label: 'Donations', onClick: () => setSelectedKey('3') },
    { key: '4', icon: <UserOutlined />, label: 'Users', onClick: () => setSelectedKey('4') },
    { key: '5', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout }
  ];



  const renderContent = () => {
    switch (selectedKey) {
      case '1': return <DashboardStats />;
      case '2': return <Books />;
      case '3': return <AllDonationsPage />;
      case '4': return <UserManagementTable />;
      default: return <DashboardStats />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 16px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {isMobile ? (
          <>
            <Button 
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
            />
            <span className="text-lg font-semibold">Admin</span>
          </>
        ) : (
          <span className="text-lg font-semibold">Admin Dashboard</span>
        )}
        
        {!isMobile && (
          <Button 
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            Logout
          </Button>
        )}
      </Header>

      <Layout>
        {isMobile ? (
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={() => setMobileMenuVisible(false)}
            open={mobileMenuVisible}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
          </Drawer>
        ) : (
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems.filter(item => item.key !== '5')} // Exclude logout from horizontal menu
            style={{ lineHeight: '64px' }}
          />
        )}

        <Content className="m-4">
          <div className="p-6 bg-white min-h-[calc(100vh-64px)] rounded-lg shadow-sm">
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