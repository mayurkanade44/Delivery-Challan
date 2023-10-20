import { apiSlice } from "./apiSlice";

export const adminSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addAdminValue: builder.mutation({
      query: (data) => ({
        url: "/api/admin/value",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdminValues: builder.query({
      query: () => ({
        url: "/api/admin/value",
      }),
      providesTags: ["Admin"],
    }),
    deleteAdminValue: builder.mutation({
      query: ({ id }) => ({
        url: `/api/admin/value/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `/api/admin/user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/api/admin/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: "/api/admin/allUser",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useAddAdminValueMutation,
  useGetAdminValuesQuery,
  useAddUserMutation,
  useDeleteAdminValueMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
} = adminSlice;
