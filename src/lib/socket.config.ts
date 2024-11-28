import { io, Socket } from "socket.io-client";

// Socket Instance
let socketInstance: Socket | null = null;

// Base URL for Socket.IO
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables"
  );
}

/**
 * Get or initialize the main socket connection
 * Handles all communication.
 */
export const getSocketInstance = (): Socket => {
  if(process.env.NODE_ENV === "development")  console.log("getSocketInstance() function called");
  if (!socketInstance) {
    socketInstance = io(baseURL, {
      autoConnect: false, // Ensure you control when the connection starts
      reconnection: true, // Explicitly enable reconnections
      reconnectionAttempts: 5, // Limit the number of reconnection attempts
      reconnectionDelay: 1000, // Wait 1 second between attempts
      reconnectionDelayMax: 3000, // Cap the delay at 3 seconds
    });
  }
  return socketInstance;
};

/**
 * Cleanup function to disconnect the main socket on logout or app shutdown.
 */
export const cleanupSocketInstance = () => {
  if(process.env.NODE_ENV === "development")  console.log("cleanupSocketInstance() function called");
  if (socketInstance) {
    socketInstance.off(); // Remove all listeners

    if (socketInstance.connected) {
      socketInstance.disconnect(); // Disconnect the socket
    }

    socketInstance = null; // Clear the reference
  }
  if(process.env.NODE_ENV === "development")  {
    console.log(
      "socketInstance cleaned up (cleanupSocketInstance()):",
      socketInstance
    );
  } 
};
