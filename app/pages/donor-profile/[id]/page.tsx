"use client"; // Add this directive at the top

import Image from "next/image";
import axios from "axios";
import BookCard from "@/components/Card/BookCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"; // Add useState and useEffect
import BookLoader from "@/components/Loader/Loader";

interface UserDetails {
  profilephoto: string;
  username: string;
  email: string;
  city: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  bookimg: string;
  condition: string;
  status: string;
  description: string;
  Category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const DonorProfilePage = () => {
  const { id } = useParams() as { id?: string };
  const [userData, setUserData] = useState<{
    success: boolean;
    message?: string;
    userDetails?: UserDetails;
    donorbooks?: Book[];
  }>({ success: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/donorprofile/${id}`);
        console.log("Response data:", response.data); // Log the response data
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching donor data:', error);
        setUserData({
          success: false,
          message: "Error loading donor profile. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-8 text-center">
        <p className="text-red-500 text-lg">Invalid donor ID.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-8 text-center">
         <BookLoader/> 
      </div>
    );
  }

  if (!userData.success) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">
        <p className="text-red-500 text-lg">{userData.message}</p>
      </div>
    );
  }

  const { userDetails, donorbooks } = userData;

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8 md:mt-20">
      {/* User Profile Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    {/* Left Section - Avatar + User Info */}
    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
      <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
        <Image
          src={userDetails?.profilephoto || "/default-avatar.png"}
          alt={userDetails?.username || "User"}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-800">{userDetails?.username}</h1>
        <p className="text-gray-600 break-all">{userDetails?.email}</p>
        <p className="text-gray-500 mt-1">
          <span className="mr-4">📍 {userDetails?.city}</span>
        </p>
      </div>
    </div>

    {/* Right Section - Chat Button */}
    <div className="w-full md:w-auto flex justify-center md:block">
      <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto">
        Chat With Donor
      </button>
    </div>
  </div>
</div>

      {/* Donated Books Section */}
      <div className=" mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Donated Books By {userDetails?.username} </h2>
        {donorbooks?.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No books donated yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {donorbooks?.map((book: Book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorProfilePage;