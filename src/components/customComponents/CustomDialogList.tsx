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

const CustomDialogList = ({
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
  const [sortListLoader, setSortListLoader] = useState<boolean>(false);
  // creating a new sorting list
  const handleCreateSortingList = async () => {
    if (!currentUserUserName || !listName) return;
    const data = {
      currentUserUserName,
      listName,
    };
    try {
      setSortListLoader(true);
      const response = await createSortList(data);
      if (response.status === 201) {
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

  // updating a existing sorting list
  const handleUpdateSortingList = async () => {
    if (!currentUserUserName || !listName || !existingListName) return;
    //check if list name is same as existing list name
    if(existingListName.toLowerCase() === listName.toLowerCase()) {
      toast.error("List name cannot be same as existing list name");
      setListName("");
      return;
    }
    const data = {
      currentUserUserName,
      currentListName: existingListName,
      updatedListName: listName,
    };
    try {
      setSortListLoader(true);
      const response = await updateSortList(data);
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
    } finally{
      setSortListLoader(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isMessagePlus ? (
          <div className="flex items-center justify-center bg-colors-custom-orange rounded-xl px-2 ">
            <Button variant="custom">{triggerButtonText} </Button>
            {isMessagePlus && (
              <MessageSquarePlus className="-ml-3 h-5 w-5 text-white cursor-pointer" />
            )}
          </div>
        ) : (
          <Pen className="text-colors-custom-orange h-3 w-3 md:h-4 md:w-4 cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitleText}</DialogTitle>
          <DialogDescription>{dialogDescriptionText}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {labelText}
            </Label>
            <Input
              id="name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="JohnDoe"
              className="col-span-3 placeholder:text-colors-custom-orange-text-2"
            />
          </div>
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

export default CustomDialogList;
