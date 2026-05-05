import { SignupForm } from "@/components/forms/signup-form";

const SignUp = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <SignupForm />
      </div>
    </div>
  );
};
export default SignUp;
