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
      keepUnusedDataFor: 60,
    }),
    allChallan: builder.query({
      query: ({ search, page }) => ({
        url: "/api/challan",
        params: { search, page },
      }),
      providesTags: ["Challan"],
      keepUnusedDataFor: 60,
    }),
    verifyAmount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/challan/verify/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Challan"],
    }),
    chartData: builder.query({
      query: () => ({
        url: "/api/challan/chartData",
      }),
      providesTags: ["Challan"],
      keepUnusedDataFor: 60,
    }),
    unverifiedChallan: builder.query({
      query: () => ({
        url: "/api/challan/unverified",
      }),
      providesTags: ["Challan"],
      keepUnusedDataFor: 60,
    }),
    makeInvoice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/challan/makeInvoice/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Challan"],
    }),
    operatorComments: builder.query({
      query: () => ({
        url: "/api/challan/operatorComments",
      }),
      providesTags: ["Admin"],
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
  useUnverifiedChallanQuery,
  useMakeInvoiceMutation,
  useOperatorCommentsQuery,
} = challanSlice;
