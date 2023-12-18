import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  AlertMessage,
  Button,
  CancelModal,
  Loading,
  MakeInvoiceModal,
} from "../components";
import VerifyModal from "../components/VerifyModal";
import { useSingleChallanQuery } from "../redux/challanSlice";
import { dateFormat } from "../utils/functionHelper";

const SingleChallan = () => {
  const { id } = useParams();
  const { user } = useSelector((store) => store.helper);

  const { data, isLoading: challanLoading, error } = useSingleChallanQuery(id);

  const progress = (status) => {
    let text = "text-blue-600";
    if (status === "Completed") text = "text-green-600";
    else if (status === "Partially Completed") text = "text-pink-600";
    else if (status === "Cancelled" || status === "Not Completed")
      text = "text-red-600";

    return <p className={`${text} font-semibold`}>{status}</p>;
  };

  const handleDownload = (images) => {
    images.map((image, index) => saveAs(image, `image-${index + 1}`));
  };

  return (
    <div className="mx-10 my-20 lg:my-5">
      {challanLoading ? (
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
                Client Name - {data.shipToDetails.prefix.value}.{" "}
                {data.shipToDetails.name}
              </h1>
            </div>
            <div className="col-span-2">
              <h1 className="text-lg font-medium text-center">
                Payment Type - {data.paymentType.label}
              </h1>
            </div>
            <div className="col-span-8">
              <hr className="h-px border-1 border-neutral-800" />
            </div>
            <div className="col-span-8 text-lg font-medium">
              Address -{data.shipToDetails.address}, {data.shipToDetails.road},{" "}
              {data.shipToDetails.location}, {data.shipToDetails.landmark},{" "}
              {data.shipToDetails.city} - {data.shipToDetails.pincode}
            </div>
            <div className="col-span-8">
              <hr className="h-px border-1 border-neutral-800" />
            </div>
            <div className="col-span-4">
              <h1 className="text ">
                <span className="font-medium">Service Date - </span>
                {dateFormat(data.serviceDate)} | Time - {data.serviceTime.label}
              </h1>
              <h1 className="text ">
                <span className="font-medium">Work Location - </span>
                {data.workLocation}
              </h1>
              <h1 className="text ">
                <span className="font-medium">Approx Sqft - </span>
                {data.area}
              </h1>
              <h1 className="text ">
                <span className="font-medium">Contact Person - </span>{" "}
                {data.shipToDetails.contactName} /{" "}
                {data.shipToDetails.contactNo} /{" "}
                {data.shipToDetails.contactEmail}
              </h1>
              <h1 className="text ">
                <span className="font-medium">Job Finalised By - </span>
                {data.sales.label}
              </h1>
            </div>
            <div className="col-span-4">
              <div className="overflow-y-auto my-2">
                <table className="w-full border whitespace-nowrap border-neutral-500">
                  <thead>
                    <tr className="h-8 w-full text-md leading-none text-gray-600">
                      <th className="font-bold text-center border-neutral-800 border-2 w-20 px-3">
                        Service Name
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-28 px-3">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {data.serviceDetails?.map((service, index) => (
                      <tr
                        key={index}
                        className="h-8 text-sm leading-none text-gray-700 border-b border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="px-3 border-r font-normal border-neutral-500">
                          {service.serviceName.label}
                        </td>
                        <td className="px-3 border-r font-normal border-neutral-500">
                          {service.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-span-8">
              <hr className="h-px border-1 border-neutral-800" />
            </div>
            <div className="col-span-8 mb-2">
              <div className="overflow-y-auto my-1">
                <table className="w-full border whitespace-nowrap border-neutral-800">
                  <thead>
                    <tr className="h-8 w-full text-md leading-none text-gray-600">
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Status
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Job Type
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Job Done / Postponed Date
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Job Comment
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Amount Received
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Images
                      </th>
                      <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-2">
                        Updated By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {data.update.map((challan, index) => (
                      <tr
                        key={index}
                        className="h-8 text-sm leading-none text-gray-700 border-b border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {progress(challan.status)}
                        </td>
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {challan.type || "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {((challan.jobDate || challan.postponedDate) &&
                            dateFormat(
                              challan.jobDate || challan.postponedDate
                            )) ||
                            "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {challan.comment || "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {challan.amount || "NA"}
                        </td>
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {challan.images && (
                            <Button
                              label="Download"
                              small
                              onClick={() => handleDownload(challan.images)}
                            />
                          )}
                        </td>
                        <td className="px-3 border-r font-normal text-center border-neutral-500">
                          {challan.user} | {dateFormat(challan.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {(data.payment.label === "Cash To Collect" ||
              data.payment.label === "UPI Payment" ||
              data.payment.label === "Bill After Job") && (
              <>
                <div className="col-span-4">
                  <div className="flex items-center justify-center flex-col lg:flex-row lg:gap-x-3 mb-2">
                    <p className="text-lg font-medium text-blue-700">
                      Total Amount - {data.amount.total} Rs
                    </p>
                    <p className="text-lg font-medium text-green-700">
                      Total Received Amount - {data.amount.received} Rs
                    </p>
                  </div>
                  <div className="flex items-center flex-col lg:flex-row lg:gap-x-3">
                    {user.role !== "Sales" && data.update.length > 1 && (
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
                      </>
                    )}
                    {user.role === "Admin" && (
                      <CancelModal id={id} status={data.verify.status} />
                    )}
                  </div>
                </div>
                {data.verificationNotes.length > 0 && (
                  <div className="col-span-4">
                    <div className="overflow-y-auto">
                      <table className="w-full border whitespace-nowrap  border-neutral-500">
                        <thead>
                          <tr className="h-8 w-full text-md leading-none text-gray-600">
                            <th className="font-bold text-center  border-neutral-800 border-2 w-20 px-3">
                              Notes / Bill Number
                            </th>
                            <th className="font-bold text-center  border-neutral-800 border-2 w-10 px-3">
                              Updated By
                            </th>
                          </tr>
                        </thead>
                        <tbody className="w-full">
                          {data.verificationNotes?.map((verify) => (
                            <tr
                              key={verify._id}
                              className="h-8 text-sm leading-none text-gray-700 border-b border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
                            >
                              <td className="px-3 border-r font-normal border-neutral-500">
                                {verify.note}
                              </td>
                              <td className="px-3 border-r font-normal border-neutral-500 w-10 text-center">
                                {verify.user} | {dateFormat(verify.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
