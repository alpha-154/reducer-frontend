"use client";

import { useSocketInstance } from "@/contexts/socketContext";
import { fetchUserThunk } from "@/slices/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

//newly added code:
import { AppSidebar } from "@/components/customComponents/AppSidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/customComponents/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { username , profileImage} = useSelector((state: RootState) => state.user);

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
      if(process.env.NODE_ENV === "development") console.log(`Socket registered for user: ${username}`);
    }
  }, [socketInstance, username]);

  return (
    <SidebarProvider>
      <AppSidebar username={username} profileImage={profileImage} />
      <main className="flex-1 bg-albasterInnerBg border border-burntSienna rounded-xl m-5 md:m-10 shadow-[0_0_20px_rgba(0,0,0,0.20)]">
        <SidebarTrigger className="ml-2 mt-2 md:ml-5 md:mt-5" />
         <ProtectedRoute>{children}</ProtectedRoute>
      </main>
    </SidebarProvider>
  );
}
