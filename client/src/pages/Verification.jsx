import { AlertMessage, Loading } from "../components";
import { useUnverifiedChallanQuery } from "../redux/challanSlice";

const Verification = () => {
  const { data, isLoading, error } = useUnverifiedChallanQuery();

  return (
    <div className="mx-10 my-20 lg:my-5">
      {isLoading ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      {data?.length === 1 && (
        <h2 className="text-center text-2xl text-red-600 font-semibold">
          0 Verification Pending
        </h2>
      )}
      {data && (
        <div className="overflow-y-auto my-4">
          <table className="w-full border whitespace-nowrap  dark:border-neutral-500">
            <thead>
              <tr className="h-12 w-full text-md leading-none text-gray-600">
                <th className="font-bold text-left  dark:border-neutral-800 border-2 w-20 px-3">
                  Challan Number
                </th>
                <th className="font-bold text-center  dark:border-neutral-800 border-2 w-28 px-3">
                  Date
                </th>
                <th className="font-bold text-left  dark:border-neutral-800 border-2 px-3">
                  Customer Name
                </th>
                <th className="font-bold text-left  dark:border-neutral-800 border-2 px-3">
                  Sales Representative
                </th>
              </tr>
            </thead>
          </table>
        </div>
      )}
    </div>
  );
};
export default Verification;
