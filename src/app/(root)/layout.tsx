"use client";

import Navbar from "@/components/customComponents/Navbar";
import { useSocketInstance } from "@/contexts/socketContext";
import { fetchUserThunk } from "@/slices/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);

  // Access the main socket instance from the context
  const socketInstance = useSocketInstance();

  // Fetch user data when the layout is loaded
  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  // Emit the `register` event once the username is available
  useEffect(() => {
    if (username) {
      socketInstance.emit("register", username); // Register the user
      console.log(`Socket registered for user: ${username}`);
    }
  }, [socketInstance, username]);

  return (
    <main className="container-max py-8 mt-2 p-5">
      <div className="w-full flex justify-center items-center mb-10">
        <Navbar />
      </div>
      {children}
    </main>
  );
}
