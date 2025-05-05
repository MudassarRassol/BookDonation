import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/app/redux/counterSlice";

export const store = configureStore({
  reducer: {
    user: counterReducer, // Add slices here
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
