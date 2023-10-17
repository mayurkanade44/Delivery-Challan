import { useForm, Controller } from "react-hook-form";
import { adminNavbar, userRoles } from "../utils/constData";
import {
  useAddAdminValueMutation,
  useAddUserMutation,
  useDeleteAdminValueMutation,
  useGetAdminValuesQuery,
} from "../redux/adminSlice";
import { useState } from "react";
import { AdminTable, Button, InputRow, InputSelect } from "../components";
import { toast } from "react-toastify";

const Admin = () => {
  const [showTable, setShowTable] = useState("All Users");
  const { data, isLoading: valuesLoading } = useGetAdminValuesQuery();
  const [addValue, { isLoading }] = useAddAdminValueMutation();
  const [deleteValue, { isLoading: deleteLoading }] =
    useDeleteAdminValueMutation();
  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      serviceName: "",
      description: "",
      sales: "",
      business: "",
    },
  });

  const handleTable = (item) => {
    setShowTable(item);
    reset();
  };

  const handleDelete = async (id) => {
    try {
      let res;
      if (showTable === "All Users") {
        // res = await deleteUser({id}).unwrap();
      } else {
        res = await deleteValue({ id }).unwrap();
      }
      toast.success(res.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  const submit = async (data) => {
    let res;
    try {
      if (showTable === "All Users") {
        data.role = data.role.label;
        res = await addUser(data).unwrap();
      } else if (showTable === "All Sales Person") {
        res = await addValue({
          sales: { label: data.sales, value: data.sales },
        }).unwrap();
      } else if (showTable === "All Business") {
        res = await addValue({
          business: { label: data.business, value: data.business },
        }).unwrap();
      } else if (showTable === "All Services") {
        res = await addValue({
          services: { label: data.serviceName, value: data.description },
        }).unwrap();
      }
      toast.success(res.msg);
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center py-2 bg-gray-100 border">
        {adminNavbar.map((item, index) => (
          <button
            className="mx-4 font-medium hover:text-blue-500"
            key={index}
            onClick={() => handleTable(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex justify-center py-2 gap-5">
        {showTable === "All Users" ? (
          <form
            className="flex items-center gap-4 mb-4"
            onSubmit={handleSubmit(submit)}
          >
            <div>
              <InputRow
                label="User Name"
                placeholder="Enter full name"
                id="name"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.name && "Name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Email"
                placeholder="abc@pms.in"
                id="email"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.email && "Email id is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Password"
                message="Password is required"
                placeholder="Minium 5 letters"
                id="password"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.password && "Password is required"}
              </p>
            </div>
            <div className="w-52">
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field: { onChange, value, ref } }) => (
                  <InputSelect
                    options={userRoles}
                    onChange={onChange}
                    value={value}
                    label="Role"
                  />
                )}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.role?.message}
              </p>
            </div>
            <Button
              label="Add User"
              color="bg-green-600"
              width="w-28"
              height="h-9"
              type="submit"
            />
          </form>
        ) : showTable === "All Sales Person" ? (
          <div>
            <form
              className="flex items-center gap-8 mb-4"
              onSubmit={handleSubmit(submit)}
            >
              <InputRow
                label="Sales Person Name"
                message="Service name is required"
                id="sales"
                errors={errors}
                register={register}
              />
              <Button
                label="Add Person"
                color="bg-green-600"
                width="w-28"
                height="h-9"
                type="submit"
              />
            </form>
            <AdminTable
              title={["Sales"]}
              data={data?.sales}
              handleDelete={handleDelete}
            />
          </div>
        ) : showTable === "All Business" ? (
          <div>
            <form
              className="flex items-center gap-8 mb-4"
              onSubmit={handleSubmit(submit)}
            >
              <InputRow
                label="Business Name"
                message="business name is required"
                id="business"
                errors={errors}
                register={register}
              />
              <Button
                label="Add Business"
                color="bg-green-600"
                width="w-28"
                height="h-9"
                type="submit"
              />
            </form>
            <AdminTable
              title={["Business Name"]}
              data={data?.business}
              handleDelete={handleDelete}
            />
          </div>
        ) : showTable === "All Services" ? (
          <>
            <div>
              <form
                className="flex items-center gap-8 mb-4"
                onSubmit={handleSubmit(submit)}
              >
                <InputRow
                  label="Service Name"
                  message="Service name is required"
                  id="serviceName"
                  errors={errors}
                  register={register}
                />
                <InputRow
                  label="Service Description"
                  message="Description is required"
                  id="description"
                  errors={errors}
                  register={register}
                />
                <Button
                  label="Add Service"
                  color="bg-green-600"
                  width="w-28"
                  height="h-9"
                  type="submit"
                />
              </form>
              <AdminTable
                title={["Name", "Description"]}
                data={data?.services}
                handleDelete={handleDelete}
                double={true}
              />
            </div>
          </>
        ) : (
          <>None</>
        )}
      </div>
    </div>
  );
};
export default Admin;
