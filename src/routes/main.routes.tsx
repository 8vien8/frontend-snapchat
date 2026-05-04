import { Routes, Route } from "react-router";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import ChatApp from "@/pages/chat-app";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* public */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* private */}
        <Route path="/" element={<ChatApp />} />
      </Routes>
    </>
  );
};
export default AppRouter;
