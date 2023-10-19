import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import {
  Admin,
  Dashboard,
  Home,
  Login,
  NewChallan,
  SingleChallan,
  UpdateChallan,
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "./components";

function App() {
  const Layout = () => {
    return (
      <>
        <ToastContainer position="top-center" autoClose={2000} />
        <Navbar />
        <div>
          <Outlet />
        </div>
      </>
    );
  };

  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index={true} path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<NewChallan />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/update/:id" element={<UpdateChallan />} />
        <Route path="/challan/:id" element={<SingleChallan />} />
      </Route>
    )
  );
  return <RouterProvider router={Router} />;
}

export default App;
