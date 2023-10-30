import { useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { AlertMessage, Button, Loading } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useAllChallanQuery } from "../redux/challanSlice";
import { dateFormat } from "../utils/functionHelper";

const Home = () => {
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.helper);

  const { data, isLoading, isFetching, error } = useAllChallanQuery({
    search,
    page,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(tempSearch);
  };

  const clearSearch = () => {
    setTempSearch("");
    setSearch("");
  };

  const progress = (status) => {
    let text = "text-blue-600";
    if (status === "Completed") text = "text-green-600";
    else if (status === "Partially Completed") text = "text-pink-600";
    else if (status === "Cancelled") text = "text-red-600";

    return <p className={`${text} font-semibold`}>{status}</p>;
  };

  const pages = Array.from({ length: data?.pages }, (_, index) => index + 1);

  return (
    <>
      {isLoading || isFetching ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      <div className="mx-10 my-20 lg:my-5">
        <div className="px-2 mb-5">
          <div className="md:flex items-center justify-between">
            <p className=" text-center  lg:text-2xl font-bold leading-normal text-gray-800">
              All Service Slips
            </p>
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="flex items-center px-1 bg-white border md:w-52 lg:w-80 rounded border-gray-300 mr-3">
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
              <Button
                type="submit"
                label="Search"
                color="bg-black"
                height="h-8"
              />
            </form>

            <div className="flex items-end justify-around mt-4 md:mt-0 md:ml-3 lg:ml-0">
              {(user.role === "Admin" || user.role === "Sales") && (
                <Link to="/create">
                  <Button
                    label="Create Service Slip"
                    height="h-9"
                    color="bg-green-600"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
        {data?.challans.length === 0 && (
          <h6 className="text-red-500 text-xl font-semibold text-center mb-2">
            No Service Slip Found
          </h6>
        )}
        <div className="overflow-y-auto my-4">
          <table className="w-full border whitespace-nowrap  dark:border-neutral-500">
            <thead>
              <tr className="h-12 w-full text-md leading-none text-gray-600">
                <th className="font-bold text-left  dark:border-neutral-800 border-2 w-20 px-3">
                  Slip Number
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
                <th className="font-bold text-center  dark:border-neutral-800 border-2 w-32 px-3">
                  Service Date
                </th>
                <th className="font-bold text-center  dark:border-neutral-800 border-2 w-40 px-3">
                  Progress
                </th>
                {user.role !== "Service Operator" && (
                  <th className="font-bold text-center  dark:border-neutral-800 border-2 w-24 px-2">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="w-full">
              {data?.challans.map((challan) => (
                <tr
                  key={challan._id}
                  className="h-12 text-sm leading-none text-gray-700 border-b dark:border-neutral-500 bg-white hover:bg-gray-100"
                >
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.number}
                  </td>
                  <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                    {dateFormat(challan.createdAt)}
                  </td>
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.shipToDetails.name}
                  </td>
                  <td className="px-3 border-r font-normal dark:border-neutral-500">
                    {challan.sales.label}
                  </td>
                  <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                    {dateFormat(challan.serviceDate)}
                  </td>
                  <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                    {progress(
                      challan.update[challan.update.length - 1]?.status
                    )}
                  </td>
                  {user.role !== "Service Operator" && (
                    <td className="px-3 border-r font-normal text-center dark:border-neutral-500">
                      <Link to={`/challan/${challan._id}`}>
                        <Button label="Details" height="h-7" small />
                      </Link>
                      <a href={challan.file}>
                        <Button
                          label="Download"
                          color="bg-emerald-500"
                          height="h-7"
                          small
                        />
                      </a>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages.length > 1 && (
          <nav className="mb-4">
            <ul className="list-style-none flex justify-center mt-2">
              {pages.map((item) => (
                <li className="pr-1" key={item}>
                  <button
                    className={`relative block rounded px-3 py-1.5 text-sm transition-all duration-30  ${
                      page === item ? "bg-blue-400" : "bg-neutral-700"
                    } text-white hover:bg-blue-400`}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};
export default Home;
