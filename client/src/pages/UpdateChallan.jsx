import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useSingleChallanQuery } from "../redux/challanSlice";
import { InputSelect } from "../components";
import { jobStatus } from "../utils/constData";

const UpdateChallan = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);

  const { data } = useSingleChallanQuery(id);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      status: "",
      comment: "",
      serviceDate: "",
    },
  });

  const submit = async () => {};

  return (
    <div className="mx-10 mt-16 lg:mt-5 ">
      <h1 className="text-2xl font-semibold text-center">
        Challan Number: {data?.number}
      </h1>
      <form onSubmit={handleSubmit(submit)} className="">
        <div className="grid">
          <div className="w-60">
            <Controller
              name="status"
              control={control}
              rules={{ required: "Select prefix" }}
              render={({ field: { onChange, value, ref } }) => (
                <InputSelect
                  options={jobStatus}
                  onChange={onChange}
                  value={value}
                  label="Service Status"
                />
              )}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.shipToDetails?.prefix?.message}
            </p>
          </div>
          <div className="my-3">
            <label
              htmlFor="images"
              className="text-md font-medium leading-6 mr-2 text-gray-900"
            >
              Job Images*{" "}
            </label>
            <input
              type="file"
              onChange={(e) => setImages(Array.from(e.target.files))}
              multiple
              className="mt-0.5"
              accept="image/*"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default UpdateChallan;
