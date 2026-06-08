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
import { signUpImg } from "@/assets/images";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  signUpSchema,
  type SignUpFormValue,
} from "@/components/forms/validation.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotWaveAnimation } from "@/lib/ui/animations/dot-wave.animation";
import { FieldInputError } from "@/components/ui/field-input.error";
import ThirdPartAccess from "@/components/ui/third-part-access";
import { useAuthStore } from "@/stores/use-auth.store";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const { signUp } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValue>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormValue> = async (data) => {
    try {
      await signUp(data);
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 rounded-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-xs text-balance text-muted-foreground">
                  Create your own <strong>Snap</strong> account
                </p>
              </div>

              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstname">Firstname</FieldLabel>
                  <Input
                    disabled={isSubmitting}
                    id="firstname"
                    type="firstname"
                    placeholder="example"
                    required
                    {...register("firstname")}
                  />
                  <FieldInputError message={errors.firstname?.message} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastname">Lastname</FieldLabel>
                  <Input
                    disabled={isSubmitting}
                    id="lastname"
                    type="lastname"
                    placeholder="_123"
                    required
                    {...register("lastname")}
                  />
                  <FieldInputError message={errors.lastname?.message} />
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  disabled={isSubmitting}
                  id="username"
                  type="username"
                  placeholder="example_123"
                  required
                  {...register("username")}
                />
                <FieldInputError message={errors.username?.message} />
              </Field>
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
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    disabled={isSubmitting}
                    id="password"
                    type="password"
                    placeholder="At least 8 characters are required!"
                    required
                    {...register("password")}
                  />
                  <FieldInputError message={errors.password?.message} />
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      Registing <DotWaveAnimation />
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>
              <FieldGroup className="mt-3">
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>

                <ThirdPartAccess disabled={isSubmitting} />

                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a
                    onClick={() => navigate("/sign-in")}
                    className="cursor-pointer"
                  >
                    Sign in
                  </a>
                </FieldDescription>
              </FieldGroup>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={signUpImg}
              alt="Image"
              className="select-none pointer-events-none absolute inset-0 h-full w-full object-cover"
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
