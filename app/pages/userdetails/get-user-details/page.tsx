"use client";
import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import axios from "axios";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { setImage as setReduxImage, setRole, setCity , setVarify } from "@/app/redux/counterSlice";
import { useDispatch } from "react-redux";
const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [data, setData] = useState({
    username: "",
    city: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);

      // Create object URL for preview
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (!data.username || !data.city || !data.address || !data.role) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("city", data.city);
    formData.append("address", data.address);
    formData.append("role", data.role);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post("/api/auth/addinfo", formData);
      dispatch(setReduxImage(response.data.user.profilephoto))
      dispatch(setRole(response.data.user.role))
      dispatch(setCity(response.data.user.city))
      dispatch(setVarify('true'))
      router.push('/pages/profile')
      if (response.status == 200) {
        setData({ username: "", city: "", address: "", role: "" });
        setImage(null);
        setImagePreview(null);
        setError(null);
        router.push('/pages/profile')
      } else {
        setError(response.data.message);
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
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div className="w-full mt-4 md:mt-10  h-[85vh] md:h-[89vh] overflow-hidden flex items-center justify-center">
      <div className=" w-[100%] md:w-[450px] flex flex-col border-b-2 p-4 shadow-2xl relative">
        <div className=" absolute top-0 left-0  bg-red-100   z-50 my-4 p-2 " >
          Information compulsory
        </div>
        {/* Image Upload Section */}
        <div className="m-auto relative mb-4 overflow-hidden">
          <Avatar
            shape="square"
            style={{ width: "100%", height: "300px" }}
            src={
              imagePreview ||
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            }
          />
          <label
            htmlFor="image"
            className="bg-white absolute bottom-0 right-0 rounded-tl-2xl shadow-2xl hover:scale-125 transition-all duration-300 p-3 flex flex-col items-center cursor-pointer"
          >
            <EditOutlined className="text-xl" />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* File Input */}
          <input
            onChange={handleFileChange}
            type="file"
            id="image"
            name="image"
            accept="image/*"
            hidden
          />

          <Input name="username" type="text" placeholder="UserName" value={data.username} onChange={handleChange} required />
          <Input name="city" type="text" placeholder="Your City" value={data.city} onChange={handleChange} required />
          <Input name="address" type="text" placeholder="Your Address" value={data.address} onChange={handleChange} required />

          {/* Role Selection */}
          <select
            title="Select Role"
            value={data.role}
            onChange={handleChange}
            name="role"
            required
            className="p-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="" disabled>
              Select a Role
            </option>
            <option value="donor">Donor</option>
            <option value="recipient">Recipient</option>
          </select>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <Button text="Add Info" type="submit" loading={loading} disabled={loading} />
        </form>
      </div>
    </div>
  );
};

export default Page;
