"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal } from "antd";
import Link from "next/link";
import { EyeOutlined } from "@ant-design/icons";
import BookLoader from "@/components/Loader/Loader";
import im from "@/assests/hand-drawn-no-data-concept.png"
interface BookRequest {
  _id: string;
  userId: {
    _id: string;
    email: string;
    userdetailsId: {
      username: string;
      city: string;
      profilephoto: string;
      role: string;
    };
  };
  bookid: {
    _id: string;
    title: string;
    author: string;
    bookimg: string;
    condition: string;
    status: string;
    userId: {
      _id: string;
      userdetailsId: {
        username: string;
        city: string;
        profilephoto: string;
        role: string;
      };
    };
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const RequestsPage = () => {
  const { role, userid } = useSelector((state: RootState) => state.user);
  const [requests, setRequests] = useState<BookRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "cancel" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          role === "donor" ? "/api/donation/request" : "/api/donation/myrequest"
        );
        setRequests(response.data.donation || []);
      } catch (err) {
        setError("Failed to fetch requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [role]);

  // In your handleAction function, update as follows:

  const handleAction = async () => {
    if (!currentRequestId || !actionType) return;

    try {
      setIsProcessing(true);

      // Optimistically update requests state
      setRequests((prevRequests) => {
        if (!prevRequests) return null;

        // For cancellation
        if (actionType === "cancel") {
          return prevRequests.filter(
            (request) => request._id !== currentRequestId
          );
        }

        // For approve/reject
        return prevRequests.map((request) => {
          if (request._id === currentRequestId) {
            return {
              ...request,
              status: actionType === "approve" ? "approved" : "rejected",
            };
          }
          return request;
        });
      });

      // Make API call after optimistic update
      if (actionType === "cancel") {
        await axios.post(`/api/request/cancelrequest`,{
          requestid : currentRequestId
        });
        toast.success("Request cancelled successfully");
      } else {
        const formData = new FormData();
        formData.append("donationId", currentRequestId);
        formData.append(
          "status",
          actionType === "approve" ? "approved" : "rejected"
        );

        await axios.put("/api/donation/donormangerequest", formData);
        toast.success(`Request ${actionType}d successfully`);
      }
    } catch (err) {
      // Revert optimistic update on error
      setRequests((prevRequests) => {
        if (!prevRequests) return null;
        return [...prevRequests]; // Trigger re-render to refetch data
      });

      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || `Failed to ${actionType} request`
        : `Failed to ${actionType} request`;

      toast.error(errorMessage);
      console.error(`Error ${actionType}ing request:`, err);
    } finally {
      setIsProcessing(false);
      setCurrentRequestId(null);
      setActionType(null);
    }
  };

  // Remove all fetchRequests() calls from the success blocks

  const showConfirmModal = (
    requestId: string,
    type: "approve" | "reject" | "cancel"
  ) => {
    setCurrentRequestId(requestId);
    setActionType(type);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <BookLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const userRequests =
    requests?.filter((request) =>
      role === "donor"
        ? request.bookid.userId?._id === userid
        : request.userId._id === userid
    ) || [];

  if (userRequests.length === 0) {
    return (
      <div className="text-center py-8 h-[100vh] flex justify-center items-center flex-col">
        <h2 className="text-xl font-semibold md:mt-20">No requests found</h2>
        <Image 
        src={im}
        alt="hand-drawn-no-data-concept.png"
        width={300}
        height={300}
        />
        {role === "recipient" && (
          <div className="flex flex-col" >
            <Link href="/pages/BookBrowserPage" className="text-blue-500 hover:underline">
              Browse books to make a request
            </Link>
            <Link href="/pages/donationhistory" className="text-red-500 hover:underline">
               Approved or Rejected Book In Donation History
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 md:mt-20">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">
        {role === "donor" ? "Donation Requests" : "My Requests"}
      </h1>

      {/* Confirmation Modal */}
      <Modal
        title={`Confirm ${actionType}`}
        open={!!actionType}
        onOk={handleAction}
        onCancel={() => {
          setCurrentRequestId(null);
          setActionType(null);
        }}
        confirmLoading={isProcessing}
        okText={
          actionType === "cancel" ? "Yes, cancel it" : `Yes, ${actionType} it`
        }
        okButtonProps={{
          danger: actionType === "reject" || actionType === "cancel",
          type: actionType === "approve" ? "primary" : "default",
        }}
        cancelText="No"
        centered
      >
        <p className="my-4">
          {actionType === "approve" &&
            "Are you sure you want to approve this request? The book will be marked as unavailable."}
          {actionType === "reject" &&
            "Are you sure you want to reject this request?"}
          {actionType === "cancel" &&
            "Are you sure you want to cancel this request? This action cannot be undone."}
        </p>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {userRequests.map((request) => (
          <div
            key={request._id}
            className="bg-white rounded-lg shadow-md overflow-hidden relative"
          >
            <div className="relative h-48 w-full">
              <Image
                src={request.bookid.bookimg}
                alt={request.bookid.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="py-4 px-2 relative">
              <Link
                href={`/pages/book/${request.bookid._id}`}
                className="inset-shadow-[5px_0px_4px_#0000005c] rounded-l-3xl hover:scale-110 transition-all duration-500 flex items-center gap-1 absolute top-3 p-3 z-50 right-0"
              >
                <EyeOutlined />
                <span className="text-sm">View Details</span>
              </Link>

              <h3 className="font-semibold text-lg">{request.bookid.title}</h3>
              <p className="text-gray-600 text-sm">
                by {request.bookid.author}
              </p>

              <div className="flex items-center mt-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={
                      role === "donor"
                        ? request.userId.userdetailsId.profilephoto
                        : request.bookid.userId.userdetailsId.profilephoto
                    }
                    alt={
                      role === "donor"
                        ? request.userId.userdetailsId.username
                        : request.bookid.userId.userdetailsId.username
                    }
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {role === "donor"
                      ? `Requested by: ${request.userId.userdetailsId.username}`
                      : `Donor: ${request.bookid.userId.userdetailsId.username}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status}
                </span>

                {role === "donor" && request.status === "pending" ? (
                  <div className="space-x-2">
                    <Button
                      type="primary"
                      onClick={() => showConfirmModal(request._id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      danger
                      onClick={() => showConfirmModal(request._id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button
                    danger
                    onClick={() => showConfirmModal(request._id, "cancel")}
                    disabled={request.status !== "pending"}
                  >
                    Cancel Request
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
