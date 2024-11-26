"use client";
import React, { useState } from "react";

import { ChevronsDown, ChevronsUp, FileX } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import CustomChatSortListDialog from "@/components/customComponents/CustomChatSortListDialog";

import CustomDeleteDialog from "@/components/customComponents/CustomDeleteDialog";
import { deleteUsersSortListThunk } from "@/slices/chatSlice";

interface ToggleHeaderProps {
  title: string;
  currentUserUserName: string;

  children: React.ReactNode;
}

const ToggleHeader: React.FC<ToggleHeaderProps> = ({
  title,
  currentUserUserName,

  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const dispatch = useDispatch<AppDispatch>();

  // >>>>>>>>>>>>>>>>>  Delete a User Sorting List >>>>>>>>>>>>> //
  const [listName, setListName] = useState<string>("");
  const [sortListLoader, setSortListLoader] = useState<boolean>(false);
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
        className="bg-burntSienna/15 hover:bg-burntSienna/30 transition duration-300 flex items-center justify-between p-4 md:p-5 cursor-pointer border border-burntSienna rounded-xl"
        onClick={toggleOpen}
      >
        <h2 className="text-md md:text-lg text-brownText">
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
      {isOpen && <div className="mt-2 transition duration-300">{children}</div>}
    </div>
  );
};

export default ToggleHeader;
