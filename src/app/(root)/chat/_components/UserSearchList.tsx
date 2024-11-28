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
  currentUserProfileImage: string;
  onSendMessageRequest: (receiverUsername: string) => Promise<void>; 
}

const UserSearchList: React.FC<ListProps> = ({
  username,
  avatar,
  isFriend,
  isMessageRequestSent,
  currentUserUserName,
  currentUserProfileImage,
  onSendMessageRequest
}) => {


  return (
    <div className="p-2 md:p-3 bg-cardBlueBg/80 hover:bg-cardBlueBorder/20 border border-cardBlueBorder cursor-pointer rounded-xl min-w-[250px] md:min-w-[300px]">
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
                className="h-auto w-auto rounded-full"
              />
            )}
          </div>
          <div>
            <p className="text-sm md:text-md  text-textBlue">
              {username}
            </p>
          </div>
        </div>
        <div className="">
          {username === currentUserUserName ? (
            <p className="text-xs md:text-md  text-textBlue pr-2">
              You
            </p>
          ) : (
            <>
              {isFriend ? (
                <p className="text-xs md:text-md  text-textBlue pr-2">
                  Connected
                </p>
              ) : (
                <button
                onClick={() => onSendMessageRequest(username)}
                  disabled={isMessageRequestSent}
                  className={`text-xs md:text-sm flex justify-center items-center text-white p-2 border rounded-xl ${isMessageRequestSent ? "bg-gray-500" : "bg-textBlue"}  `}
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



