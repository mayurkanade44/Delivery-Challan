import { useEffect, useMemo, useState } from "react";
import { useSearchClientQuery } from "../redux/challanSlice";
import Loading from "./Loading";

const SearchClient = ({ setShipToDetails }) => {
  const [tempSearch, setTempSearch] = useState("");
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(true);
  const [clients, setClients] = useState([]);
  const [location, setLocation] = useState("All");
  const [locationOptions, setLocationOptions] = useState([]);

  const { data, isLoading, isFetching } = useSearchClientQuery(
    { search },
    { skip }
  );

  useEffect(() => {
    if (data) {
      const temp = [];
      data.map(
        (item) =>
          !temp.includes(item.shipToDetails.location) &&
          temp.push(item.shipToDetails.location)
      );
      setLocationOptions(temp);
      if (location !== "All") {
        setClients(
          data.filter((item) => item.shipToDetails.location === location)
        );
      } else {
        setClients(data);
      }
    }
  }, [data, location]);

  const debounce = () => {
    let timeoutId;
    return (e) => {
      let temp = e.target.value;
      setTempSearch(temp);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (temp.length > 0) setSkip(false);
        else setSkip(true);
        setSearch(temp);
      }, 1000);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <div>
      {(isLoading || isFetching) && <Loading />}
      <label className="block text-md font-medium leading-6 text-gray-900">
        Client Name
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          className="p-1 border-2 w-1/3 text-sm rounded text-gray-600 placeholder-gray-500 "
          placeholder="Search"
          value={tempSearch}
          onChange={optimizedDebounce}
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-2 rounded-md ml-1 py-0.5 w-1/6"
        >
          {["All", ...locationOptions].map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        {clients?.length > 0 && (
          <div className="mt-1 max-h-40 w-1/3 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {clients?.map((person) => (
              <div
                key={person._id}
                className="relative group py-1 pl-3 pr-9 text-black hover:cursor-pointer hover:bg-blue-300"
                onClick={() => setShipToDetails(person.shipToDetails)}
              >
                <div className="flex">
                  <p className="">{person.shipToDetails.name}</p>
                  <div className="lg:hidden transition-all duration-500 lg:bottom-0 lg:transform lg:translate-x lg:group-hover:block">
                    <h6 className="bg-dark-soft p-1 lg:bg-white flex flex-col border-2 shadow-lg rounded-lg overflow-hidden">
                      {person.shipToDetails.address} {person.shipToDetails.road}{" "}
                      {person.shipToDetails.location}{" "}
                      {person.shipToDetails.landmark}{" "}
                      {person.shipToDetails.city}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchClient;
