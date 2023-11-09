import { Link } from "react-router-dom";
import { AlertMessage, Button, Loading } from "../components";
import { useUnverifiedChallanQuery } from "../redux/challanSlice";
import { dateFormat } from "../utils/functionHelper";
import { useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { jobStatus } from "../utils/constData";

const Verification = () => {
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [status, setStatus] = useState("All");

  const { data, isLoading, error, isFetching } = useUnverifiedChallanQuery({
    search,
    status,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(tempSearch);
  };

  const clearSearch = () => {
    setTempSearch("");
    setSearch("");
    setStatus("All")
  };

  const progress = (status) => {
    let text = "text-blue-600";
    if (status === "Completed") text = "text-green-600";
    else if (status === "Partially Completed") text = "text-pink-600";
    else if (status === "Cancelled" || status === "Not Completed")
      text = "text-red-600";

    return <p className={`${text} font-semibold`}>{status}</p>;
  };

  return (
    <div className="mx-10 my-20 lg:my-5">
      {isLoading || isFetching ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      {data && (
        <div className="overflow-y-auto my-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-center mb-2"
          >
            <div className="flex items-center px-1 bg-white border md:w-52 lg:w-80 rounded border-gray-300 ml-10 mr-3">
              <AiOutlineSearch />
              <input
                type="text"
                className="py-1 md:py-1.5 pl-1 w-full focus:outline-none text-sm rounded text-gray-600 placeholder-gray-500"
                placeholder="Search..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
              />
              {tempSearch && (
                <button type="button" onClick={clearSearch}>
                  <AiOutlineClose color="red" />
                </button>
              )}
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-2 rounded-md mr-2 py-1 w-44"
            >
              {["All", "Open", ...jobStatus.map((item) => item.label)].map(
                (item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                )
              )}
            </select>
            <Button
              type="submit"
              label="Search"
              color="bg-black"
              height="h-8"
            />
          </form>
          <h1 className="mb-4 text-red-600 text-2xl font-semibold text-center">
            {data.length} Slips Verification Pending
          </h1>
          <table className="w-full border whitespace-nowrap  border-neutral-500">
            <thead>
              <tr className="h-12 w-full text-md leading-none text-gray-600">
                <th className="font-bold text-left border-neutral-800 border-2 w-20 px-3">
                  Slip Number
                </th>
                <th className="font-bold text-center border-neutral-800 border-2 w-28 px-3">
                  Service Date
                </th>
                <th className="font-bold text-left border-neutral-800 border-2 px-3">
                  Client Name
                </th>
                <th className="font-bold text-left border-neutral-800 border-2 px-3">
                  Sales Representative
                </th>

                <th className="font-bold text-left border-neutral-800 border-2 px-3">
                  Payment Type
                </th>
                <th className="font-bold text-left border-neutral-800 border-2 px-3">
                  Amount Pending
                </th>
                <th className="font-bold text-center border-neutral-800 border-2 px-3">
                  Job Status
                </th>
                <th className="font-bold text-center border-neutral-800 border-2 px-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {data.map((challan) => (
                <tr
                  key={challan._id}
                  className="h-12 text-sm leading-none text-gray-700 border-b border-neutral-500 bg-white hover:bg-gray-100"
                >
                  <td className="px-3 border-r text-center font-normal border-neutral-500">
                    {challan.number}
                  </td>
                  <td className="px-3 border-r text-center font-normal border-neutral-500">
                    {dateFormat(challan.serviceDate)}
                  </td>
                  <td className="px-3 border-r font-normal border-neutral-500">
                    {challan.shipToDetails.name}
                  </td>
                  <td className="px-3 border-r font-normal border-neutral-500">
                    {challan.sales.label}
                  </td>
                  <td className="px-3 border-r font-normal border-neutral-500">
                    {challan.paymentType.label}
                  </td>
                  <td className="px-3 border-r text-center font-normal border-neutral-500">
                    ₹ {challan.amount.total - challan.amount.received}
                  </td>
                  <td className="px-3 border-r font-normal text-center border-neutral-500">
                    {progress(
                      challan.update[challan.update.length - 1]?.status
                    )}
                  </td>
                  <td className="px-3 border-r font-normal text-center border-neutral-500">
                    <Link to={`/challan/${challan._id}`}>
                      <Button label="Details" height="h-8" />
                    </Link>
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
