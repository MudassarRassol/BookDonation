"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/Passwordinput";
import Input from "@/components/Input";
import { useDispatch } from "react-redux";
import { 
  setLogin, 
  setUserId, 
  setVarify,
  setInfo, 
  setImage, 
  setRole, 
  setCity,
  loadFromLocalStorage 
} from "@/app/redux/counterSlice";
import BookLoader from "@/components/Loader/Loader";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [routeLoading, setRouteLoading] = useState<boolean>(false);

  // Load from localStorage when component mounts
  useEffect(() => {
    dispatch(loadFromLocalStorage());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setRouteLoading(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const response = await axios.post("/api/auth/sign-in", formData);
      
      if (response.status === 200) {
        // Dispatch all actions first
        dispatch(setLogin(true));
        dispatch(setUserId(response.data.user.userId));
        dispatch(setVarify(response.data.user.varify));
        dispatch(setInfo(response.data.user.info));
        
        if (response.data.user.info === false) {
           router.push("/pages/userdetails/get-user-details");
        } else {
          dispatch(setImage(response.data.res.profilephoto));
          dispatch(setRole(response.data.res.role));
          dispatch(setCity(response.data.res.city));
          
          const role = response.data.res.role;
          if (role === "admin") {
             router.push("/pages/admin");
          } else {
             router.push("/");
          }
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status) {
        if (err.response.status === 401 || err.response.status === 404) {
          setError(err.response.data.message);
        } else {
          setError("Please try again");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
      setRouteLoading(false);
    }
  };

  return (
    <>
      {routeLoading && 
      <div className="w-full h-[100vh] flex items-center justify-center" >
            <BookLoader />
      </div>
      }
      {
        !routeLoading   && 
        <div className="w-full h-[80vh] md:h-[89vh] overflow-hidden flex justify-center items-center">
        <div className="flex flex-col w-[450px] border-b-2 p-4 shadow-2xl justify-center md:mt-40">
          <h1 className="text-xl text-center text-gray-800 font-bold mb-8 mt-3 w-full">
            Sign-in to Book Donation
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <Input name="email" placeholder="Enter Your Email" value={data.email} onChange={handleChange} />
            <PasswordInput name="password" placeholder="Enter Your Password" onChange={handleChange} value={data.password} />
            <Link className="mt-2 text-sm" href="/pages/forget-password">
              Forgot Password?
            </Link>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <Button type="submit" text="Login" loading={loading} disabled={loading || routeLoading} />
          </form>
          <p className="text-center text-gray-600 mt-8 mb-2 w-full">
            {`Don't`} have an account?
            <Link className="mr-2 px-2 text-blue-500 cursor-pointer" href="/pages/sign-up">
              Sign up
            </Link>
          </p>
        </div>
      </div>  
      }
    </>
  );
};

export default Page;