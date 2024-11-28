"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { MessageSquarePlus, Pen } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { createUsersSortListThunk, updateUsersSortListThunk } from "@/slices/chatSlice";
import { createSortList, updateSortList } from "@/api";

interface CustomDialogProps {
  triggerButtonText: string;
  // isMessagePlus icon means creating a new sorting list
  isMessagePlus?: boolean;
  // update type properties starts
  // isPen icon means updating a existing sorting list
  isPen?: boolean;
  existingListName?: string;
  // end of update type properties
  dialogTitleText: string;
  dialogDescriptionText: string;
  labelText: string;
  saveButtonText: string;
  currentUserUserName: string;
}

const CustomChatSortListDialog = ({
  triggerButtonText,
  isMessagePlus,
  isPen,
  existingListName,
  dialogTitleText,
  dialogDescriptionText,
  labelText,
  saveButtonText,
  currentUserUserName,
}: CustomDialogProps) => {
  //  >>>>>>>>>>>>>>>> Handling Users Sorting List Components  >>>>>>>>>>>>//

  const [listName, setListName] = useState<string>("");
 
  const dispatch = useDispatch<AppDispatch>();
  // creating a new sorting list
  const handleCreateSortingList = () => {
    if (!currentUserUserName || !listName) return;
    dispatch(createUsersSortListThunk({ currentUserUserName, listName }));
  };

  // updating a existing sorting list
  const handleUpdateSortingList = async () => {
    if (!currentUserUserName || !listName || !existingListName) return;
    //check if list name is same as existing list name
    if(existingListName.toLowerCase() === listName.toLowerCase()) {
      toast.error("List name cannot be same as existing list name");
      setListName("");
      return;
    }
   
    dispatch(updateUsersSortListThunk({currentUserUserName, currentListName: existingListName, updatedListName: listName}));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isMessagePlus ? (
          <div className="flex items-center justify-center bg-burntSienna rounded-xl px-2 ">
            <Button variant="custom" className="text-sm md:text-md font-styrene-a-thin-trial">{triggerButtonText} </Button>
            {isMessagePlus && (
              <MessageSquarePlus className="-ml-3 h-5 w-5 text-white cursor-pointer" />
            )}
          </div>
        ) : (
          <Pen className="text-colors-custom-orange h-4 w-4 md:h-5 md:w-5 cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-albasterInnerBg border border-boneInnerBg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-left text-brownText text-md">{dialogTitleText}</DialogTitle>
          <DialogDescription className="text-left text-brownText text-md">{dialogDescriptionText}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          
            
            <Input
              id="name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="JohnDoe"
              className="col-span-3 placeholder:text-burntSienna"
            />
          
        </div>
        <DialogFooter>
          <DialogClose asChild>
            {isMessagePlus ? (
              <Button
                onClick={handleCreateSortingList}
                variant="custom"
                type="submit"
              >
                {saveButtonText}
              </Button>
            ) : (
              <Button
                onClick={handleUpdateSortingList}
                variant="custom"
                type="submit"
              >
                {saveButtonText}
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomChatSortListDialog;
