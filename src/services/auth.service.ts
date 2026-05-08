import api from "@/lib/axios";

export type SignUpPayload = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};

export const authService = {
  signUp: async (payload: SignUpPayload) => {
    const { data } = await api.post("auth/signup", payload, {
      withCredentials: true,
    });

    return data;
  },
};
