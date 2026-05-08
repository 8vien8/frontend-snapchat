import api from "@/lib/axios";

export type SignUpPayload = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};

export type SignInPayload = {
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

  signIn: async (payload: SignInPayload) => {
    const { data } = await api.post("auth/signin", payload, {
      withCredentials: true,
    });
    return data;
  },

  logOut: async () => {
    return api.post("auth/logout", {}, { withCredentials: true });
  },

  getMe: async () => {
    const res = await api.get("/auth/me", { withCredentials: true });
    return res?.data.user;
  },
};
