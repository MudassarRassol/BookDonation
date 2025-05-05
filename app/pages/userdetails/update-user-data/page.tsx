"use client";

import React, { useState, useEffect } from "react";
import {  Spin } from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import axios from "axios";
import Input from "@/components/Input";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { setImage as setReduxImage, setCity } from "@/app/redux/counterSlice";
import { useDispatch } from "react-redux";

interface ProfileData {
  username: string;
  city: string;
  address: string;
  profilephoto?: string;
}

const UpdateProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [data, setData] = useState<ProfileData>({
    username: "",
    city: "",
    address: ""
  });

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile/myprofile");
        console.log(response)
        if (response.data.data.details) {
          const profile = response.data.data.details;
          setData({
            username: profile.username,
            city: profile.city,
            address: profile.address,
            profilephoto: profile.profilephoto
          });
          if (profile.profilephoto) {
            setImagePreview(profile.profilephoto);
          }
        } else {
          setError(response.data.message || "Failed to load profile");
          toast.error(response.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load profile details");
        toast.error("Failed to load profile details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setImage(selectedFile);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!data.username || !data.city || !data.address) {
      setError("All fields are required");
      setLoading(false);
      toast.error("Please fill all required fields");
      return;
    }

    if (data.username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("city", data.city);
    formData.append("address", data.address);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put("/api/userdetails/updateinfo", formData);

      if (response.status === 200) {
        if (response.data.user.profilephoto) {
          dispatch(setReduxImage(response.data.user.profilephoto));
        }
        dispatch(setCity(response.data.user.city));
        
        toast.success("Profile updated successfully", {
          duration: 3000,
          position: "top-center",
        });
        setTimeout(() => router.push("/pages/profile"), 1500);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Spin indicator={<EditOutlined className="text-4xl animate-spin" />} />
        <p className="mt-4 text-lg text-gray-600">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br mt-10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeftOutlined className="mr-2" />
          Back to Profile
        </button>

        <div className="rounded-xl shadow-lg overflow-hidden bg-white">
          <div className="md:flex">
            {/* Profile Image Upload */}
            <div className="md:w-1/3 p-6 border-r border-gray-200 flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-md group">
                {imagePreview || data.profilephoto ? (
                  <Image
                    src={imagePreview || data.profilephoto || ""}
                    alt="Profile Photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <label
                  htmlFor="profilephoto"
                  className="absolute inset-0 bg-[#00000039] bg-opacity-20 group-hover:bg-opacity-20 flex items-center justify-center cursor-pointer transition-all duration-300"
                >
                  <div className="bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <EditOutlined className="text-xl text-blue-600" />
                  </div>
                </label>
                <input
                  onChange={handleFileChange}
                  type="file"
                  id="profilephoto"
                  name="profilephoto"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center">
                Click on the image to change your profile photo
              </p>
            </div>

            {/* Profile Form */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Update Profile
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Input
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={data.username}
                      onChange={handleChange}
                      required
                      length={3}
                    />
                  </div>
                  
                  <div>
                    <Input
                      name="city"
                      type="text"
                      placeholder="City"
                      value={data.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                      placeholder="Enter your address..."
                      required
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    text={loading ? "Updating..." : "Update Profile"}
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default UpdateProfilePage;