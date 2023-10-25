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
  Verification,
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, ProtectedRoute } from "./components";

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

        <Route path="" element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Admin Route */}
        <Route path="" element={<ProtectedRoute roles={["Admin"]} />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Service Operator Route */}
        <Route
          path=""
          element={<ProtectedRoute roles={["Admin", "Service Operator"]} />}
        >
          <Route path="/update/:id" element={<UpdateChallan />} />
        </Route>

        {/* Sales Route */}
        <Route
          path=""
          element={
            <ProtectedRoute
              roles={["Admin", "Service Operator", "Sales", "Back Office"]}
            />
          }
        >
          <Route path="/create" element={<NewChallan />} />
          <Route path="/challan/:id" element={<SingleChallan />} />
        </Route>

        {/*Back Office Route */}
        <Route
          path=""
          element={<ProtectedRoute roles={["Admin", "Back Office"]} />}
        >
          <Route path="/verification" element={<Verification />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={Router} />;
}

export default App;
