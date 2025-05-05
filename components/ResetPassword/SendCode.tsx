"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import axios from "axios";
import Input from "@/components/Input";

const Page = () => {
  const [data, setData] = useState({ email: "" });
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [count, setCount] = useState(60);

  // Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (disable) {
      timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDisable(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [disable]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    setLoading(true); // Start loading
    setCount(60);

    try {
      const response = await axios.get(`/api/auth/forgetpassword?email=${encodeURIComponent(data.email)}`);
      setDisable(true);
      if (response.status === 200) {
        setSuccess("✅ We've sent a reset code to your email");

        // Scroll to the checkcode section
        setTimeout(() => {
          document.getElementById("checkcode")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch (err) {
      setDisable(false);
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
    <div id="sendcode" className="w-full  flex flex-col justify-center items-center   ">
      <div className="flex flex-col  w-[100%] md:w-[450px] border-b-2 p-4 shadow-2xl ">
        <h1 className="text-xl text-center text-gray-800 font-bold mb-8 mt-3">
          Enter Your Email
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input 
            type="email" 
            placeholder="Enter Your Email" 
            required 
            name="email" 
            value={data.email} 
            onChange={handleChange} 
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-500 text-xs mt-2">{success}</p>}
          {disable && <p className="text-gray-600 text-xs mt-2">Resend in {count}s</p>}
          
          {/* Button with Loading State */}
          <Button text="Send Code" type="submit" loading={loading} />
        </form>

        <p className="text-center text-gray-600 mt-8">
          Back to
          <Link className="ml-1 text-blue-500" href={"/pages/sign-in"}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
