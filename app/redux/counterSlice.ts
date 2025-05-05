"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  login: boolean;
  image: string;
  role: string | null;
  userid: string | null;
  city: string | null;
  varify: string;
  Info: boolean;
}

// Helper function to save to localStorage
const saveToLocalStorage = (state: UserState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("login", state.login.toString());
    localStorage.setItem("image", state.image);
    localStorage.setItem("role", state.role || "guest");
    localStorage.setItem("userid", state.userid || "");
    localStorage.setItem("city", state.city || "");
    localStorage.setItem("varify", state.varify);
    localStorage.setItem("Info", state.Info.toString());
  }
};

const initialState: UserState = {
  login: false,
  image: "",
  role: "guest" ,
  userid: null,
  city: null,
  varify: "non-varified",
  Info: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<boolean>) {
      state.login = action.payload;
      saveToLocalStorage(state);
    },
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
      saveToLocalStorage(state);
    },
    setRole(state, action: PayloadAction<string | null>) {
      state.role = action.payload;
      saveToLocalStorage(state);
    },
    setUserId(state, action: PayloadAction<string | null>) {
      state.userid = action.payload;
      saveToLocalStorage(state);
    },
    setCity(state, action: PayloadAction<string | null>) {
      state.city = action.payload;
      saveToLocalStorage(state);
    },
    setVarify(state, action: PayloadAction<string>) {
      state.varify = action.payload;
      saveToLocalStorage(state);
    },
    setInfo(state, action: PayloadAction<boolean>) {
      state.Info = action.payload;
      saveToLocalStorage(state);
    },
    loadFromLocalStorage(state) {
      if (typeof window !== "undefined") {
        state.login = localStorage.getItem("login") === "true";
        state.image = localStorage.getItem("image") || "";
        state.role = localStorage.getItem("role") || "guest";
        state.userid = localStorage.getItem("userid") || null;
        state.city = localStorage.getItem("city") || null;
        state.varify = localStorage.getItem("varify") || "non-varified";
        state.Info = localStorage.getItem("Info") === "true";
      }
    },
    clearLocalStorage() {
      if (typeof window !== "undefined") {
        localStorage.removeItem("login");
        localStorage.removeItem("image");
        localStorage.removeItem("role");
        localStorage.removeItem("userid");
        localStorage.removeItem("city");
        localStorage.removeItem("varify");
        localStorage.removeItem("Info");
      }
      return initialState;
    },
  },
});

export const { 
  setLogin, 
  setImage, 
  setRole, 
  setUserId, 
  setCity, 
  setVarify, 
  setInfo, 
  loadFromLocalStorage,
  clearLocalStorage 
} = userSlice.actions;

export default userSlice.reducer;