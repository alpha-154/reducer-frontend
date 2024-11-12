"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ChevronsDown, ChevronsUp, FileX } from "lucide-react";
import CustomDialogList from "@/components/customComponents/CustomDialogList";
import { deleteSortList } from "@/api";

interface ToggleHeaderProps {
  title: string;
  currentUserUserName: string;
  children: React.ReactNode;
}

const ToggleHeader: React.FC<ToggleHeaderProps> = ({ title,currentUserUserName, children }) => {
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
        className="bg-colors-custom-orange-thin flex items-center justify-between p-3 cursor-pointer border border-colors-custom-orange-thin rounded-xl"
        onClick={toggleOpen}
      >
        <h2 className="text-md md:text-lg lg:text-xl text-colors-custom-orange-text-3">
          {title}
        </h2>
        <div className="flex justify-center items-center gap-2">
          { title !== "All Connected Users" && (
               <CustomDialogList
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
         
          <span>
          {isOpen ? (
            <ChevronsUp className="text-colors-custom-orange h-5 w-5 md:h-6 md:w-6" />
          ) : (
            <ChevronsDown className="text-colors-custom-orange h-5 w-5 md:h-6 md:w-6" />
          )}
        </span>
          <button onClick={handleDeleteSortingList}>
            <FileX className="text-colors-custom-orange h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
       
      </div>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default ToggleHeader;
