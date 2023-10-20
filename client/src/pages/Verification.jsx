import { AlertMessage, Button, Loading } from "../components";
import { useUnverifiedChallanQuery } from "../redux/challanSlice";
import { dateFormat } from "../utils/functionHelper";

const Verification = () => {
  const { data, isLoading, error } = useUnverifiedChallanQuery();

  console.log(data);

  return (
    <div className="mx-10 my-20 lg:my-5">
      {isLoading ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      {data?.length === 0 && (
        <h2 className="text-center text-2xl text-red-600 font-semibold">
          0 Verification Pending
        </h2>
      )}
      {data && (
        <div className="overflow-y-auto my-4">
          <h1 className="mb-4 text-red-600 text-2xl font-semibold text-center">{data.length} Verification Pending</h1>
          <table className="w-full border whitespace-nowrap  dark:border-neutral-500">
            <thead>
              <tr className="h-12 w-full text-md leading-none text-gray-600">
                <th className="font-bold text-left  dark:border-neutral-800 border-2 w-20 px-3">
                  Challan Number
                </th>
                <th className="font-bold text-center  dark:border-neutral-800 border-2 w-28 px-3">
                  Service Date
                </th>
                <th className="font-bold text-left  dark:border-neutral-800 border-2 px-3">
                  Client Name
                </th>
                <th className="font-bold text-left  dark:border-neutral-800 border-2 px-3">
                  Sales Representative
                </th>
                <th className="font-bold text-left  dark:border-neutral-800 border-2 px-3">
                  Amount Pending
                </th>
                <th className="font-bold text-left  dark:border-neutral-800 border-2 px-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {data.map((challan) => (
                <tr
                  key={challan._id}
                  className="h-12 text-sm leading-none text-gray-700 border-b dark:border-neutral-500 bg-white hover:bg-gray-100 hover:cursor-pointer"
                >
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.number}
                  </td>
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {dateFormat(challan.serviceDate)}
                  </td>
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.shipToDetails.name}
                  </td>
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.sales.label}
                  </td>
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.amount - challan.collectedAmount}
                  </td>
                  <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                    <Button label="Details" height='h-8' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Verification;
