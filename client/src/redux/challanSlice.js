import { apiSlice } from "./apiSlice";

export const challanSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChallan: builder.mutation({
      query: (data) => ({
        url: "/api/challan/create",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateChallanMutation } = challanSlice;
