"use client";
import React, { useState } from "react";
import Input from "@/components/Input";
import Link from "next/link";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/Passwordinput";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false); // ✅ Fix state initialization

  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // ✅ Start loading

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false); // ✅ Reset loading
      return;
    }

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const response = await axios.post("/api/auth/sign-up", formData);
      setSuccess(response.data.message);
      setData({ email: "", password: "", confirmPassword: "" });
      router.push("/pages/sign-in");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false); // ✅ Reset loading after request completes
    }
  };

  return (
    <div className="w-full h-[80vh] md:h-[89vh] overflow-hidden flex justify-center items-center">
      <div className="flex flex-col w-[450px] border-b-2 p-4 shadow-2xl justify-center md:mt-40">
        <h1 className="text-xl text-center text-gray-800 font-bold mt-2 mb-8">
          Sign-up to Book Donation
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input name="email" placeholder="Enter Your Email" value={data.email} onChange={handleChange} />
          <PasswordInput name="password" placeholder="Enter Your Password" onChange={handleChange} value={data.password} />
          <PasswordInput name="confirmPassword" placeholder="Confirm Your Password" onChange={handleChange} value={data.confirmPassword} />

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}

          <Button text="Create Account" type="submit" loading={loading} />
        </form>

        <p className="text-center text-gray-600 mt-8 mb-2">
          Already have an account?
          <Link className="mr-2 px-2 text-blue-500 cursor-pointer" href="/pages/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
