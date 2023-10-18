import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import helperSlice from "./helperSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    helper: helperSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
