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
              className="w-full border border-red-950 rounded-xl text-sm"
            >
              {alertTriggerButtonText}
            </Button>
          ) : (
            <button
            className="inline-flex items-center justify-center"
            aria-label="Delete"
          >
            {isAlertDialogTriggerContentIsIconTrash ? (
              <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-colors-custom-orange hover:text-colors-custom-orange/80 cursor-pointer" />
            ) : (
              <FileX className="h-4 w-4 md:h-5 md:w-5 text-colors-custom-orange hover:text-colors-custom-orange/80 cursor-pointer" />
            )}
          </button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomDeleteDialog;
