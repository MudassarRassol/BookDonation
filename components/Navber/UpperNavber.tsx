"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import logo from "@/assests/logo.png";
import { Avatar, Dropdown, MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined, LoginOutlined,HistoryOutlined,ContactsOutlined,InsertRowAboveOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import { loadFromLocalStorage, clearLocalStorage, setRole } from "@/app/redux/counterSlice";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const UpperNavbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { login, role, image,Info } = useSelector((state: RootState) => state.user);

  // Load from localStorage on mount
  useEffect(() => {
    dispatch(loadFromLocalStorage());
    
      if (login === true && Info === false && role !== 'admin') {
          router.push('/pages/userdetails/get-user-details')
      }


    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'role') {
        dispatch(setRole(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch, Info, router, login, role]);

  const logout = async () => {
    try {
      const res = await axios.delete('/api/auth/logout');
      if (res.status === 200) {
        dispatch(clearLocalStorage());
        router.push('/pages/sign-in');
      }
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearLocalStorage());
      router.push('/pages/sign-in');
    }
  };

  // Dynamic dropdown items based on role
  const getDropdownItems = (): MenuProps["items"] => {
    const baseItems = [
      { 
        key: "profile", 
        label: "Profile", 
        icon: <UserOutlined />, 
        onClick: () => router.push('/pages/profile') 
      }
    ];

    if (role === 'donor') {
      return [
        ...baseItems,
        { 
          key: "donations", 
          label: "Donations History", 
          icon: <HistoryOutlined />, 
          onClick: () => router.push('/pages/donationhistory') 
        },
        { 
          key: "About Us", 
          label: "About US", 
          icon: <InsertRowAboveOutlined />, 
          onClick: () => router.push('/pages/about') 
        },
        { 
          key: "Contect Us", 
          label: "Contact US", 
          icon: <ContactsOutlined />, 
          onClick: () => router.push('/pages/contact') 
        },

        { 
        key: "logout", 
        label: "Logout", 
        icon: <LogoutOutlined />, 
        danger: true, 
        onClick: logout
      }
      ];
    } else if (role === 'recipient') {
      return [
        ...baseItems,
        { 
          key: "About Us", 
          label: "About US", 
          icon: <InsertRowAboveOutlined />, 
          onClick: () => router.push('/pages/about') 
        },
        { 
          key: "Contect Us", 
          label: "Contact US", 
          icon: <ContactsOutlined />, 
          onClick: () => router.push('/pages/contact') 
        },
        { 
          key: "favorites", 
          label: "favorites", 
          icon: <SettingOutlined />, 
          onClick: () => router.push('/pages/favorites') 
        },
      { 
        key: "logout", 
        label: "Logout", 
        icon: <LogoutOutlined />, 
        danger: true, 
        onClick: logout
      }
      ];
    }

    return baseItems;
  };

  return (
    <div className={
      `
      ${
        role === "admin" ? ' hidden ' : 'w-full flex justify-between items-center p-4 md:absolute md:top-0 md:z-50'
      }

      `
    }>
      {/* Logo */}
      <Link href="/">
        <Image src={logo} alt="Logo" className="w-12 cursor-pointer" />
      </Link>

      {/* Title */}
      <h1 className="text-md md:text-xl font-bold text-center w-full mr-10 text-white drop-shadow-[1px_1px_1px_black]">
        Book Donation
      </h1>

      {/* User Avatar */}
      <div className="fixed top-0 right-0 mt-2 md:mt-4 mr-4 gap-2 z-30">
        <div className="flex items-center justify-center gap-3 z-30">
          {login ? (
            <Dropdown menu={{ items: getDropdownItems() }} trigger={["click"]}>
              <Avatar 
                src={image || "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg"}
                className="shadow-2xl cursor-pointer" 
                size={52} 
              />
            </Dropdown>
          ) : (
            <Link href="/pages/sign-in" className="flex flex-col items-center cursor-pointer">
              <LoginOutlined className="text-2xl mt-2" />
              <span className="text-sm">Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpperNavbar;