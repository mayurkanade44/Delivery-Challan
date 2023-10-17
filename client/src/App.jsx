import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Admin, Login, NewChallan, UpdateChallan } from "./pages";
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
        <Route index={true} path="/create" element={<NewChallan />} />
        <Route index={true} path="/admin" element={<Admin />} />
        <Route index={true} path="/update/:id" element={<UpdateChallan />} />
      </Route>
    )
  );
  return <RouterProvider router={Router} />;
}

export default App;
