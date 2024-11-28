"use client";

import React, { createContext, useContext, useEffect } from "react";
import { getSocketInstance, cleanupSocketInstance } from "@/lib/socket.config";
import { Socket } from "socket.io-client";



const SocketContext = createContext<Socket| null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketInstanceContext = getSocketInstance();

  useEffect(() => {
    socketInstanceContext.connect();

    // Add event listeners
    socketInstanceContext.on("connect", () => {
      if(process.env.NODE_ENV === "development") console.log("Socket Instance Connected!", socketInstanceContext.id);

    });

    socketInstanceContext.on("connect_error", (err) => {
      if(process.env.NODE_ENV === "development") console.error("Socket Instance Connection Error:", err.message);
    });

    socketInstanceContext.on("disconnect", (reason) => {
      if(process.env.NODE_ENV === "development") console.warn(`Main socket disconnected (socketContext): ${reason}`);
    });

    // Cleanup logic to disconnect socket only when the app shuts down or user logs out
    return () => {
      if(process.env.NODE_ENV === "development") console.log("Cleaning up Socket Context...");
      socketInstanceContext.off(); // Remove all event listeners
      socketInstanceContext.disconnect(); // Disconnect the socket
      if(process.env.NODE_ENV === "development")  console.log("Socket Instance Disconnected and Cleaned Up!");
    };
  }, [socketInstanceContext]);

  return (
    <SocketContext.Provider value={socketInstanceContext}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketInstance = (): Socket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useMainSocket must be used within a SocketProvider");
  }
  return context;
};

