"use client";

import CustomDeleteDialog from "@/components/customComponents/CustomDeleteDialog";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSocketInstance } from "@/contexts/socketContext";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptPrivateMessageRequestThunk,
  declinePrivateMessageRequestThunk,
  deleteNotificationThunk,
  acceptGroupJoinRequestThunk,
  declineGroupJoinRequestThunk,
  //readNotificationThunk
} from "@/slices/notificationSlice";


interface NotificationProps {
  isSeen: boolean;
  currentUser: string;
  currentUserId: string;
  name: string;
  otherUserId: string;
  profileImage: string;
  date: string;
  groupName?: string;
  message: string;
  type: string; // Notification type
  index: string; // Notification index
}

const Notification: React.FC<NotificationProps> = ({
  isSeen,
  currentUser,
  currentUserId,
  name,
  otherUserId,
  profileImage,
  date,
  groupName,
  message,
  type,
  index,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocketInstance();

  const handlePrivateMessageAcceptRequest = () => {
    dispatch(
      acceptPrivateMessageRequestThunk({
        currentUserUserName: currentUser,
        requestedUserUserName: name,
      })
    ).then(() => {
      socket?.emit("newNotification", {
        recipientUserId : otherUserId,
        payload: `${currentUser} accepted your private message request`,

      });
    });
  };

  const handleDeclinePrivateMessageRequest = () => {
    dispatch(
      declinePrivateMessageRequestThunk({
        currentUserUserName: currentUser,
        requestedUserUserName: name,
      })
    ).then(() => {
      socket?.emit("newNotification", {
        recipientUserId : otherUserId,
        payload: `${currentUser} declined your private message request`,

      });
    });;
  };

  const handleDeleteNotification = () => {
    dispatch(
      deleteNotificationThunk({
        currentUserUserName: currentUser,
        notificationType: type,
        notificationIndex: index,
      })
    );
  };

  const handleAcceptRequestAsJoinGroup = () => {
    if (!groupName) return;
    dispatch(
      acceptGroupJoinRequestThunk({
        requestedUserUserName: name,
        groupName: groupName,
      })
    ).then(() => {
      socket?.emit("newNotification", {
        recipientUserId : currentUserId,
        payload: `${currentUser} accepted your group join request`,

      });
    });;
  };


  const handleDeclineRequestAsJoinGroup = () => {
    if (!groupName) return;
    dispatch(
      declineGroupJoinRequestThunk({
        requestedUserUserName: name,
        groupName: groupName,
      })
    ).then(() => {
      socket?.emit("newNotification", {
        recipientUserId : currentUserId,
        payload: `${currentUser} declined your group join request`,

      });
    });;
  };

 
  return (
    <div className={`${isSeen ? "bg-burntSienna/25 hover:bg-burntSienna/40 border-burntSienna text-darkbrownText" : "bg-red-500/40 hover:bg-red-500/50 border-red-500 text-slate-100"}  flex items-center justify-between max-sm:gap-3  border  rounded-xl p-3 md:p-4 transition duration-300`}>
      <div className="cursor-pointer">
        <Image
          src={profileImage}
          alt="profileImage"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="">
          <p className="text-sm md:text-md">{message}</p>
        </div>

        <div>
          {type.includes("receivedPrivate") && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handlePrivateMessageAcceptRequest}
                className="bg-green-700 hover:bg-green-600 cursor-pointer text-white px-2 py-1 rounded-full text-xs md:text-sm"
              >
                Accept Friend
              </button>
              <button
                onClick={handleDeclinePrivateMessageRequest}
                className="bg-red-700 hover:bg-red-600 cursor-pointer text-white px-2 py-1 rounded-full text-xs md:text-sm"
              >
                Reject
              </button>
            </div>
          )}
          {type.includes("receivedGroup") && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleAcceptRequestAsJoinGroup}
                className="bg-green-700 hover:bg-green-600 cursor-pointer text-white px-2 py-1 rounded-full text-xs md:text-sm"
              >
                Accept join
              </button>
              <button
                onClick={handleDeclineRequestAsJoinGroup}
                className="bg-red-700 hover:bg-red-600 cursor-pointer text-white px-2 py-1 rounded-full text-xs md:text-sm"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between items-start sm:items-center gap-1 md:gap-2">
        <p className="text-xs">{date}</p>
        <CustomDeleteDialog
          isAlertDialogTriggerContentIsButton={false}
          alertDialogDescription="Are you sure you want to delete this notification?"
          isAlertDialogTriggerContentIsIconTrash={true}
          onDelete={handleDeleteNotification}
        />
      </div>
    </div>
  );
};

export default Notification;
