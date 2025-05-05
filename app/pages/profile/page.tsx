"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Button, Modal, message, Tag, Card } from "antd";
import { EditOutlined, UserOutlined, SwapOutlined, MailOutlined, EnvironmentOutlined, HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setRole } from "@/app/redux/counterSlice";
import {
  loadFromLocalStorage 
} from "@/app/redux/counterSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import BookLoader from "@/components/Loader/Loader";
interface AccountData {
  _id: string;
  email: string;
  status: string;
  account: string;
  details?: {
    _id: string;
    username: string;
    city: string;
    address: string;
    profilephoto?: string;
    role: string;
  };
}

const AccountPage = () => {
 const dispatch = useDispatch();
  const {varify} = useSelector((state: RootState) => state.user);  
  const router = useRouter();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
      dispatch(loadFromLocalStorage());
    }, [dispatch]);

  const fetchAccountDetails = async () => {
    try {
      const response = await axios.get("/api/profile/myprofile");
      if (response.data.success) {
        setAccount(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
      message.error("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    fetchAccountDetails();
  }, [router]);

  const handleSwitchRole = async () => {
    if (!account?.details) return;
  
    setSwitchLoading(true);
    try {
      const newRole = account.details.role === "donor" ? "recipient" : "donor";
      
      const response = await axios.post(
        '/api/profile/switchrole',
        { role: newRole },
        {
          headers: {
            userid: account._id
          }
        }
      );
  
      if (response.data.success) {
        fetchAccountDetails()
        // Update Redux store
        dispatch(setRole(newRole));
        
        // Update localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...userData, role: newRole }));
        
        // Force update all tabs/windows
        window.dispatchEvent(new Event("storage"));
        
        message.success(`You are now a ${newRole}`);
      }
    } catch (error) {
      console.error("Error switching role:", error);
      message.error("Failed to switch role");
    } finally {
      setSwitchLoading(false);
      setModalVisible(false);
    }
  };
  const sendemailvarificationcode = async () => {
    try {
      // Send the request with the email in the body (for POST request)
      const response = await axios.post("/api/auth/email/emailvarification", {
        email: account?.email, // Send the email address
      });

      if (response.status !== 200) {
        throw new Error("Failed to send verification email");
      }else{
        message.success("Verification email sent successfully!");
        router.push("/pages/emailvarification"); // Redirect to the check code page
      }
  
      // Handle response after sending the email
      console.log("Verification email sent:", response.data);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };
  
  const getRoleColor = (role?: string) => {
    switch(role) {
      case 'donor': return 'blue';
      case 'recipient': return 'green';
      case 'admin': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BookLoader/>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="text-center p-8">
          <p className="text-lg">Failed to load account details</p>
          <Button 
            type="primary" 
            onClick={() => router.refresh()}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] md:mt-20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar
                size={120}
                src={account.details?.profilephoto}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-lg"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">
                  {account.details?.username || "No username set"}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Tag color={getRoleColor(account.details?.role)} className="capitalize">
                    {account.details?.role || "No role set"}
                  </Tag>
                  <Tag color={account.status === 'verified' ? 'green' : 'orange'}>
                    {account.status}
                  </Tag>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MailOutlined className="text-lg text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{account.email}</p>
                  </div>
                </div>

                {account.details?.city && (
                  <div className="flex items-start gap-3">
                    <EnvironmentOutlined className="text-lg text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="text-gray-800">{account.details.city}</p>
                    </div>
                  </div>
                )}

                {account.details?.address && (
                  <div className="flex items-start gap-3">
                    <HomeOutlined className="text-lg text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">{account.details.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Account Status
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <Tag color={getRoleColor(account.details?.role)} className="text-base capitalize">
                    {account.details?.role || "Not specified"}
                  </Tag>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <Tag color={account.status === 'verified' ? 'green' : 'orange'}>
                    {account.status === 'verified' ? 'Verified' : 'Pending Verification'}
                  </Tag>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Account Standing</p>
                  <Tag color={account.account === 'active' ? 'green' : 'red'}>
                    {account.account === 'active' ? 'Active' : 'Restricted'}
                  </Tag>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-wrap justify-center gap-4">
            <Link href="/pages/userdetails/update-user-data">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="large"
                className="min-w-[200px]"
              >
                Edit Profile
              </Button>
            </Link>

            {account.details?.role && ['donor', 'recipient'].includes(account.details.role) && (
              <Button
                type="default"
                icon={<SwapOutlined />}
                size="large"
                loading={switchLoading}
                onClick={() => setModalVisible(true)}
                className="min-w-[200px]"
              >
                Switch to {account.details.role === "donor" ? "Recipient" : "Donor"}
              </Button>
            )}
            {
               varify === "non-verified" && (
                <Button
                type="default"
                color="primary"
                icon={<SwapOutlined />}
                size="large"
                loading={switchLoading}
                onClick={sendemailvarificationcode}
                className="min-w-[200px]"
              >
               Verify your account
              </Button>
              )
            }
          </div>
        </div>
      </div>

      {/* Switch Role Confirmation Modal */}
      <Modal
        title="Confirm Role Change"
        open={modalVisible}
        onOk={handleSwitchRole}
        onCancel={() => setModalVisible(false)}
        confirmLoading={switchLoading}
        okText={`Yes, switch to ${account.details?.role === "donor" ? "Recipient" : "Donor"}`}
        cancelText="Cancel"
        okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
      >
        <div className="p-4">
          <p className="text-lg mb-4">
            You are about to change your account role to{" "}
            <span className="font-semibold">
              {account.details?.role === "donor" ? "Recipient" : "Donor"}
            </span>.
          </p>
          <p className="text-gray-600">
            This will change the features available to you. Are you sure you want to proceed?
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AccountPage;