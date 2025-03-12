"use client";
import { useState } from "react";
import { toast } from "sonner";
import userBgImg from "@/assets/userbg.png";
import Drawer from "./Drawer"; // Import the Drawer component
import Image from "next/image";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import useWindowWidth from "@/hooks/useWindowWidth";
import OptionsDropDownMenu from "@/components/customComponents/CustomOptionsDropDown";

import {
  addUserToAChatSortListThunk,
  endConnectionWithAnUserThunk,
  removeUserFromAChatSortListThunk,
} from "@/slices/chatSlice";

interface UserCardProps {
  title: string;
  profileImage: string;
  username: string;
  otherUserId: string;
  lastMessage: string;
  totalUnseenMessages: number;
  date: Date;
  status: "online" | "offline";
  privateMessageId: string;
  chatSortListNames: string[];
  currentUserUserName: string;
  currentUserId: string;
  currentUserProfileImage: string;
}

const UserCard: React.FC<UserCardProps> = ({
  title,
  profileImage,
  username,
  otherUserId,
  lastMessage,
  totalUnseenMessages,
  date,
  status,
  privateMessageId,
  chatSortListNames,
  currentUserUserName,
  currentUserId,
  currentUserProfileImage,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  // Extracting the last message from the lastMessageArray
  // const lastText = lastMessageArray[lastMessageArray.length - 1];

  //Extracting the current window length value by using `useWindowWidth()` hook
  const windowWidth = useWindowWidth();

  // Format the date based on the conditions
  const formattedDate = (() => {
    if (!date) return "";
    const messageDate = dayjs(date);

    const today = dayjs();

    if (messageDate.isSame(today, "day")) {
      return messageDate.format("hh:mm A"); // Same day
    } else if (messageDate.isSame(today, "year")) {
      return messageDate.format("DD/MM"); // Same year but different day
    } else {
      return messageDate.format("DD/MM/YY"); // Different year
    }
  })();

  // Determine max length for lastText based on window width
  const maxLength = windowWidth < 640 ? 25 : windowWidth < 1024 ? 40 : 60;
  let truncatedLastText;
  if (lastMessage?.startsWith("https://")) {
    truncatedLastText = "Voice Message 🎙️";
  } else {
    truncatedLastText =
      lastMessage.length > maxLength
        ? `${lastMessage.slice(0, maxLength)}...`
        : lastMessage; // Truncate lastTex
  }

  // >>>>>>>>>>>>>>>>>  End Connection With a Connected User >>>>>>>>>>>>> //
  const handleEndConnection = async () => {
    console.log("handleEndConnection ", currentUserUserName, username);
    if (!currentUserUserName || !username) {
      toast.error("error");
      return;
    }

    dispatch(
      endConnectionWithAnUserThunk({
        currentUserUserName,
        unfriendUserUserName: username,
      })
    );
  };

  // >>>>>>>>>>>>>>>>>  Add a User To A Chat Sorting List >>>>>>>>>>>>> //

  const handleAddUserToAChatSortList = async (label: string) => {
    if (!currentUserUserName || !username || !label) {
      toast.error("Api endpoints data aren't found");
      return;
    } else if (label === "All Connected Users" || label === title) {
      toast.error("User is already added to this list!");
      return;
    }
    dispatch(
      addUserToAChatSortListThunk({
        currentUserUserName,
        addedUserUserName: username,
        listName: label,
      })
    );
  };

  // >>>>>>>>>>>>>>>>>  Remove a User From A Chat Sorting List >>>>>>>>>>>>> //
  const handleRemoveUserFromAChatSortList = async () => {
    if (!currentUserUserName || !username || !title) {
      toast.error("Api endpoints data aren't found");
      return;
    } else if (title === "All Connected Users") {
      toast.error("User can't be removed from this default list!");
      return;
    }
    dispatch(
      removeUserFromAChatSortListThunk({
        currentUserUserName,
        deletedUserUserName: username,
        listName: title,
      })
    );
  };

  return (
    <>
      <div
        className="relative bg-cardBlueBg/80 hover:bg-cardBlueBorder/20 border border-cardBlueBorder rounded-xl flex items-center gap-1 transition duration-300  p-3  mb-2 cursor-pointer"
        style={{
          backgroundImage: `url(${userBgImg.src})`,
          backgroundSize: "cover", // Ensures the image covers the area
          backgroundPosition: "center", // Centers the image
          backgroundRepeat: "no-repeat", // Prevents tiling
        }}
      >
        <div
          onClick={toggleDrawer}
          className="basis-[95%] w-full flex justify-between items-center"
        >
          {/* Unseen message indicator */}
          {totalUnseenMessages > 0 && (
            <div className="absolute top-0 right-0 flex justify-start items-center gap-2">
              <span className="animate-ping inline-flex h-[10px] w-[10px] rounded-full bg-red-600 opacity-75"></span>
            </div>
          )}

          {/* User details */}
          <div className="flex items-center gap-3 w-full">
            <div
              className={`${
                status === "online" ? "animate-pulse" : ""
              } w-10 h-10 flex justify-center items-center border border-cardBlueBorder ${
                status === "online"
                  ? "border-green-500"
                  : "border-cardBlueBorder"
              } rounded-full`}
            >
              <Image
                src={profileImage}
                width={40}
                height={40}
                alt="profile"
                className="rounded-full object-fit"
              />
            </div>
            <div className="max-w-[150px] md:max-w-[300px]">
              <h3 className="text-sm text-textBlue">{username}</h3>
              <p className="text-xs  text-brownText">{truncatedLastText}</p>
            </div>
          </div>
        </div>
        <div className="basis-[5%]">
          <div className="flex items-center gap-1">
            <span className="text-xs text-brownText max-w-[50px]">
              {formattedDate}
            </span>
            <OptionsDropDownMenu
              labels={chatSortListNames}
              actions="Actions"
              dropDownMenuSubtriggerText="Add to List"
              commandInputPlaceholderText="Search a List..."
              commandEmptyText="No Lists Found"
              addToList={handleAddUserToAChatSortList}
              endConnection={handleEndConnection}
              removeUserFromList={handleRemoveUserFromAChatSortList}
            />
          </div>
        </div>
      </div>

      {/* Drawer component */}
      <div>
        {isDrawerOpen && (
          <Drawer
            isOpen={isDrawerOpen}
            onClose={toggleDrawer}
            userName={username}
            profileImage={profileImage}
            privateMessageId={privateMessageId}
            currentUserUserName={currentUserUserName}
            currentUserId={currentUserId}
            currentUserProfileImage={currentUserProfileImage}
          />
        )}
      </div>
    </>
  );
};

export default UserCard;
