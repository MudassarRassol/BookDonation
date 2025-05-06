// import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "@/app/redux/counterSlice";

// export const store = configureStore({
//   reducer: {
//     user: counterReducer, // Add slices here
//   },
// });

// // Define RootState and AppDispatch types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// app/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/app/redux/counterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: counterReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];