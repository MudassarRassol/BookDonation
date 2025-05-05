"use client";
import React, { useState } from "react";

interface PasswordInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ name, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={true}
        className="p-2 border border-gray-300 rounded-md w-full pr-10 mt-2"
      />
      {
        value.length > 0 &&       <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-4 text-gray-600 cursor-pointer"
      >
        {showPassword ? '🐵'   : '🙈'}
        </button>
      }

    </div>
  );
};

export default PasswordInput;
