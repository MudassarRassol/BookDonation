// components/LayoutWrapper.tsx
'use client';

import UpperNavber from "@/components/Navber/UpperNavber";
import BottomNavber from "@/components/Navber/BottomNavber";
import AdminDashboard from "./Admin";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize as true

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setLoading(false); // Set loading to false after checking role
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" className="text-blue-500" />
        <p className="mt-4 text-lg">Loading...</p>
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
      <UpperNavber />
      <main className="flex-grow">{children}</main>
      <BottomNavber />
    </div>
  );
}