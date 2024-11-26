"use client";
import { useState } from "react";
import { toast } from "sonner";

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
} from "@/slices/chatSlice";

interface UserCardProps {
  profileImage: string;
  username: string;
  lastText: string;
  date: Date;
  privateMessageId: string;

  chatSortListNames: string[];
  currentUserUserName: string;
  currentUserProfileImage: string;
}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  username,
  lastText,
  date,
  privateMessageId,
  chatSortListNames,
  currentUserUserName,
  currentUserProfileImage,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

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
  if (lastText.startsWith("https://")) {
    truncatedLastText = "Voice Message 🎙️";
  } else {
    truncatedLastText =
      lastText.length > maxLength
        ? `${lastText.slice(0, maxLength)}...`
        : lastText;
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
    }
    dispatch(
      addUserToAChatSortListThunk({
        currentUserUserName,
        addedUserUserName: username,
        listName: label,
      })
    );
  };

  return (
    <>
      <div className="bg-cardBlueBg/80 hover:bg-cardBlueBorder/20 border border-cardBlueBorder rounded-xl flex items-center gap-1 transition duration-300  p-3  mb-2 cursor-pointer">
        <div
          onClick={toggleDrawer}
          className="basis-[95%] w-full flex justify-between items-center"
        >
          {/* User details */}
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 flex justify-center items-center border border-cardBlueBorder rounded-full">
              <Image
                src={profileImage}
                width={40}
                height={40}
                alt="profile"
                className="rounded-full object-fit"
              />
            </div>
            <div className="max-w-[150px] md:max-w-[300px]">
              <h3 className="text-sm md:text-lg text-textBlue">{username}</h3>
              <p className="text-xs md:text-sm text-brownText">
                {truncatedLastText}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-brownText max-w-[50px]">
              {formattedDate}
            </span>
          </div>
        </div>
        <div className="basis-[5%]">
          <OptionsDropDownMenu
            labels={chatSortListNames}
            actions="Actions"
            dropDownMenuSubtriggerText="Add to List"
            commandInputPlaceholderText="Search a List..."
            commandEmptyText="No Lists Found"
            addToList={handleAddUserToAChatSortList}
            endConnection={handleEndConnection}
          />
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
            currentUserProfileImage={currentUserProfileImage}
          />
        )}
      </div>
    </>
  );
};

export default UserCard;
