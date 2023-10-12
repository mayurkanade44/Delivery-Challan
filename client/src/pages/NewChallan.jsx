import { BsTruck } from "react-icons/bs";
import { useForm, Controller } from "react-hook-form";
import { Button, InputRow, InputSelect } from "../components";
import {
  business,
  paymentMode,
  prefix,
  service,
  timeFrame,
} from "../utils/constData";
import { useCreateChallanMutation } from "../redux/challanSlice";
import { toast } from "react-toastify";

const NewChallan = () => {
  const [create, { isLoading: createLoading }] = useCreateChallanMutation();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      prefix: "",
      name: "",
      address: "",
      road: "",
      location: "",
      landmark: "",
      city: "",
      pincode: "",
      contactName: "",
      contactNo: "",
      contactEmail: "",
      serviceDate: new Date().toISOString().slice(0, 10),
      serviceTime: "",
      area: "",
      workLocation: "",
      business: "",
      sales: "",
      amount: "",
      paymentMode: "",
      service: [],
      notes: "",
    },
  });

  const submit = async (data) => {
    try {
      const res = await create(data).unwrap();
      toast.success(res.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <div className="mx-10 my-5">
      <div className="flex justify-center items-center gap-x-4">
        <BsTruck className="w-9 h-9 text-green-600" />
        <h1 className="text-3xl font-medium">New Delivery Challan</h1>
      </div>
      <form onSubmit={handleSubmit(submit)} className="mt-6">
        <h2 className="text-center my-2 text-xl text-blue-500 font-medium">
          Ship To Details
        </h2>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-4">
          <div className="col-span-2">
            <div className="flex">
              <div className="w-56">
                <Controller
                  name="prefix"
                  control={control}
                  rules={{ required: "Select prefix" }}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputSelect
                      options={prefix}
                      onChange={onChange}
                      value={value}
                      label="Prefix"
                    />
                  )}
                />
                <p className="text-xs text-red-500 -bottom-4 pl-1">
                  {errors.prefix?.message}
                </p>
              </div>
              <div className="w-full ml-2">
                <InputRow
                  label="Client Name"
                  id="name"
                  errors={errors}
                  register={register}
                />
                <p className="text-xs text-red-500 -bottom-4 pl-1">
                  {errors.name && "Client name is required"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <InputRow
              label="Premise Name & Flat/Office no"
              id="address"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.address && "Flat/office no & premise name is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="Road/Lane Name"
              id="road"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.road && "Road/Lane name is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="Location"
              id="location"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.location && "location name is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="Landmark/Near By Place"
              id="landmark"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.landmark && "Landmark name is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="City"
              id="city"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.city && "City name is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="Pincode"
              id="pincode"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.pincode && "Pincode is required"}
            </p>
          </div>
        </div>
        <div className="md:grid md:grid-cols-3 gap-x-4">
          <div>
            <InputRow
              label="Contact Person Name"
              id="contactName"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.contactName && "Contact person name is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="Contact Person Number"
              id="contactNo"
              errors={errors}
              register={register}
              required={false}
            />
          </div>
          <div>
            <InputRow
              label="Contact Person Email"
              id="contactEmail"
              errors={errors}
              register={register}
              type="email"
              required={false}
            />
          </div>
        </div>
        <hr className="h-px mt-4 mb-2 border-0 dark:bg-gray-700" />
        <h2 className="text-center text-xl text-blue-500 font-medium">
          Service Details
        </h2>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-4">
          <div>
            <InputRow
              label="Date Of Service"
              id="serviceDate"
              errors={errors}
              register={register}
              type="date"
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.serviceDate && "Service date is required"}
            </p>
          </div>
          <div>
            <Controller
              name="serviceTime"
              control={control}
              rules={{ required: "Select job timing" }}
              render={({ field: { onChange, value, ref } }) => (
                <InputSelect
                  options={timeFrame}
                  onChange={onChange}
                  value={value}
                  label="Job Time Frame"
                />
              )}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.serviceTime?.message}
            </p>
          </div>
          <div>
            <InputRow
              label="Work Location"
              id="workLocation"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.workLocation && "Work location is required"}
            </p>
          </div>
          <div>
            <InputRow
              label="Approx Sqft"
              id="area"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.area && "Square feet area is required"}
            </p>
          </div>
          <div>
            <Controller
              name="business"
              control={control}
              rules={{ required: "Select type of business" }}
              render={({ field: { onChange, value, ref } }) => (
                <InputSelect
                  options={business}
                  onChange={onChange}
                  value={value}
                  label="Type Of Business"
                />
              )}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.business?.message}
            </p>
          </div>
          <div>
            <InputRow
              label="Job Finalised By"
              id="sales"
              errors={errors}
              register={register}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.sales && "Sales person name is required"}
            </p>
          </div>
          <div className="">
            <Controller
              name="service"
              control={control}
              rules={{ required: "Select type of service" }}
              render={({ field: { onChange, value, ref } }) => (
                <InputSelect
                  options={service}
                  onChange={onChange}
                  value={value}
                  label="Type Of Service"
                  isMulti={true}
                />
              )}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.service?.message}
            </p>
          </div>
          <div>
            <InputRow
              label="Notes/Job Instructions"
              id="notes"
              errors={errors}
              register={register}
              required={false}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <hr className="h-px mt-4 mb-2 border-0 dark:bg-gray-700" />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <h2 className="text-center text-xl text-blue-500 font-medium">
              Payment Details
            </h2>
          </div>
          <div>
            <InputRow
              label="Total Amount"
              id="amount"
              errors={errors}
              register={register}
              required={false}
            />
          </div>
          <div>
            <Controller
              name="paymentMode"
              control={control}
              rules={{ required: "Select payment instruction" }}
              render={({ field: { onChange, value, ref } }) => (
                <InputSelect
                  options={paymentMode}
                  onChange={onChange}
                  value={value}
                  label="Payment Mode"
                />
              )}
            />
            <p className="text-xs text-red-500 -bottom-4 pl-1">
              {errors.paymentMode?.message}
            </p>
          </div>
          <div className="md:md:col-span-2 flex justify-center items-end">
            <Button
              type="submit"
              label="Create Challan"
              height="h-10"
              color="bg-green-600"
            />
            <Button label="Cancel" height="h-10" color="bg-gray-500" />
          </div>
        </div>
      </form>
    </div>
  );
};
export default NewChallan;
