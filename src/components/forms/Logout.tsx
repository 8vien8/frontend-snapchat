import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth.store";
import { useNavigate } from "react-router";

const Logout = () => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};
export default Logout;
