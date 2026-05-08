import { useAuthStore } from "@/stores/use-auth.store";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const { accessToken, user, isLoading } = useAuthStore();

  if (!accessToken) return <Navigate to={"/sign-in"} replace />;

  return <Outlet />;
};
export default PrivateRoute;
