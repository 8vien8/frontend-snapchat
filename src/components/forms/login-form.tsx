import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { signInImg } from "@/assets/images";
import { toastVariants } from "@/components/toaster";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  signInSchema,
  type SignInFormValue,
} from "@/components/forms/validation.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldInputError } from "@/components/ui/field-input.error";
import { LoaderCircle } from "lucide-react";
import ThirdPartAccess from "@/components/forms/third-part-access";
import { useAuthStore } from "@/stores/use-auth.store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValue>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormValue> = async (data) => {
    try {
      await signIn(data);
      // navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 rounded-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your <strong>Snap</strong> account
                </p>
              </div>
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    disabled={isSubmitting}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...register("email")}
                  />
                  <FieldInputError message={errors.email?.message} />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-xs underline-offset-2 hover:underline"
                      onClick={() => toastVariants.developing()}
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    disabled={isSubmitting}
                    id="password"
                    type="password"
                    required
                    {...register("password")}
                  />
                  <FieldInputError message={errors.password?.message} />
                </Field>
              </FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <LoaderCircle className="mr-1 animate-spin" />
                      Logging in
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <ThirdPartAccess disabled={isSubmitting} />

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <a
                  onClick={() => navigate("/sign-up")}
                  className="cursor-pointer"
                >
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={signInImg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale select-none pointer-events-none"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-balance">
        By clicking <strong>continue</strong>, you agree to our{" "}
        <a href="#">Terms of Service </a>
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
