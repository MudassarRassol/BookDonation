// src/hooks/useUserRole.ts
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export function useUserRole() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setIsAdmin(role === "admin");
    setIsLoading(false);
  }, [role]);

  return { isAdmin, isLoading };
}