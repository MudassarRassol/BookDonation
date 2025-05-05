"use client";
import React, { useState } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/Passwordinput";

const ChangePassword = () => {
  const router = useRouter();
  const [data, setData] = useState({ newpassword: "", confirmPassword: "" });
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(false); // Added loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    if (data.newpassword !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true); // Start loading
      const formData = new FormData();
      formData.append("newpassword", data.newpassword);
      formData.append("resetcode", localStorage.getItem("resetcode") || ""); // Retrieve stored reset code
      const response = await axios.put(`/api/auth/forgetpassword`, formData);

      if (response.status === 200) {
        localStorage.removeItem("resetcode");
        setSuccess("✅ Password updated successfully!");
        router.push("/")
      }
    } catch (err) {
      console.log("Error: " + err);
      if (axios.isAxiosError(err) && err.response?.status) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div id="changedpassword" className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col  w-[100%] md:w-[450px] border-b-2 p-4 shadow-2xl">
        <h1 className="text-xl text-center text-gray-800 font-bold mb-8">Change Your Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <PasswordInput name="newpassword" placeholder="Enter New Password" onChange={handleChange} value={data.newpassword} />
          <PasswordInput name="confirmPassword" placeholder="Confirm Your Password" onChange={handleChange} value={data.confirmPassword} />
          
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-500 text-xs mt-2">{success}</p>}

          {/* Button with Loading State */}
          <Button text="Change Password" type="submit" loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
