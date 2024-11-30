"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Users,
  ListTodo,
  Database,
  ChartColumnIncreasing,
  Blocks,
  Bookmark,
  ChevronDown,
  ChevronsUpDown,
  History,
  LogOut,
  MessageSquarePlus,
  Settings,
  Star,
  User2,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/api";
import { cleanupSocketInstance } from "@/lib/socket.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";




interface AppSidebarProps {
  username: string;
  profileImage: string;
}


const mainItems = [
  {
    title: "Explore",
    icon: Blocks,
    href: "#",
    subItems: [
      {
        title: "New Chat",
        icon: MessageSquarePlus,
        href: "/in-process",
      },
      { title: "Saved Chats", icon: Bookmark, href: "/in-process" },
      { title: "History", icon: History, href: "/in-process" },
      { title: "Starred", icon: Star, href: "/in-process" },
      { title: "Settings", icon: Settings, href: "/in-process" },
    ],
  },
  {
    title: "Mail",
    icon: Mail,
    href: "/mail",
  },
  {
    title: "Group",
    icon: Users,
    href: "/group",
  },
  {
    title: "Chat",
    icon: MessageCircle,
    href: "/chat",
  },
];

const helperItems = [
  {
    title: "Todo",
    icon: ListTodo,
    href: "/in-process",
  },
  {
    title: "Link Storage",
    icon: Database,
    href: "/in-process",
  },
  {
    title: "Analytics",
    icon: ChartColumnIncreasing,
    href: "/in-process",
  },
];

export function AppSidebar({ username, profileImage}: AppSidebarProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleToggle = (title: string) => {
    setOpenItem(openItem === title ? null : title);
  };

  const handleLogout = async () => {
    if (isLoading) {
      console.log("Logout is already in progress");
      return;
    }
    console.log("Starting logout process");
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await logoutUser();
      if (response.status === 200) {
        console.log("response status: ", response.status);
        // Clear the local storage
      localStorage.clear(); // Removes all stored data
      // Alternatively, remove specific keys:
      // localStorage.removeItem("yourKey");
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
    <Sidebar className="border-r-2 border-burntSienna">
      <SidebarHeader className="bg-albasterInnerBg ">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hover:bg-boneInnerBg">
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-albasterInnerBg data-[state=open]:text-darkbrownText"
                >
                  <div className="flex aspect-square size-8 items-center justify-center bg-burntSienna border border-burntSienna rounded-xl  text-sidebar-primary-foreground">
                    <Mail className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Reducer</span>
                    <span className="text-xs text-muted-foreground">
                      Communication
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-burntSienna" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] bg-albasterInnerBg text-darkbrownText"
                align="start"
                aria-describedby={undefined}
              >
               
                <DropdownMenuItem>
                  <span>Switch Organization</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Create Organization</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-albasterInnerBg">
        <SidebarGroup>
          <SidebarGroupLabel>Get Started</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu >
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title} >
                  {item.subItems ? (
                    <Collapsible
                      open={openItem === item.title}
                      onOpenChange={() => handleToggle(item.title)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full hover:bg-boneInnerBg">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {openItem === item.title ? (
                            <ChevronDown className="ml-auto size-4 text-burntSienna" />
                          ) : (
                            <ChevronRight className="ml-auto size-4 text-burntSienna" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-1">
                        <SidebarMenuSub className="flex min-w-[150px] flex-col gap-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title} >
                              <SidebarMenuSubButton asChild className="hover:bg-boneInnerBg">
                                <Link href={subItem.href}>
                                  <subItem.icon className="size-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild className=" hover:bg-boneInnerBg">
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Helpers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helperItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-boneInnerBg">
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-albasterInnerBg">
        <SidebarMenu className="bg-albasterInnerBg hover:bg-boneInnerBg/40 border border-boneInnerBg rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] mx-auto p-2 cursor-pointer">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild >
                <SidebarMenuButton className="hover:bg-boneInnerBg/40">
                  <Avatar className="size-6">
                    <AvatarImage src={profileImage} alt="profileImage" />
                    <AvatarFallback>{username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-md text-brownText font-styrene-bold">{username}</span>
                 
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] bg-albasterInnerBg border-boneInnerBg shadow-[0_0_20px_rgba(0,0,0,0.15)]"
                align="start"
                side="top"
                 aria-describedby={undefined}
              >
                <DropdownMenuLabel className="flex items-center gap-2 p-2">
                  <Avatar className="size-8">
                    <AvatarImage src={profileImage} alt="profileImage" />
                    <AvatarFallback>{username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-sm font-medium text-darkbrownText">{username}</span>
                   
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator  className="bg-boneInnerBg"/>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <User2 className="mr-2 size-4 text-darkbrownText" />
                    <span className="text-darkbrownText">Account</span>
                  </DropdownMenuItem>
                 
                </DropdownMenuGroup>
                <DropdownMenuSeparator  className="bg-boneInnerBg"/>
                <DropdownMenuItem>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    disabled={isLoading}
                    className={`w-full hover:bg-boneInnerBg ${isLoading ? "cursor-not-allowed" : ""} flex justify-start items-center`}
                  >
                    <LogOut className=" size-4 text-darkbrownText -ml-4" />
                    <span className="text-sm md:text-md text-darkbrownText">
                      {isLoading ? "Logging Out..." : "Logout"}
                    </span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
