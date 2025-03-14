"use client";
import React, { useState } from "react";

import { ChevronsDown, ChevronsUp, FileX } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import CustomChatSortListDialog from "@/components/customComponents/CustomChatSortListDialog";

import CustomDeleteDialog from "@/components/customComponents/CustomDeleteDialog";
import { deleteUsersSortListThunk, updateToggleHeaderNotificationState } from "@/slices/chatSlice";

interface ToggleHeaderProps {
  title: string;
  currentUserUserName: string;
  isNewNotification: boolean;
  children: React.ReactNode;
}

const ToggleHeader: React.FC<ToggleHeaderProps> = ({
  title,
  currentUserUserName,
  isNewNotification,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    dispatch(updateToggleHeaderNotificationState({ listName: title }));
  
  }

  


  // creating a new sorting list
  const handleDeleteSortingList = async () => {
    if (!currentUserUserName || !title) return;

    dispatch(
      deleteUsersSortListThunk({ currentUserUserName, deleteListName: title })
    );
  };

  return (
    <div className="w-full">
      <div
        className="relative bg-burntSienna/15 hover:bg-burntSienna/30 transition duration-300 flex items-center justify-between p-4 md:p-5 cursor-pointer border border-burntSienna rounded-xl"
        onClick={toggleOpen}
      >
         {isNewNotification  && (
                <div className="absolute top-0 right-0 flex justify-start items-center gap-2">
                  <span className="animate-ping inline-flex h-[15px] w-[15px] rounded-full bg-red-600 opacity-75"></span>
                  
                </div>
              )}
        <h2 className="text-md  text-brownText">
          {title}
        </h2>
        <div className="flex justify-center items-center gap-2">
          {title !== "All Connected Users" && (
            <CustomChatSortListDialog
              triggerButtonText="Edit"
              isPen
              existingListName={title}
              dialogTitleText="Edit List Name"
              dialogDescriptionText="Enter a new name for the list"
              labelText="List Name"
              saveButtonText="Save"
              currentUserUserName={currentUserUserName}
            />
          )}

           <div className="mt-2">
           {title != "All Connected Users" && (
              <CustomDeleteDialog
                isAlertDialogTriggerContentIsButton={false}
                alertDialogDescription="After you delete this list , it will be permanently removed from your account."
                isAlertDialogTriggerContentIsIconTrash={false}
                onDelete={handleDeleteSortingList}
              />
            )}
          
           </div>
           
          <span>
            {isOpen ? (
              <ChevronsUp className="transition duration-600 hover:text-burntSiennaDeep text-burntSienna h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <ChevronsDown className="transition duration-600 hover:text-burntSiennaDeep text-burntSienna h-5 w-5 md:h-6 md:w-6" />
            )}
          </span>
        </div>
      </div>
      {isOpen && <div className="max-h-[250px] overflow-y-auto flex flex-col gap-0  transition duration-300 p-2">{children}</div>}
    </div>
  );
};

export default ToggleHeader;
