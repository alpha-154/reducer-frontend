import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseURL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables");
    }
    socket = io(baseURL, { autoConnect: false });
  }
  return socket;
};
