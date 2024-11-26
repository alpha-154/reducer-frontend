"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cleanupSocketInstance } from "@/lib/socket.config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { logoutUser } from "@/api";
import { Loader2 } from "lucide-react";

export function CustomSheetDropDown() {
  const router = useRouter();

  // Logout User handler
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogout = async () => {
    console.log("logout");
    try {
      setIsLoading(true);
      const response = await logoutUser();
      if (response.status === 200) {
        cleanupSocketInstance();
        toast.success("logged out!");
        router.replace("/login");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full">
          <Button variant="custom">Profile</Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="">
        <DropdownMenuItem>
          <button className="text-lg cursor-pointer">Account</button>
        </DropdownMenuItem>

        <DropdownMenuItem>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-colors-custom-orange" />
              <span className="text-white">Logging out...</span>
            </div>
          ) : (
            <Button
              variant="custom"
              onClick={handleLogout}
              className="w-full text-lg cursor-pointer"
            >
              Logout
            </Button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
