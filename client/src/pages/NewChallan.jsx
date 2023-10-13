import { BsTruck } from "react-icons/bs";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, InputRow, InputSelect, Loading } from "../components";
import { paymentType, prefix, service, timeFrame } from "../utils/constData";
import { useCreateChallanMutation } from "../redux/challanSlice";
import { toast } from "react-toastify";
import { useGetAdminValuesQuery } from "../redux/adminSlice";

const NewChallan = () => {
  const [create, { isLoading }] = useCreateChallanMutation();
  const { data, isLoading: valuesLoading } = useGetAdminValuesQuery();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      shipToDetails: {
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
      },
      serviceDate: "",
      serviceTime: "",
      area: "",
      workLocation: "",
      business: "",
      sales: "",
      amount: "",
      paymentType: "",
      serviceDetails: [
        {
          serviceName: "",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "serviceDetails",
    control,
  });

  const cancel = () => {
    reset();
  };

  const submit = async (data) => {
    try {
      const res = await create(data).unwrap();
      toast.success(res.msg);
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <>
      {isLoading || (valuesLoading && <Loading />)}
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
                    name="shipToDetails.prefix"
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
                    {errors.shipToDetails?.prefix?.message}
                  </p>
                </div>
                <div className="w-full ml-2">
                  <InputRow
                    label="Client Name"
                    id="shipToDetails.name"
                    errors={errors}
                    register={register}
                  />
                  <p className="text-xs text-red-500 -bottom-4 pl-1">
                    {errors.shipToDetails?.name && "Client name is required"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <InputRow
                label="Premise Name & Flat/Office no"
                id="shipToDetails.address"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.address &&
                  "Flat/office no & premise name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Road/Lane Name"
                id="shipToDetails.road"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.road && "Road/Lane name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Location"
                id="shipToDetails.location"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.location && "location name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Landmark/Near By Place"
                id="shipToDetails.landmark"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.landmark && "Landmark name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="City"
                id="shipToDetails.city"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.city && "City name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Pincode"
                id="shipToDetails.pincode"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.pincode && "Pincode is required"}
              </p>
            </div>
          </div>
          <div className="md:grid md:grid-cols-3 gap-x-4">
            <div>
              <InputRow
                label="Contact Person Name"
                id="shipToDetails.contactName"
                errors={errors}
                register={register}
              />
              <p className="text-xs text-red-500 -bottom-4 pl-1">
                {errors.shipToDetails?.contactName &&
                  "Contact person name is required"}
              </p>
            </div>
            <div>
              <InputRow
                label="Contact Person Number"
                id="shipToDetails.contactNo"
                errors={errors}
                register={register}
                required={false}
              />
            </div>
            <div>
              <InputRow
                label="Contact Person Email"
                id="shipToDetails.contactEmail"
                errors={errors}
                register={register}
                type="email"
                required={false}
              />
            </div>
          </div>
          <hr className="h-px mt-4 mb-2 border-0 dark:bg-gray-700" />
          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-4">
            <div className="md:col-span-3">
              <h2 className="text-center text-xl text-blue-500 font-medium">
                Service Details
              </h2>
              <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-4">
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
                    render={({ field: { onChange, value } }) => (
                      <InputSelect
                        options={data?.business}
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
                  <Controller
                    name="sales"
                    control={control}
                    rules={{ required: "Select sales person" }}
                    render={({ field: { onChange, value } }) => (
                      <InputSelect
                        options={data?.sales}
                        onChange={onChange}
                        value={value}
                        label="Job Finalized By"
                      />
                    )}
                  />
                  <p className="text-xs text-red-500 -bottom-4 pl-1">
                    {errors.sales?.message}
                  </p>
                </div>
              </div>
              {fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="md:grid md:grid-cols-3 gap-x-4"
                  >
                    <div>
                      <Controller
                        name={`serviceDetails.${index}.serviceName`}
                        control={control}
                        rules={{ required: "Select type of service" }}
                        render={({ field: { onChange, value, ref } }) => (
                          <InputSelect
                            options={service}
                            onChange={onChange}
                            value={value}
                            label="Type Of Service"
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
                        id={`serviceDetails.${index}.notes`}
                        errors={errors}
                        register={register}
                        required={false}
                      />
                    </div>

                    <div className="flex items-end justify-center gap-x-2">
                      <Button
                        label="Add"
                        onClick={() => append({ serviceName: "", notes: "" })}
                      />
                      {index > 0 && (
                        <Button
                          color="bg-red-600"
                          label="Remove"
                          onClick={() => remove(index)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-span-4 lg:col-span-1 border-l-2">
              <h2 className="text-center text-xl text-blue-500 font-medium">
                Payment Details
              </h2>
              <div className="flex justify-center">
                <InputRow
                  label="Total Amount"
                  id="amount"
                  errors={errors}
                  register={register}
                  required={false}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-52">
                  <Controller
                    name="paymentType"
                    control={control}
                    rules={{ required: "Select payment instruction" }}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputSelect
                        options={paymentType}
                        onChange={onChange}
                        value={value}
                        label="Payment Mode"
                      />
                    )}
                  />
                  <p className="text-xs text-red-500 -bottom-4 pl-1">
                    {errors.paymentType?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-end gap-x-2 mt-6">
            <Button
              type="submit"
              label={isLoading ? "Creating..." : "Create Challan"}
              height="h-10"
              color="bg-green-600"
              disabled={isLoading}
            />
            <Button
              label="Cancel"
              height="h-10"
              color="bg-gray-500"
              onClick={cancel}
            />
          </div>
        </form>
      </div>
    </>
  );
};
export default NewChallan;
