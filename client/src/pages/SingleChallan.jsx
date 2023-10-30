import { useParams } from "react-router-dom";
import {
  useMakeInvoiceMutation,
  useSingleChallanQuery,
  useVerifyAmountMutation,
} from "../redux/challanSlice";
import {
  AlertMessage,
  Button,
  CancelModal,
  Loading,
  MakeInvoiceModal,
} from "../components";
import { dateFormat, dateTimeFormat } from "../utils/functionHelper";
import { toast } from "react-toastify";
import { useState } from "react";
import { saveAs } from "file-saver";
import VerifyModal from "../components/VerifyModal";
import { useSelector } from "react-redux";

const SingleChallan = () => {
  const { id } = useParams();
  const { user } = useSelector((store) => store.helper);

  const [makeInvoice, { isLoading: invoiceLoading }] = useMakeInvoiceMutation();
  const { data, isLoading: challanLoading, error } = useSingleChallanQuery(id);

  const progress = (status) => {
    let text = "text-blue-600";
    if (status === "Completed") text = "text-green-600";
    else if (status === "Partially Completed") text = "text-pink-600";
    else if (status === "Cancelled") text = "text-red-600";

    return <p className={`${text} font-semibold`}>{status}</p>;
  };

  const handleDownload = (images) => {
    images.map((image, index) => saveAs(image, `image-${index + 1}`));
  };

  const handleInvoice = async () => {
    try {
      const res = await makeInvoice(id).unwrap();
      toast.success(res.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <div className="mx-10 my-20 lg:my-5">
      {challanLoading || invoiceLoading ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      {data && (
        <div>
          <div className="grid grid-cols-8 gap-3">
            <div className="col-span-2">
              <h1 className="text-lg font-medium text-center">
                Slip Number: {data.number}
              </h1>
            </div>
            <div className="col-span-4">
              <h1 className="text-lg font-medium text-center">
                Client Name - {data.shipToDetails.prefix.label}.{" "}
                {data.shipToDetails.name}
              </h1>
            </div>
            <div className="col-span-2">
              <h1 className="text-lg font-medium text-center">
                Payment Type - {data.paymentType.label}
              </h1>
            </div>
            <div className="col-span-8">
              <hr className="h-px border-0 dark:bg-gray-700" />
            </div>
            <div className="col-span-8 text-lg font-medium">
              Address -{data.shipToDetails.address}, {data.shipToDetails.road},{" "}
              {data.shipToDetails.location}, {data.shipToDetails.landmark},{" "}
              {data.shipToDetails.city} - {data.shipToDetails.pincode}
            </div>
            <div className="col-span-8">
              <hr className="h-px border-0 dark:bg-gray-700" />
            </div>
            <div className="col-span-4">
              <h1 className="text-lg font-medium">
                Service Date - {dateFormat(data.serviceDate)} | Time -{" "}
                {data.serviceTime.label}
              </h1>
              <h1 className="text-lg font-medium">
                Work Location - {data.workLocation}
              </h1>
              <h1 className="text-lg font-medium">Approx Sqft - {data.area}</h1>
              <h1 className="text-lg font-medium">
                Job Finalised By - {data.sales.label}
              </h1>
            </div>
            <div className="col-span-4">
              <div className="overflow-y-auto my-2">
                <table className="w-full border whitespace-nowrap  dark:border-neutral-500">
                  <thead>
                    <tr className="h-10 w-full text-md leading-none text-gray-600">
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-3">
                        Service Name
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-28 px-3">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {data.serviceDetails?.map((service, index) => (
                      <tr
                        key={index}
                        className="h-10 text-sm leading-none text-gray-700 border-b dark:border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          {service.serviceName.label}
                        </td>
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          {service.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-span-8">
              <hr className="h-px border-0 dark:bg-gray-700" />
            </div>
            <div className="col-span-8 mb-2">
              <div className="overflow-y-auto my-1">
                <table className="w-full border whitespace-nowrap  dark:border-neutral-500">
                  <thead>
                    <tr className="h-8 w-full text-md leading-none text-gray-600">
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Status
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Job Type
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Job Done / Postponed Date
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Amount Received
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Images
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Updated By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {data.update.map((challan, index) => (
                      <tr
                        key={index}
                        className="h-8 text-sm leading-none text-gray-700 border-b dark:border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                          {progress(challan.status)}
                        </td>
                        <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                          {challan.type || "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                          {((challan.jobDate || challan.postponedDate) &&
                            dateFormat(
                              challan.jobDate || challan.postponedDate
                            )) ||
                            "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                          {challan.amount || "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                          {challan.images && (
                            <Button
                              label="Download"
                              small
                              onClick={() => handleDownload(challan.images)}
                            />
                          )}
                        </td>
                        <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                          {challan.user} | {dateFormat(challan.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {data.paymentType.label !== "NTB" && (
              <>
                <div className="col-span-8">
                  <div className="flex items-center flex-col lg:flex-row lg:gap-x-5">
                    <p className="text-lg font-medium text-red-600">
                      Total Amount - {data.amount.total} Rs
                    </p>
                    <p className="text-lg font-medium text-red-600">
                      Total Received Amount - {data.amount.received} Rs
                    </p>
                  </div>
                </div>
                {user.role !== "Sales" && (
                  <div className="col-span-8">
                    <div className="flex items-center flex-col lg:flex-row lg:gap-x-5">
                      {data.update.length > 1 && (
                        <>
                          <VerifyModal
                            id={id}
                            amount={data.amount.total}
                            received={data.amount.received}
                            type={data.paymentType.label}
                            status={data.verify.status}
                          />
                          <MakeInvoiceModal
                            id={id}
                            type={data.paymentType.label}
                            status={data.verify.status}
                            invoiceStatus={data.verify.invoice}
                          />
                          {user.role === "Admin" && (
                            <CancelModal
                              id={id}
                              status={data.verify.status}
                              jobStatus={
                                data.update[data.update.length - 1].status ===
                                "Not Completed"
                              }
                            />
                          )}
                        </>
                      )}
                      {data.verify.status && (
                        <p className="text-green-600 font-medium text-lg">
                          Verification Done By {data.verify.user} on{" "}
                          {dateFormat(data.verify.date)} || {data.billCompany}{" "}
                          {data.verify.note}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SingleChallan;
