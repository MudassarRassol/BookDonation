"use client";

import Image from "next/image";
import axios from "axios";
import BookCard from "@/components/Card/BookCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
        const response = await axios.post(`/api/donorprofile`,{
          donorId : id
        });
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-8 text-center md:mt-20">
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Donor Profile</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Donor Information */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                    <Image
                      src={userDetails?.profilephoto || "/default-avatar.png"}
                      alt={userDetails?.username || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800">{userDetails?.username}</h2>
                  <p className="text-gray-500">{userDetails?.city}</p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 break-all">{userDetails?.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">{userDetails?.city || "Location not specified"}</span>
                  </div>
                </div>
                {/* add go back button */}
                <button 
                onClick={() => window.history.back()}
                className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center cursor-pointer">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
                
                {/* <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat With Donor
                </button> */}
              </div>
              
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-medium text-gray-500">STATISTICS</h3>
                <div className="mt-2 flex justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{donorbooks?.length || 0}</p>
                    <p className="text-xs text-gray-500">Donor Books  </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {donorbooks?.filter(book => book.status === 'available').length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Available Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Donated Books */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Donated Books by {userDetails?.username}
                </h2>
                <p className="text-gray-500 mt-1">
                  {donorbooks?.length || 0} books in total
                </p>
              </div>
              
              {donorbooks?.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No books donated yet</h3>
                  <p className="mt-1 text-gray-500">This donor {`hasn't`} shared any books yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  {donorbooks?.map((book: Book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;