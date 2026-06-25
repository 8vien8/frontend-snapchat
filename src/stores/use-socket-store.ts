import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/use-auth.store";
import type { SocketState } from "@/types/store";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });
    // socket.on("connect", () => console.log("Connected to Socket"));
    // socket.on("connect_error", (err) => {
    //   console.error("Socket error:", err.message);
    // });
  },
  disConnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
