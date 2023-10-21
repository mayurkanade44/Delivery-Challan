import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  useOperatorCommentsQuery,
  useSingleChallanQuery,
  useUpdateChallanMutation,
} from "../redux/challanSlice";
import {
  AlertMessage,
  Button,
  InputRow,
  InputSelect,
  Loading,
} from "../components";
import { cashStatus, jobStatus } from "../utils/constData";
import { toast } from "react-toastify";

const UpdateChallan = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(false);

  const { data: comments, isLoading: commentLoading } =
    useOperatorCommentsQuery();
  const { data, isLoading, error } = useSingleChallanQuery(id);
  const [update, { isLoading: updateLoading }] = useUpdateChallanMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = useForm({
    defaultValues: {
      status: "",
      comment: "",
      jobDate: "",
      cashStatus: "",
      amount: "",
    },
  });

  const watchStatus = watch("status");
  const watchCashStatus = watch("cashStatus");

  const submit = async (data) => {
    if (images.length < 1) return toast.error("Please upload images");
    const form = new FormData();

    form.set("status", data.status.label);
    if (data.status.label === "Postponed")
      form.set("postponedDate", data.jobDate);
    else form.set("jobDate", data.jobDate);
    form.set("comment", data.comment.label);
    form.set("date", new Date(data.jobDate));
    images.forEach((file) => {
      form.append("images", file);
    });
    if (data.cashStatus) form.set("cashStatus", data.cashStatus.label);
    if (data.amount) form.set("amount", data.amount);

    try {
      const res = await update({ id, data: form }).unwrap();
      toast.success(res.msg);
      setMessage(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  if (message) {
    return (
      <div className="text-center mt-20 text-2xl font-medium text-green-600">
        Thank You. Challan Updated!!
      </div>
    );
  }

  return (
    <div className="mx-10 mt-16 lg:mt-5 ">
      {(isLoading || updateLoading || commentLoading) ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      {data && (
        <>
          <h1 className="text-2xl font-semibold text-center">
            Challan Number: {data?.number}
          </h1>
          <form onSubmit={handleSubmit(submit)} className="flex justify-center">
            <div className="w-full md:w-2/4 lg:w-1/4 mt-5">
              <div>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Select prefix" }}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputSelect
                      options={jobStatus}
                      onChange={onChange}
                      value={value}
                      label="Job Status"
                    />
                  )}
                />
                <p className="text-xs text-red-500 -bottom-4 pl-1">
                  {errors.status?.message}
                </p>
              </div>
              <div>
                <InputRow
                  label={
                    watchStatus.label === "Postponed"
                      ? "Postponed Date"
                      : "Job Date"
                  }
                  id="jobDate"
                  errors={errors}
                  register={register}
                  type="date"
                />
                <p className="text-xs text-red-500 -bottom-4 pl-1">
                  {errors.jobDate && "Job date is required"}
                </p>
              </div>
              <div>
                <Controller
                  name="comment"
                  control={control}
                  rules={{ required: "Select prefix" }}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputSelect
                      options={comments}
                      onChange={onChange}
                      value={value}
                      label="Job Comment"
                    />
                  )}
                />
                <p className="text-xs text-red-500 -bottom-4 pl-1">
                  {errors.comment?.message}
                </p>
              </div>
              {(data?.paymentType.label === "Cash To Collect" ||
                data?.paymentType.label === "UPI Payment") &&
                watchStatus.label !== "Cancelled" && (
                  <>
                    <div>
                      <Controller
                        name="cashStatus"
                        control={control}
                        rules={{ required: "Select cash status" }}
                        render={({ field: { onChange, value, ref } }) => (
                          <InputSelect
                            options={cashStatus}
                            onChange={onChange}
                            value={value}
                            label="Cash Collected/UPI Payment"
                          />
                        )}
                      />
                      <p className="text-xs text-red-500 -bottom-4 pl-1">
                        {errors.cashStatus?.message}
                      </p>
                    </div>
                    {watchCashStatus.label === "Yes" && (
                      <div>
                        <p className="text-center mt-2 text-red-500">
                          To collect {data.amount - data.collectedAmount}
                        </p>
                        <InputRow
                          label="Collected/UPI Amount"
                          id="amount"
                          errors={errors}
                          register={register}
                          type="number"
                        />
                        <p className="text-xs text-red-500 -bottom-4 pl-1">
                          {errors.amount && "Amount is required"}
                        </p>
                      </div>
                    )}
                  </>
                )}
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
              <div className="flex justify-center mt-5">
                <Button
                  type="submit"
                  label="Save"
                  color="bg-green-600"
                  height="h-10"
                />
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default UpdateChallan;
