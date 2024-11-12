// UserCard.tsx
"use client";
import React, { useState } from "react";
import Drawer from "./Drawer"; // Import the Drawer component
import Image from "next/image";

interface UserCardProps {
  profileImage: string;
  username: string;
  lastText: string;
  date: string;
  privateMessageId: string;

}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  username,
  lastText,
  date,
  privateMessageId,

}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
   
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <div
        onClick={toggleDrawer}
        className="bg-colors-custom-orange-thin flex justify-between items-center p-3 border border-colors-custom-orange rounded-xl mb-2 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex justify-center items-center border border-colors-custom-orange rounded-full">
            <Image
              src={profileImage}
              width={40}
              height={40}
              alt="profile"
              className="rounded-full object-fit"
            />
          </div>
          <div>
            <h3 className="text-md md:text-lg font-semibold">{username}</h3>
            <p className="text-sm md:text-md text-gray-500">{lastText}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center gap-1">
          <span className="text-sm md:text-md text-gray-500">{date}</span>
          <span className="w-5 h-5 border border-colors-custom-orange rounded-full p-1 text-sm text-colors-custom-orange-text-3 flex justify-center items-center">
            1
          </span>
        </div>
      </div>

      {/* Drawer component */}
      {isDrawerOpen && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={toggleDrawer}
          userName={username}
          profileImage={profileImage}
          privateMessageId={privateMessageId}
        />
      )}
    </>
  );
};

export default UserCard;
