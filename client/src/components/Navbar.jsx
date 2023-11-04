import { useState } from "react";
import logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { toast } from "react-toastify";

import { useLogoutMutation } from "../redux/userSlice";
import { removeCredentials } from "../redux/helperSlice";

const navData = [
  {
    name: "Home",
    link: "/home",
    icon: <AiOutlineHome className="mr-2 w-5 h-5" />,
    role: ["Admin", "Back Office", "Sales"],
  },
  {
    name: "Verification",
    link: "/verification",
    icon: <AiOutlineCheckCircle className="mr-2 w-5 h-5" />,
    role: ["Admin", "Back Office"],
  },
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <RxDashboard className="mr-2 w-4 h-4" />,
    role: ["Admin"],
  },
  {
    name: "Admin",
    link: "/admin",
    icon: <RiAdminLine className="mr-2 w-4 h-4" />,
    role: ["Admin"],
  },
];

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.helper);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logout successfully");
      setShow(!show);
      dispatch(removeCredentials());
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <>
      {user && (
        <div className="bg-gray-200 h-full w-full">
          <nav className="bg-white shadow lg:block hidden">
            <div className="mx-auto container py-2 lg:py-0">
              <div
                className={`flex items-center ${
                  user ? "justify-between" : "justify-center"
                } `}
              >
                <div className="flex w-full sm:w-auto items-center sm:items-stretch justify-end sm:justify-center">
                  <div className="flex items-center lg:pl-10 xl:pl-0">
                    <img src={logo} className="w-12" />
                    <h2 className="hidden sm:block text-xl text-gray-700 font-bold leading-normal pl-3">
                      Single Service Slip
                    </h2>
                  </div>
                </div>
                {user && (
                  <div className="flex mr-8">
                    <div className="hidden lg:flex lg:mr-7">
                      {navData.map((nav) => (
                        <div key={nav.name}>
                          {nav.role.includes(user?.role) && (
                            <Link
                              to={nav.link}
                              className="flex px-5 items-center py-4 text-md leading-5 text-black hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                            >
                              {nav.icon}
                              {nav.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-white items-center gap-y-1 lg:text-dark-soft flex flex-col lg:flex-row gap-x-1 font-semibold">
                      <div className="relative group">
                        <div className="flex flex-col items-center">
                          <button
                            className="flex gap-x-1 items-center lg:mt-0 pr-1 py-1 rounded-full text-dark font-semibold"
                            onClick={() => setProfileDropdown(!profileDropdown)}
                          >
                            <span className="text-blue-500 text-lg">
                              {user.name.split(" ")[0]}
                            </span>
                          </button>
                          <div
                            className={`${
                              profileDropdown ? "block" : "hidden"
                            } lg:hidden transition-all duration-500 lg:absolute lg:bottom-0 lg:transform lg:translate-y-full lg:group-hover:block w-[95px]`}
                          >
                            <ul className="bg-dark-soft lg:bg-white text-center flex flex-col border-2  shadow-lg rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="px-1 py-1 text-red-500 hover:text-black flex items-center justify-center"
                              >
                                <AiOutlineLogout className="h-4 w-4 mr-1" />
                                Logout
                              </button>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <nav>
            {user && (
              <div className="py-2 px-8 w-full border flex lg:hidden justify-between items-center bg-white fixed top-0 z-40">
                <div className="flex items-center gap-x-3">
                  <img src={logo} className="w-10" />
                  <span className="text font-medium">Single Service Slip</span>
                </div>
                <div className="flex items-center">
                  <div className="relative mr-2 text-blue-500 font-semibold">
                    {user.name?.split(" ")[0] || "Mayur"}
                  </div>
                  <div
                    id="menu"
                    className="text-gray-800"
                    onClick={() => setShow(!show)}
                  >
                    {!show && <AiOutlineMenuUnfold className="w-6 h-6" />}
                  </div>
                </div>
              </div>
            )}
            {/*Mobile responsive sidebar*/}
            <div
              className={
                show
                  ? "w-full xl:hidden h-full absolute z-40  transform  translate-x-0 "
                  : "   w-full xl:hidden h-full absolute z-40  transform -translate-x-full"
              }
            >
              <div
                className="bg-gray-800 opacity-50 w-full h-full"
                onClick={() => setShow(!show)}
              />
              <div className="w-64 z-40 fixed overflow-y-auto top-0 bg-white shadow h-full flex-col justify-between xl:hidden  transition duration-150 ease-in-out">
                <div className="px-6 h-full">
                  <div className="flex flex-col justify-between h-full w-full">
                    <div>
                      <div className="flex items-center justify-end w-full">
                        <div
                          className="text-gray-800"
                          onClick={() => setShow(!show)}
                        >
                          <AiOutlineMenuFold className="w-6 h-6" />
                        </div>
                      </div>
                      <ul>
                        {navData.map((nav) => (
                          <div key={nav.name}>
                            {nav.role.includes(user?.role) && (
                              <li className="text-gray-800 pt-2 pb-4">
                                <Link
                                  to={nav.link}
                                  onClick={() => setShow(!show)}
                                  className="flex items-center"
                                >
                                  {nav.icon}
                                  <span className="ml-3">{nav.name}</span>
                                </Link>
                              </li>
                            )}
                          </div>
                        ))}
                        <li className="text-gray-800 pt-2">
                          <button
                            type="button"
                            className="flex items-center text-red-500"
                            onClick={handleLogout}
                          >
                            <AiOutlineLogout className="mr-4 h-5 w-5" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
export default Navbar;
