"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadFromLocalStorage } from "@/app/redux/counterSlice";
import { RootState } from "@/app/redux/store";
import Link from "next/link";
import { setRole } from "@/app/redux/counterSlice";
import {
  HomeOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const BottomNavbar = () => {
  const dispatch = useDispatch();
  const { role, login } = useSelector((state: RootState) => state.user);


    useEffect(() => {
      dispatch(loadFromLocalStorage());
      
      // Listen for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'role') {
          dispatch(setRole(e.newValue));
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);


  // Define menu items with icons based on role
  const getMenuItems = () => {
    if (!login) {
      return [
        { name: "Home", path: "/", icon: <HomeOutlined className="text-lg" /> },
        {
          name: "Books",
          path: "/pages/BookBrowserPage",
          icon: <BookOutlined className="text-lg" />,
        },
        {
          name: "About",
          path: "/pages/about",
          icon: <InfoCircleOutlined className="text-lg" />,
        },
        {
          name: "Contact",
          path: "/pages/contact",
          icon: <ContactsOutlined className="text-lg" />,
        },
      ];
    }

    switch (role) {
      case "donor":
        return [
          {
            name: "Home",
            path: "/",
            icon: <HomeOutlined className="text-lg" />,
          },
          {
            name: "Book",
            path: "/pages/book/add-book",
            icon: <PlusOutlined className="text-lg" />,
          },
          {
            name: "Requests",
            path: "/pages/books-requests",
            icon: <BookOutlined className="text-lg" />,
          },
          {
            name: "Message",
            path: "/pages/profile",
            icon: <MessageOutlined className="text-lg" />,
          },
        ];
      case "recipient":
        return [
          {
            name: "Home",
            path: "/",
            icon: <HomeOutlined className="text-lg" />,
          },
          {
            name: "Books",
            path: "/pages/BookBrowserPage",
            icon: <BookOutlined className="text-lg" />,
          },
          {
            name: "Requests",
            path: "/pages/books-requests",
            icon: <ShoppingCartOutlined className="text-lg" />,
          },
          {
            name: "Message",
            path: "/pages/profile",
            icon: <MessageOutlined className="text-lg" />,
          },
        ];
      default:
        return [
          {
            name: "Home",
            path: "/",
            icon: <HomeOutlined className="text-lg" />,
          },
          {
            name: "Books",
            path: "/pages/BookBrowserPage",
            icon: <BookOutlined className="text-lg" />,
          },
          {
            name: "About",
            path: "/pages/about",
            icon: <InfoCircleOutlined className="text-lg" />,
          },
          {
            name: "Contact",
            path: "/pages/contact",
            icon: <ContactsOutlined className="text-lg" />,
          },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <div className={`
        ${
          role === "admin" ? 'pb-0 ' : 'pb-20'
        }`}></div>

      {/* Bottom navbar */}
      <div
        className={
          `fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md border border-b-0 z-50 shadow-lg bg-white rounded-t-2xl
          ${role === "admin" ? 'hidden' : ''}`
        }
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }} // ✅ Safe area inset for mobile
      >
        <div className="flex justify-between  rounded-t-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="flex flex-col items-center justify-center p-3 w-full hover:bg-black hover:text-white active:bg-gray-200 transition-colors"
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
