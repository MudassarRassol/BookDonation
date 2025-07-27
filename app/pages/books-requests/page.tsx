"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal, DatePicker, TimePicker, Input, Form } from "antd";
import Link from "next/link";
import { EyeOutlined, EnvironmentOutlined } from "@ant-design/icons";
import BookLoader from "@/components/Loader/Loader";
import im from "@/assests/hand-drawn-no-data-concept.png";
import dayjs from "dayjs";

const { TextArea } = Input;

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
  const [form] = Form.useForm();
  const [locationLoading, setLocationLoading] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    address: string | null;
  }>({
    latitude: null,
    longitude: null,
    address: null,
  });

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

  const getLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const address = response.data.display_name || "Current location";

            setUserLocation({
              latitude,
              longitude,
              address,
            });

            form.setFieldsValue({
              location: address,
            });
          } catch (error) {
            console.error("Error getting address:", error);
            setUserLocation({
              latitude,
              longitude,
              address: null,
            });
            form.setFieldsValue({
              location: "Current location (address not available)",
            });
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Could not get your location. Please enter pickup location manually."
          );
          setLocationLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  const handleAction = async () => {
    if (!currentRequestId || !actionType) return;

    try {
      setIsProcessing(true);

      if (actionType === "approve") {
        try {
          // Validate all form fields
          await form.validateFields();
        } catch (err) {
          console.log(err);
          // Validation will automatically show error messages
          setIsProcessing(false);
          return; // Don't proceed if validation fails
        }
      }

      setRequests((prevRequests) => {
        if (!prevRequests) return null;

        if (actionType === "cancel") {
          return prevRequests.filter(
            (request) => request._id !== currentRequestId
          );
        }

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

      if (actionType === "cancel") {
        await axios.post(`/api/request/cancelrequest`, {
          requestid: currentRequestId,
        });
        toast.success("Request cancelled successfully");
      } else {
        const formData = new FormData();
        formData.append("donationId", currentRequestId);
        formData.append(
          "status",
          actionType === "approve" ? "approved" : "rejected"
        );

        if (actionType === "approve") {
          const values = await form.validateFields(); // This will ensure we have valid values
          formData.append("donorMessage", values.message || "");
          formData.append("pickupLocation", values.location);
          formData.append("pickupDate", values.date.format("YYYY-MM-DD"));
          formData.append("pickupTime", values.time.format("HH:mm"));

          if (userLocation.latitude && userLocation.longitude) {
            formData.append("latitude", userLocation.latitude.toString());
            formData.append("longitude", userLocation.longitude.toString());
          }
        }

        await axios.put("/api/donation/donormangerequest", formData);
        toast.success(`Request ${actionType}d successfully`);
      }
    } catch (err) {
      setRequests((prevRequests) => {
        if (!prevRequests) return null;
        return [...prevRequests];
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
      form.resetFields();
      setUserLocation({
        latitude: null,
        longitude: null,
        address: null,
      });
    }
  };

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
        <h2 className="text-xl font-semibold md:mt-4">
          Once your request is approved by the donor, their address and the
          pickup time will be sent to your email.
        </h2>

        <Image
          src={im}
          alt="hand-drawn-no-data-concept.png"
          width={300}
          height={300}
        />
        {role === "recipient" && (
          <div className="flex flex-col">
            <Link
              href="/pages/BookBrowserPage"
              className="text-blue-500 hover:underline"
            >
              Browse books to make a request
            </Link>

            <Link
              href="/pages/donationhistory"
              className="text-red-500 hover:underline"
            >
              Approved or Rejected Book In Donation History
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 md:mt-20 max-w-7xl">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">
        {role === "donor" ? "Donation Requests" : "My Requests"}
      </h1>

      <Modal
        title={`Confirm ${actionType}`}
        open={!!actionType}
        onOk={handleAction}
        onCancel={() => {
          setCurrentRequestId(null);
          setActionType(null);
          form.resetFields();
          setUserLocation({
            latitude: null,
            longitude: null,
            address: null,
          });
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
        width={actionType === "approve" ? 700 : 520}
      >
        <p className="my-4">
          {actionType === "approve" &&
            "Are you sure you want to approve this request? The book will be marked as unavailable."}
          {actionType === "reject" &&
            "Are you sure you want to reject this request?"}
          {actionType === "cancel" &&
            "Are you sure you want to cancel this request? This action cannot be undone."}
        </p>

        {actionType === "approve" && (
          <Form form={form} layout="vertical" className="mt-6">
            <Form.Item
              name="location"
              label="Pickup Location"
              rules={[
                {
                  required: true,
                  message: "Please enter pickup location",
                },
                {
                  validator(_, value) {
                    if (!value || value.trim().length === 0) {
                      return Promise.reject(
                        new Error("Please enter a valid pickup location")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Enter the pickup address"
                  required={false}
                />
                <Button
                  type="default"
                  onClick={getLocation}
                  loading={locationLoading}
                  icon={<EnvironmentOutlined />}
                >
                  Use My Location
                </Button>
              </div>
              {userLocation.address && (
                <div className="mt-2 text-sm text-green-600">
                  <p>Detected location: {userLocation.address}</p>
                  {userLocation.latitude && userLocation.longitude && (
                    <p>
                      Coordinates: {userLocation.latitude.toFixed(4)},{" "}
                      {userLocation.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              )}
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="date"
                label="Pickup Date"
                rules={[
                  {
                    required: true,
                    message: "Please select pickup date",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || value >= dayjs().startOf("day")) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Pickup date cannot be in the past")
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                name="time"
                label="Pickup Time"
                rules={[
                  {
                    required: true,
                    message: "Please select pickup time",
                  },
                ]}
              >
                <TimePicker className="w-full" format="HH:mm" minuteStep={15} />
              </Form.Item>
            </div>

            <Form.Item
              name="message"
              label="Message to Recipient (Optional)"
              rules={[
                {
                  max: 500,
                  message: "Message cannot exceed 500 characters",
                },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Any special instructions for pickup..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userRequests.map((request) => (
          <div
            key={request._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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

            <div className="p-4 relative">
              <Link
                href={`/pages/book/${request.bookid._id}`}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform duration-300"
                title="View Book Details"
              >
                <EyeOutlined className="text-gray-700" />
              </Link>

              <h3 className="font-semibold text-lg truncate">
                {request.bookid.title}
              </h3>
              <p className="text-gray-600 text-sm truncate">
                by {request.bookid.author}
              </p>

              <div className="flex items-center mt-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 border border-gray-200">
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
                  <p className="text-sm font-medium truncate">
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
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>

                {role === "donor" && request.status === "pending" ? (
                  <div className="space-x-2">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => showConfirmModal(request._id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      danger
                      size="small"
                      onClick={() => showConfirmModal(request._id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button
                    danger
                    size="small"
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
