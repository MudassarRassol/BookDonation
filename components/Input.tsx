"use client";
import React from "react";

interface TextInputProps {
  type?: "text" | "email" | "password" | "number"; // Restrict allowed types
  name: string;
  placeholder: string;
  value: string;
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  length? : number
}

const TextInput: React.FC<TextInputProps> = ({ type = "text", name, placeholder, value, onChange,required,length }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="p-2 border border-gray-300 rounded-md w-full mb-2"
      minLength={length}
    />
  );
};

export default TextInput;
