"use client";
import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import axios from "axios";
import Input from "@/components/Input";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Link from "next/link";

const AddBookPage = () => {
  const {varify} = useSelector((state : RootState)=>state.user);
  //   const dispatch = useDispatch();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState({
    title: "",
    author: "",
    condition: "",
    description: "",
    Category: "",
  });

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("run");
    e.preventDefault();
    setLoading(true);

    if (
      !data.title ||
      !data.author ||
      !data.condition ||
      !data.description ||
      !data.Category ||
      !image
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (data.title.length < 4) {
      setError("Title must be at least 4 characters");
      setLoading(false);
      return;
    }

    if (data.author.length < 3) {
      setError("Author name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (data.description.length < 10) {
      setError("Description must be at least 10 characters");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("condition", data.condition);
    formData.append("description", data.description);
    formData.append("Category", data.Category);
    const city = localStorage.getItem("city") || ""; // Fallback to an empty string if null
    formData.append("city", city);
    if (image) {
      formData.append("bookimg", image);
    }
    try {
      const response = await axios.post("/api/book/addbook", formData);

      if (response.status === 201) {
        toast.success("Book added successfully");
        setData({
          title: "",
          author: "",
          condition: "",
          description: "",
          Category: "",
        });
        setImage(null);
        setImagePreview(null);
        setError(null);
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
      setLoading(false);
    }
  };

  return (
    <div className={` w-full h-auto  md:h-[100vh] flex items-center justify-center`}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className={`${varify === "non-verified" ? ' hidden ' : '' }  w-full md:w-[70%]    flex  flex-col md:flex-row border-b-2 p-4 shadow-2xl`}>
        {/* Book Image Upload */}
        <div className="m-auto relative mb-4 overflow-hidden w-full">
          <Avatar
            shape="square"
            style={{ width: "100%", height: "430px" }}
            src={
              imagePreview ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000"
            }
          />
          <label
            htmlFor="bookimg"
            className="bg-white absolute bottom-0 right-0 rounded-tl-2xl shadow-2xl hover:scale-125 transition-all duration-300 p-3 flex flex-col items-center cursor-pointer"
          >
            <EditOutlined className="text-xl" />
            Photo
          </label>
        </div>

        {/* Book Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full px-2"
        >
          <h1 className="text-3xl font-bold">Book Details</h1>
          <input
            onChange={handleFileChange}
            type="file"
            id="bookimg"
            name="bookimg"
            accept="image/*"
            hidden
            required
          />

          <Input
            name="title"
            type="text"
            placeholder="Book Title"
            value={data.title}
            onChange={handleChange}
            required
            length={4}
            // minLength={4}
          />

          <Input
            name="author"
            type="text"
            placeholder="Author Name"
            value={data.author}
            onChange={handleChange}
            required
            length={3}
            // minLength={3}
          />

          <label htmlFor="category-select" className="hidden text-sm font-medium text-gray-700">
            Book Category
          </label>
          <select
            id="category-select"
            name="Category"
            value={data.Category}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Book Category
            </option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Romance">Romance</option>
            <option value="Mystery">Mystery</option>
            <option value="Thriller">Thriller</option>
          </select>

          <label htmlFor="condition-select" className="hidden text-sm font-medium text-gray-700">
            Book Condition
          </label>
          <select
            id="condition-select"
            name="condition"
            value={data.condition}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Book Condition
            </option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>

          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Book Description"
            required
            minLength={10}
            className="p-2 border border-gray-300 rounded-md h-28"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {/* <br /> */}
          <Button
            text={"Add Book"}
            type={"submit"}
            loading={loading}
            disabled={loading}
          />
        </form>
      </div>
      <div className={` ${ varify === 'non-verified' ? '' : 'hidden' } `} >
        <Link href={'/pages/profile'} className=" text-blue-700 cursor-pointer " >
        Pls Varify Account For Add Book
        </Link>
      </div>
    </div>
  );
};

export default AddBookPage;
