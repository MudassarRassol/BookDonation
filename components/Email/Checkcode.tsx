"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import axios from "axios";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter(); // Initialize router
  const [data, setData] = useState({ code: "" });
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(false); // Loading state


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    setLoading(true); // Start loading

    try {
      const response = await axios.post(`/api/auth/email/checkemailvarificationcode`, {
        code: data.code,
      });

      if (response.status === 200) {
        setSuccess("✅ Account Varified Code is correct");
        localStorage.setItem("varify", "verified"); // Store verification status in local storage
        router.push("/pages/profile"); // Redirect to login page
      }
    } catch (err) {
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
    <div
      id="checkcode"
      className="w-full h-screen flex flex-col justify-center items-center"
    >
      <div className="flex flex-col  w-[100%] md:w-[450px] border-b-2 p-4 shadow-2xl">
        <h1 className="text-xl text-center text-gray-800 font-bold mb-8">
          Enter Varification Code
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input
            type="number"
            placeholder="Varify"
            required
            name="code"
            value={data.code}
            onChange={handleChange}
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-500 text-xs mt-2">{success} 
          </p>}
          <Link href="https://mail.google.com/mail/u/0/#spam" target="_blank" className=" text-blue-500 cursor-pointer " >
            Check your spam folder for the Varification code.
          </Link>  
          {/* Button with Loading State */}
          <Button text="Varify" type="submit" loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default Page;
