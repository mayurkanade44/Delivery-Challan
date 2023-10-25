import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ roles }) => {
  const { user } = useSelector((store) => store.helper);

  if (user) {
    if (roles && !roles.includes(user.role)) return <Navigate to="/home" />;
    return <Outlet />;
  } else return <Navigate to="/" />;
};
export default ProtectedRoute;
