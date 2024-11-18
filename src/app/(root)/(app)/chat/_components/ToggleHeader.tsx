"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ChevronsDown, ChevronsUp, FileX } from "lucide-react";
import CustomChatSortListDialog from "@/components/customComponents/CustomChatSortListDialog";
import { deleteSortList } from "@/api";
import CustomDeleteDialog from "@/components/customComponents/CustomDeleteDialog";

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

  // >>>>>>>>>>>>>>>>>  Delete a User Sorting List >>>>>>>>>>>>> //
  const [listName, setListName] = useState<string>("");
  const [sortListLoader, setSortListLoader] = useState<boolean>(false);
  // creating a new sorting list
  const handleDeleteSortingList = async () => {
    if (!currentUserUserName || !title) return;
    const data = {
      currentUserUserName,
      deleteListName: title,
    };
    try {
      setSortListLoader(true);
      const response = await deleteSortList(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        setListName("");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
        setListName("");
      } else {
        toast.error("Something went wrong. Please try again later.");
        setListName("");
      }
    } finally {
      setSortListLoader(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="bg-colors-custom-orange-thin transition-colors duration-300 hover:bg-colors-custom-orange-thin/80 flex items-center justify-between p-5 cursor-pointer border border-colors-custom-orange-thin rounded-xl"
        onClick={toggleOpen}
      >
        <h2 className="text-md md:text-lg lg:text-xl text-colors-custom-orange-text-3">
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

         
          <div className="">
            {title != "All Connected Users" && (
              <CustomDeleteDialog
                isAlertDialogTriggerContentIsButton={false}
                alertDialogDescription="After you delete this list , it will be permanently removed from your account. This action cannot be undone."
                isAlertDialogTriggerContentIsIconTrash={false}
                onDelete={handleDeleteSortingList}
              />
            )}
          </div>
          <span>
            {isOpen ? (
              <ChevronsUp className="transition duration-600 hover:text-colors-custom-orange/70 text-colors-custom-orange h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <ChevronsDown className="transition duration-600 hover:text-colors-custom-orange/70 text-colors-custom-orange h-5 w-5 md:h-6 md:w-6" />
            )}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="mt-2 transition duration-300">{children}</div>
      )}
    </div>
  );
};

export default ToggleHeader;
