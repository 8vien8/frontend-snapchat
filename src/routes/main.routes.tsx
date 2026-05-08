import { Routes, Route } from "react-router";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import ChatApp from "@/pages/chat-app";
// import AuthLayout from "@/layouts/auth.layout";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* public */}
        {/* <Route element={<AuthLayout />}> */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* </Route> */}

        {/* private */}
        <Route path="/" element={<ChatApp />} />
      </Routes>
    </>
  );
};
export default AppRouter;
