"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  Mail,
  Users,
  LogOut,
  Settings,
  User,
  MessageCircle,
  ListTodo,
  Database,
  ChartSpline,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/api";
import { cleanupSocketInstance } from "@/lib/socket.config";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface NavLinkProps {
  title: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  children?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({
  title,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}) => {
  return (
    <div
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onClick}
        className="flex items-center px-4 py-2  text-brownText hover:text-burntSiennaDeep transition-all duration-300"
      >
        <span className="mr-1 text-md">{title}</span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown size={16} />
        </span>
      </button>
      <div
        className={`
          absolute ${
            title === "Profile" ? "max-sm:-translate-x-[50%]" : ""
          } md:-translate-x-1/2 top-full w-52 py-1.5 
          bg-albasterInnerBg border border-burntSienna rounded-xl shadow-xl 
          transform transition-all duration-300 ease-out z-50
          ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible"
          }
          md:w-64 md:left-0 md:translate-x-0
          lg:w-72 lg:left-0 lg:translate-x-0
        `}
      >
        {children}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMouseEnter = (menu: string) => {
    if (!isClicked) {
      setActiveMenu(menu);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      setActiveMenu(null);
    }
  };

  const handleClick = (menu: string) => {
    setIsClicked(true);
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = () => {
    setIsClicked(false);
    setActiveMenu(null);
  };

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

  const menuItems = {
    getting_started: [
      {
        icon: Mail,
        label: "Mail",
        desc: "Re-usable components built using Radix UI and Tailwind CSS",
        href: "/mail",
      },
      {
        icon: MessageCircle,
        label: "Chat",
        desc: "Re-usable components built using Radix UI and Tailwind CSS",
        href: "/chat",
      },
      {
        icon: Users,
        label: "Group",
        desc: "How to install dependencies and structure your app",
        href: "/group",
      },
    ],
    helpers: [
      {
        icon: ListTodo,
        label: "Todo App",
        desc: "A modal dialog that interrupts the user with important content",
        href: "/todo",
      },
      {
        icon: Database,
        label: "Saved Links",
        desc: "Popup that displays information on keyboard focus",
        href: "/savedlinks",
      },
      {
        icon: ChartSpline,
        label: "Analytics",
        desc: "Displays completion progress of a task as a progress bar",
        href: "/analytics",
      },
    ],
    profile: [
      {
        icon: User,
        label: "Profile Settings",
        desc: "Manage your account preferences",
        href: "/profile/settings",
      },
      {
        icon: Settings,
        label: "App Settings",
        desc: "Configure application settings",
        href: "/settings",
      },
      {
        icon: LogOut,
        label: "Logout",
        desc: "Sign out of your account",
        onClick: handleLogout,
      },
    ],
  };

  const renderMenuContent = (menuKey: keyof typeof menuItems) => (
    <div className="py-1">
      {menuItems[menuKey].map((item, index) => {
        // If the item has an onClick handler (like logout), use a button instead of a Link
        if ("onClick" in item) {
          return (
            <button
              key={index}
              className="w-full block"
              onClick={() => {
                handleMenuItemClick();
                item.onClick?.();
              }}
              disabled={isLoading}
            >
              <div className="px-4 py-2.5 hover:bg-boneInnerBg transition-all duration-200 group">
                <div className="flex items-center">
                  {item.icon && (
                    <item.icon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-burntSienna  transition-colors duration-200" />
                  )}
                  <div>
                    <div className="text-left text-sm font-medium text-brownText group-hover:text-burntSienna  transition-colors duration-200">
                      {item.label}
                    </div>
                    <div className="text-xs text-brownText group-hover:text-brownText transition-colors duration-200">
                      {item.desc}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        }

        // Regular link items
        return (
          <Link
            href={item.href}
            key={index}
            className="block"
            onClick={handleMenuItemClick}
          >
            <div className="px-4 py-2.5 hover:bg-boneInnerBg transition-all duration-200 group">
              <div className="flex items-center">
                {item.icon && (
                  <item.icon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-burntSienna  transition-colors duration-200" />
                )}
                <div>
                  <div className="text-sm font-medium text-brownText group-hover:text-burntSienna transition-colors duration-200">
                    {item.label}
                  </div>
                  <div className="text-xs text-brownText group-hover:text-brownText transition-colors duration-200">
                    {item.desc}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="bg-albasterbg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6 relative">
            <NavLink
              title="Start"
              isOpen={activeMenu === "getting_started"}
              onMouseEnter={() => handleMouseEnter("getting_started")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("getting_started")}
            >
              {renderMenuContent("getting_started")}
            </NavLink>

            <NavLink
              title="Helpers"
              isOpen={activeMenu === "helpers"}
              onMouseEnter={() => handleMouseEnter("helpers")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("helpers")}
            >
              {renderMenuContent("helpers")}
            </NavLink>

            <NavLink
              title="Profile"
              isOpen={activeMenu === "profile"}
              onMouseEnter={() => handleMouseEnter("profile")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("profile")}
            >
              {renderMenuContent("profile")}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
