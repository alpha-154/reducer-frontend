"use client";

import { useSocketInstance } from "@/contexts/socketContext";
import { fetchUserThunk } from "@/slices/userSlice";
import { updateUnseenNotifications } from "@/slices/notificationSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";

//newly added code:
import { AppSidebar } from "@/components/customComponents/AppSidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/customComponents/ProtectedRoute";

interface notificationPayloadProps {
  recipientUserName: string;
  payload: string
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId, username , profileImage} = useSelector((state: RootState) => state.user);

  // Access the main socket instance from the context
  const socketInstance = useSocketInstance();

  // Fetch user data when the layout is loaded
  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  // Emit the `register` event once the username is available
  useEffect(() => {
    if (userId) {
      socketInstance.emit("register", userId); // Register the user
      if(process.env.NODE_ENV === "development") console.log(`Socket registered for user: ${userId} <-> ${username}`);
    }
  }, [socketInstance, userId, username]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNotification = (notificationPayload: notificationPayloadProps) => {
      // Notifying the user with a toast
      toast.success(notificationPayload.payload);
       // dispatching this notification to the redux store
      dispatch(updateUnseenNotifications({ addOne: true}));
    };

    socketInstance.on("newNotification", handleNotification);

    // Clean up to avoid duplicate listeners
    return () => {
      socketInstance.off("newNotification", handleNotification);
    };
  }, [socketInstance]);


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
