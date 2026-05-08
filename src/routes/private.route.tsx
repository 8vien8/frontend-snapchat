import LoadingScreen from "@/components/loading-screen";
import { useAuthStore } from "@/stores/use-auth.store";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const { accessToken, isLoading } = useAuthStore();

  if (isLoading) return <LoadingScreen />;

  if (!accessToken) return <Navigate to={"/sign-in"} replace />;

  return <Outlet />;
};
export default PrivateRoute;
