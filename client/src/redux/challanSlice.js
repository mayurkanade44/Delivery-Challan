import { apiSlice } from "./apiSlice";

export const challanSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChallan: builder.mutation({
      query: (data) => ({
        url: "/api/challan",
        method: "POST",
        body: data,
      }),
    }),
    updateChallan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/challan/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    singleChallan: builder.query({
      query: (id) => ({
        url: `/api/challan/${id}`,
      }),
    }),
    allChallan: builder.query({
      query: ({ search }) => ({
        url: "/api/challan",
        params: { search },
      }),
      providesTags: ["Challan"],
      keepUnusedDataFor: 10,
    }),
  }),
});

export const {
  useCreateChallanMutation,
  useUpdateChallanMutation,
  useSingleChallanQuery,
  useAllChallanQuery,
} = challanSlice;
