// _components/Notification.tsx
import CustomDeleteDialog from "@/components/customComponents/CustomDeleteDialog";
import axios from "axios";
import Image from "next/image";
import React, { useEffect } from "react";
import { acceptMessageRequest, rejectMessageRequest, acceptGroupJoinReqeust,declineGroupJoinReqeust } from "@/api";


interface NotificationProps {
  currentUser: string;
  name: string;
  profileImage: string;
  date: string;
  groupName?: string;
  message: string;
  type: string; // Notification type
  index: number; // Notification index
  // onDelete: (type: string, index: number) => void; // Callback to remove from parent
}

const Notification: React.FC<NotificationProps> = ({
  currentUser,
  name,
  profileImage,
  date,
  groupName,
  message,
  type,
  index,
}) => {
  const handleAcceptRequest = async () => {
    try {
     // console.log("currentUser", currentUser, "requestedUser", name);
     const data = {
      currentUserUserName: currentUser,
      requestedUserUserName: name
     }
     const response = await acceptMessageRequest(data);
     
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleRejectRequest = async () => {
    try {
      const data = {
        currentUserUserName: currentUser,
        requestedUserUserName: name
       }
      const response = await rejectMessageRequest(data);
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/notification/delete-user-notification/${currentUser}`,
        {
          data: {
            notificationType: type,
            notificationIndex: index,
          },
        }
      );
      if (response.status === 200) {
        alert(response.data.message);
        // onDelete(type, index);
      }
    } catch (error) {
      alert("Failed to delete notification.");
    }
  };

  const handleAcceptRequestAsJoinGroup = async () => {
    if(!groupName) return;
    try {
      const data = {
        requestedUserUserName: name,
        groupName: groupName
      }
      
      const response = await acceptGroupJoinReqeust(data);
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
  };
  const handleDeclineRequestAsJoinGroup = async () => {
    if(!groupName) return;
    try {
      const data = {
        requestedUserUserName: name,
        groupName: groupName
      }
      const response = await declineGroupJoinReqeust(data);
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-between max-sm:gap-3 bg-colors-custom-orange-thin border border-colors-custom-orange rounded-xl p-3 md:p-4">
      <div>
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
          <p className="text-white text-md md:text-lg">{message}</p>
        </div>

        <div>
        {type.includes("receivedPrivate") && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleAcceptRequest}
              className="bg-green-700 hover:bg-green-600 cursor-pointer text-white px-2 py-1 rounded-full text-sm"
            >
              Accept Friend
            </button>
            <button
              onClick={handleRejectRequest}
              className="bg-red-700 hover:bg-red-600 cursor-pointer text-white px-2 py-1 rounded-full text-sm"
            >
              Reject
            </button>
          </div>
        )}
          {type.includes("receivedGroup") && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleAcceptRequestAsJoinGroup}
                className="bg-green-500 text-white px-2 py-1 rounded-full text-sm"
              >
                Accept join
              </button>
              <button
                onClick={handleDeclineRequestAsJoinGroup}
                className="bg-red-500 text-white px-2 py-1 rounded-full text-sm"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between items-start sm:items-center gap-1 md:gap-2">
        <p className="text-colors-custom-orange-text-2 text-xs">{date}</p>
        <CustomDeleteDialog
          isAlertDialogTriggerContentIsButton={false}
          alertDialogDescription="Are you sure you want to delete this notification?"
          isAlertDialogTriggerContentIsIconTrash={true}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Notification;
