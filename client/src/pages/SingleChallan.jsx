import { useParams } from "react-router-dom";
import { useSingleChallanQuery } from "../redux/challanSlice";
import { AlertMessage, Button, Loading } from "../components";
import { dateFormat, dateTimeFormat } from "../utils/functionHelper";

const SingleChallan = () => {
  const { id } = useParams();
  const { data, isLoading: challanLoading, error } = useSingleChallanQuery(id);

  const progress = (status) => {
    let text = "text-blue-600";
    if (status === "Completed") text = "text-green-600";
    else if (status === "Partially Completed") text = "text-pink-600";
    else if (status === "Cancelled") text = "text-red-600";

    return <p className={`${text} font-semibold`}>{status}</p>;
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
                Challan Number - {data.number}
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
                    <tr className="h-12 w-full text-md leading-none text-gray-600">
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
                        className="h-12 text-sm leading-none text-gray-700 border-b dark:border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
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
            <div className="col-span-8">
              <div className="overflow-y-auto my-1">
                <table className="w-full border whitespace-nowrap  dark:border-neutral-500">
                  <thead>
                    <tr className="h-8 w-full text-md leading-none text-gray-600">
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Date & Time
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Status
                      </th>
                      <th className="font-bold text-center  dark:border-neutral-800 border-2 w-20 px-2">
                        Amount Collected
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
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          {dateTimeFormat(challan.date)}
                        </td>
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          {progress(challan.status)}
                        </td>
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          {challan.amount}
                        </td>
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          <Button label="Download" small />
                        </td>
                        <td className="px-3 border-r font-normal dark:border-neutral-500">
                          {challan.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {(data.paymentType.label === "Cash To Collect" ||
              data.paymentType.label === "G-Pay Payment") && (
              <>
                <div className="col-span-2">
                  <h1 className="text-lg font-medium text-red-600">
                    Total Amount - {data.amount} Rs
                  </h1>
                </div>
                <div className="col-span-2">
                  <h1 className="text-lg font-medium text-red-600">
                    Total Received Amount - {data.collectedAmount} Rs
                  </h1>
                </div>
                <Button label="Verify" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SingleChallan;
