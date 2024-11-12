"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export function CustomDropDown() {

    const router = useRouter();

    // Logout User handler
    const handleLogout = async () => {
      console.log("logout");
        try {
          const response = await logoutUser();
          if (response.status === 200) {
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
          <Button variant="custom" onClick={handleLogout}  className="text-lg cursor-pointer">LogOut</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
