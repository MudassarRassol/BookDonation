// src/components/LayoutWrapper.tsx
"use client"
import { Spin } from "antd";
import dynamic from 'next/dynamic';
import { useUserRole } from '@/components/useUserRole';

// Dynamically import client-side only components
const UpperNavbar = dynamic(() => import("@/components/Navber/UpperNavber"), { ssr: false });
const BottomNavbar = dynamic(() => import("@/components/Navber/BottomNavber"), { ssr: false });
const AdminDashboard = dynamic(() => import("./Admin"), { ssr: false });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useUserRole();

  if (isLoading || isAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spin size="large" className="text-blue-500" />
        <p className="mt-4 text-lg">Loading application...</p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UpperNavbar />
      <main className="flex-grow">{children}</main>
      <BottomNavbar />
    </div>
  );
}