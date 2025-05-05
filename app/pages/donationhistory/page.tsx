"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Spin, Tabs, Badge, Empty, Alert, Avatar } from "antd";
import { LoadingOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

interface Donation {
  _id: string;
  status: "approved" | "rejected" | "pending";
  bookid: {
    _id: string;
    title: string;
    author: string;
    bookimg: string;
    condition: string;
    description: string;
    Category: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  donorId?: {
    email: string;
    userdetailsId: {
      profilephoto: string;
      username: string;
    };
  };
  userId?: {
    _id: string;
    email: string;
    username?: string;
    userdetailsId: {
      profilephoto: string;
      username: string;
    };
  };
}

const DonationHistoryPage = () => {
  const { userid,role } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchDonationHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/donation/donationhistory");
      if (response.data.success) {
        // Use only the donationHistory array from the response
        const allDonations = [...(response.data.data.donationHistory || [])];
        setDonations(allDonations);
      } else {
        setError(response.data.error || "Failed to load history");
      }
    } catch (err) {
      setError("Failed to fetch donation history");
      console.error("Error fetching donation history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userid) {
      // Initial fetch
      fetchDonationHistory();
      
      // Set up polling every 30 seconds
      const interval = setInterval(fetchDonationHistory, 30000);
      setPollingInterval(interval);

      // Clean up interval on unmount
      return () => {
        if (pollingInterval) {
          clearInterval(pollingInterval);
        }
      };
    }
  }, [userid, fetchDonationHistory]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const filteredDonations = donations.filter(donation => 
    activeTab === "all" ? true : donation.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    const conditionMap: Record<string, string> = {
      new: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      fair: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800"
    };
    return conditionMap[condition] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      fiction: "bg-blue-100 text-blue-800",
      "non-fiction": "bg-green-100 text-green-800",
      "science fiction": "bg-purple-100 text-purple-800",
      fantasy: "bg-yellow-100 text-yellow-800",
      biography: "bg-orange-100 text-orange-800",
      history: "bg-red-100 text-red-800",
      "self-help": "bg-teal-100 text-teal-800",
      romance: "bg-pink-100 text-pink-800",
      mystery: "bg-indigo-100 text-indigo-800",
      thriller: "bg-gray-100 text-gray-800"
    };
    return categoryMap[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Donation History
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Track all your book donations in one place
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="donation-tabs"
            items={[
              {
                key: "all",
                label: (
                  <span className="flex items-center">
                    All Donations
                    <Badge
                      count={donations.length}
                      className="ml-2"
                      style={{ backgroundColor: '#6b7280' }}
                    />
                  </span>
                ),
              },
              {
                key: "approved",
                label: (
                  <span className="flex items-center">
                    Approved
                    <Badge
                      count={donations.filter(d => d.status === "approved").length}
                      className="ml-2"
                      style={{ backgroundColor: '#10b981' }}
                    />
                  </span>
                ),
              },
              {
                key: "pending",
                label: (
                  <span className="flex items-center">
                    Pending
                    <Badge
                      count={donations.filter(d => d.status === "pending").length}
                      className="ml-2"
                      style={{ backgroundColor: '#f59e0b' }}
                    />
                  </span>
                ),
              },
              {
                key: "rejected",
                label: (
                  <span className="flex items-center">
                    Rejected
                    <Badge
                      count={donations.filter(d => d.status === "rejected").length}
                      className="ml-2"
                      style={{ backgroundColor: '#ef4444' }}
                    />
                  </span>
                ),
              },
            ]}
          />

          {filteredDonations.length === 0 ? (
            <div className="mt-8">
              <Empty
                description={
                  <span className="text-gray-500">
                    No {activeTab === "all" ? "" : activeTab} donations found
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDonations.map((donation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={donation.bookid.bookimg || "/book-placeholder.jpg"}
                      alt={donation.bookid.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {donation.status.charAt(0).toUpperCase() +
                          donation.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {donation.bookid.title}
                      </h3>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(
                            donation.bookid.condition
                          )}`}
                        >
                          {donation.bookid.condition}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mb-3 justify-between">
                      <p className="text-sm text-gray-600 mb-1">
                        by {donation.bookid.author}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                          donation.bookid.Category
                        )}`}
                      >
                        {donation.bookid.Category}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-1 mb-4">
                      {donation.bookid.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        { (donation.donorId?.userdetailsId?.profilephoto || donation.userId?.userdetailsId?.profilephoto ) ? (
                          <Avatar
                            src={role === 'donor' ? donation.userId?.userdetailsId?.profilephoto : donation.donorId?.userdetailsId?.profilephoto }
                            
                            size={30}
                            className="mr-2"
                          />
                        ) : (
                          <Avatar
                            icon={<UserOutlined />}
                            size="small"
                            className="mr-2"
                          />
                        )}
                        <span className="text-sm text-gray-600">
                          
                          {
                            role === 'donor' ?  'Requested   ' + donation.userId?.userdetailsId?.username : role === 'recipent' ? donation.donorId?.userdetailsId?.username : "Anonymous"
                          }
                        </span>
                      </div>

                      <Link
                        href={`/pages/book/${donation.bookid._id}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryPage;