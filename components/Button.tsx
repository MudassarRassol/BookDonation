"use client";
import React from "react";

interface ButtonProps {
  text: string;
  type: "button" | "submit";
  onClick?: () => void; // Optional event handler
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, type, onClick, disabled, loading }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading} // Prevent interaction while loading
      className={`bg-black text-white w-full py-2 rounded-md mb-2 mt-5 flex justify-center items-center
                 ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
