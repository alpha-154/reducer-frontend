"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FileX, Trash2 } from "lucide-react";

interface CustomDeleteDialogProps {
  isAlertDialogTriggerContentIsButton: boolean;
  alertTriggerButtonText?: string;
  alertDialogDescription: string;
  isAlertDialogTriggerContentIsIconTrash?: boolean;
  onDelete: () => void;
}

const CustomDeleteDialog = ({
  isAlertDialogTriggerContentIsButton,
  alertTriggerButtonText,
  alertDialogDescription,
  isAlertDialogTriggerContentIsIconTrash,
  onDelete,
}: CustomDeleteDialogProps) => {

 
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {isAlertDialogTriggerContentIsButton ? (
            <Button
              variant="destructive"
              size="sm"
              className="w-fit border border-red-950 rounded-xl text-xs"
            >
              {alertTriggerButtonText}
            </Button>
          ) : (
            <button
            className="inline-flex items-center justify-center"
            aria-label="Delete"
          >
            {isAlertDialogTriggerContentIsIconTrash ? (
              <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-burntSienna hover:text-burntSiennaDeep cursor-pointer" />
            ) : (
              <FileX className="h-4 w-4 md:h-5 md:w-5 text-burntSienna hover:text-burntSiennaDeep cursor-pointer" />
            )}
          </button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-albasterInnerBg border border-boneInnerBg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-brownText text-left text-sm md:text-md">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-brownText text-left text-xs md:text-sm">
              {alertDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-boneInnerBg/60 hover:bg-boneInnerBg text-brownText text-sm md:text-md font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-800 hover:bg-red-900 text-white text-md font-bold text-sm md:text-md" onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomDeleteDialog;
