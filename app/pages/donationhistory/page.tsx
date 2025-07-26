"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Spin, Tabs, Badge, Empty, Alert, Avatar, message } from "antd";
import { LoadingOutlined, EyeOutlined, UserOutlined,ExclamationCircleOutlined } from "@ant-design/icons";
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
  const { userid, role } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const fetchDonationHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/donation/donationhistory");
      if (response.status !== 200) {
        throw new Error(response.data.error || "Failed to load history");
      }

      setDonations(response.data.data?.donationHistory || []);
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch donation history";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    if (!userid) return;

    // Initial fetch
    fetchDonationHistory();

    // Only setup polling if enabled
    if (pollingEnabled) {
      const interval = setInterval(fetchDonationHistory, 30000);
      return () => clearInterval(interval);
    }
  }, [userid, fetchDonationHistory, pollingEnabled]);

  const filteredDonations = donations.filter(donation => 
    activeTab === "all" ? true : donation.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    const conditionMap: Record<string, string> = {
      new: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      fair: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800"
    };
    return conditionMap[condition.toLowerCase()] || "bg-gray-100 text-gray-800";
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
    thriller: "bg-gray-100 text-gray-800",
    "9th": "bg-sky-100 text-sky-800",
    "10th": "bg-emerald-100 text-emerald-800",
    "11th": "bg-lime-100 text-lime-800",
    "12th": "bg-amber-100 text-amber-800"
  };

  return categoryMap[category.toLowerCase()] || "bg-gray-100 text-gray-800";
};


  const togglePolling = () => {
    setPollingEnabled(!pollingEnabled);
    message.info(`Live updates ${!pollingEnabled ? "enabled" : "disabled"}`);
  };

  if (!userid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Authentication Required"
          description="Please login to view your donation history"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (loading && donations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
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
          
          <button
            onClick={togglePolling}
            className={`mt-4 px-4 py-2 rounded-md ${pollingEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-colors`}
          >
            {pollingEnabled ? 'Disable' : 'Enable'} Live Updates
          </button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
            />
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="donation-tabs"
            items={[
              {
                key: "all",
                label: (
                  <span className="flex items-center gap-2">
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
                  <span className="flex items-center gap-2">
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
                  <span className="flex items-center gap-2">
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
  {filteredDonations.map((donation) => (
    <div
      key={donation._id}
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
        !donation.bookid ? 'opacity-75' : ''
      }`}
    >
      {donation.bookid ? (
        <>
          <div className="relative h-48 w-full">
            <Image
              src={donation.bookid.bookimg || "/book-placeholder.jpg"}
              alt={donation.bookid.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
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

            <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-12">
              {donation.bookid.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {(donation.donorId?.userdetailsId?.profilephoto || donation.userId?.userdetailsId?.profilephoto) ? (
                  <Avatar
                    src={role === 'donor' 
                      ? donation.userId?.userdetailsId?.profilephoto 
                      : donation.donorId?.userdetailsId?.profilephoto}
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
                  {role === 'donor' 
                    ? `Requested by ${donation.userId?.userdetailsId?.username || "Anonymous"}` 
                    : role === 'recipient' 
                      ? donation.donorId?.userdetailsId?.username || "Anonymous"
                      : "Anonymous"}
                </span>
              </div>

              <Link
                href={`/pages/book/${donation.bookid._id}`}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                prefetch={false}
              >
                <EyeOutlined className="mr-1" />
                View
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 h-full flex flex-col justify-center items-center text-center">
          <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
            <ExclamationCircleOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Book No Longer Available
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This book has been deleted by the user
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar
                  icon={<UserOutlined />}
                  size="small"
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">
                  {role === 'donor' 
                    ? `Requested by ${donation.userId?.userdetailsId?.username || "Anonymous"}` 
                    : role === 'recipient' 
                      ? donation.donorId?.userdetailsId?.username || "Anonymous"
                      : "Anonymous"}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-400">
                Deleted
              </span>
            </div>
          </div>
        </div>
      )}
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