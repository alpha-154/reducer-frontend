// components/List.tsx
"use client";

import Image from "next/image";
import React from "react";
import { AxiosError } from "axios";
import { sendMessageRequest } from "@/api";
import { toast } from "sonner";

interface ListProps {
  username: string;
  avatar: string;
  isFriend: boolean;
  isMessageRequestSent: boolean;
  currentUserUserName: string;
}

const UserSearchList: React.FC<ListProps> = ({
  username,
  avatar,
  isFriend,
  isMessageRequestSent,
  currentUserUserName,
}) => {
  const handleMessageRequest = async () => {
    if (!currentUserUserName) return;

    const data = {
      senderUsername: currentUserUserName,
      receiverUsername: username,
    };
    try {
      const response = await sendMessageRequest(data);

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error("message request not sent!");
      }
    } catch (error) {
      console.log("from error");
      const errorResponse = error as AxiosError<{ message: string }>;
      if (errorResponse.response && errorResponse.response.data) {
        toast.error(errorResponse.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="p-2 md:p-3 bg-colors-custom-orange-thin border border-colors-custom-orange rounded-xl min-w-[250px] md:min-w-[300px]">
      <div className="flex justify-between items-center space-x-2">
        <div className="flex items-center justify-center gap-3">
          <div className="border border-transparent rounded-full w-10 h-8 flex items-center justify-center">
            {avatar === "" ? (
              <p className="text-black font-semibold">
                {username.charAt(0).toUpperCase()}
              </p>
            ) : (
              <Image
                src={avatar}
                alt="avatar"
                width={40}
                height={25}
                className="rounded-full"
              />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-colors-custom-orange">
              {username}
            </p>
          </div>
        </div>
        <div className="">
          {username === currentUserUserName ? (
            <p className="text-lg font-semibold text-colors-custom-orange pr-2">
              You
            </p>
          ) : (
            <>
              {isFriend ? (
                <p className="text-lg font-semibold text-colors-custom-orange pr-2">
                  Connected
                </p>
              ) : (
                <button
                  onClick={handleMessageRequest}
                  disabled={isMessageRequestSent}
                  className={`p-1 px-2 md:px-4 md:p-2 flex justify-center items-center border ${isMessageRequestSent ? "border-gray-400" : "border-colors-custom-orange"} ${isMessageRequestSent ? "bg-gray-400" : "bg-colors-custom-orange"}  rounded-xl text-white`}
                >
                  {isMessageRequestSent ? "Request Sent" : "Send Request"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchList;
