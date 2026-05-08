import { Routes, Route } from "react-router";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import ChatApp from "@/pages/chat-app";
import PrivateRoute from "@/routes/private.route";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* public */}

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* </Route> */}

        {/* private */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ChatApp />} />
        </Route>
      </Routes>
    </>
  );
};
export default AppRouter;
