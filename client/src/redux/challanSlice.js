import { apiSlice } from "./apiSlice";

export const challanSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChallan: builder.mutation({
      query: (data) => ({
        url: "/api/challan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Challan"],
    }),
    updateChallan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/challan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Challan"],
    }),
    singleChallan: builder.query({
      query: (id) => ({
        url: `/api/challan/${id}`,
      }),
      providesTags: ["Challan"],
    }),
    allChallan: builder.query({
      query: ({ search }) => ({
        url: "/api/challan",
        params: { search },
      }),
      providesTags: ["Challan"],
    }),
    verifyAmount: builder.mutation({
      query: (id) => ({
        url: `/api/challan/verify/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Challan"],
    }),
    chartData: builder.query({
      query: () => ({
        url: "/api/challan/chartData",
      }),
      providesTags: ["Challan"],
    }),
  }),
});

export const {
  useCreateChallanMutation,
  useUpdateChallanMutation,
  useSingleChallanQuery,
  useAllChallanQuery,
  useVerifyAmountMutation,
  useChartDataQuery,
} = challanSlice;
