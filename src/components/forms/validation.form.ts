import { z } from "zod";

const signUpSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  username: z.string().min(4, "Username must include at least 4 characters"),
  email: z.email("Email is not valid"),
  password: z.string().min(6, "Password must include at least 6 characters"),
});

export type SignUpFormValue = z.infer<typeof signUpSchema>;

const signInSchema = z.object({
  email: z.email("Email or password is not valid"),
  password: z.string().min(6, "Email or password is not valid"),
});

export type SignInFormValue = z.infer<typeof signInSchema>;

export { signUpSchema, signInSchema };
