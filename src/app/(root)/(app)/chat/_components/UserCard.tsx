// UserCard.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Drawer from "./Drawer"; // Import the Drawer component
import Image from "next/image";
import dayjs from "dayjs";
import useWindowWidth from "@/hooks/useWindowWidth";
import { EllipsisVertical } from "lucide-react";
import OptionsDropDownMenu from "@/components/customComponents/CustomOptionsDropDown";
import { addToChatSortList, endConnectionWithAnUser } from "@/api";

interface UserCardProps {
  profileImage: string;
  username: string;
  lastText: string;
  date: Date;
  privateMessageId: string;

  chatSortListNames: string[];
  currentUserUserName: string;
}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  username,
  lastText,
  date,
  privateMessageId,
  chatSortListNames,
  currentUserUserName,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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
      return messageDate.format("DD/MM hh:mm A"); // Same year but different day
    } else {
      return messageDate.format("DD/MM/YY"); // Different year
    }
  })();

  // Determine max length for lastText based on window width
  const maxLength = windowWidth < 640 ? 25 : windowWidth < 1024 ? 40 : 60;
  let truncatedLastText;
  if(lastText.startsWith("https://")){
    truncatedLastText = "Voice Message 🎙️";
  }
  else{
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
    const data = {
      currentUserUserName,
      unfriendUserUserName: username,
    };
    try {
      const response = await endConnectionWithAnUser(data);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log("error", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  // >>>>>>>>>>>>>>>>>  Add a User To A Chat Sorting List >>>>>>>>>>>>> //

  const handleAddUserToChatSortList = async (label: string) => {
    if (!currentUserUserName || !username || !label) {
      toast.error("Api endpoints data aren't found");
      return;
    }

    const data = {
      currentUserUserName,
      addedUserUserName: username,
      listName: label,
    };
    try {
      const response = await addToChatSortList(data);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <div
        
        className="bg-colors-custom-orange-thin flex items-center gap-1 transition-colors duration-300 hover:bg-colors-custom-orange-thin/80  p-3 border border-colors-custom-orange rounded-xl mb-2 cursor-pointer"
      >
        <div onClick={toggleDrawer} className="basis-[95%] w-full flex justify-between items-center">
          {/* User details */}
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 flex justify-center items-center border border-colors-custom-orange rounded-full">
              <Image
                src={profileImage}
                width={40}
                height={40}
                alt="profile"
                className="rounded-full object-fit"
              />
            </div>
            <div className="max-w-[150px] md:max-w-[300px]">
              <h3 className="text-md md:text-lg font-semibold">{username}</h3>
              <p className="text-sm md:text-md text-gray-500">
                {truncatedLastText}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-sm md:text-md text-gray-500 max-w-[50px]">
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
              addToList={handleAddUserToChatSortList}
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
          />
        )}
      </div>
    </>
  );
};

export default UserCard;
