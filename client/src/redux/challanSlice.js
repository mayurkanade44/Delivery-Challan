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
      keepUnusedDataFor: 1,
    }),
    allChallan: builder.query({
      query: ({ search, page }) => ({
        url: "/api/challan",
        params: { search, page },
      }),
      providesTags: ["Challan"],
      keepUnusedDataFor: 1,
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
      keepUnusedDataFor: 1,
    }),
    unverifiedChallan: builder.query({
      query: ({ search }) => ({
        url: "/api/challan/unverified",
        params: { search },
      }),
      providesTags: ["Challan"],
      keepUnusedDataFor: 1,
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
    cancelChallan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/challan/cancel/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Challan"],
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
  useCancelChallanMutation,
} = challanSlice;
