"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (descriptions: string[]) => void;
}

export function DescriptionModal({
  open,
  onOpenChange,
  onSave,
}: DescriptionModalProps) {
  const [descriptions, setDescriptions] = useState<string[]>([""]);

  const handleAddDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleSave = () => {
    const filteredDescriptions = descriptions.filter(
      (desc) => desc.trim() !== ""
    );
    if (filteredDescriptions.length > 0) {
      onSave(filteredDescriptions);
      setDescriptions([""]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[500px] text-sm bg-albasterInnerBg border border-boneInnerBg rounded-xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-md text-darkbrownText">Add Description</DialogTitle>
          <DialogDescription className="text-xs text-darkbrownText/60">
            Add or edit task description items
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-6 space-y-6">
          

          {descriptions.map((desc, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-burntSienna text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <Textarea
                  value={desc}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder={`Enter description ${index + 1}`}
                  className="text-sm text-darkbrownText placeholder:text-xs placeholder:text-gray-400 bg-albasterbg border border-boneInnerBg rounded-xl"
                />
              </div>
              {index === descriptions.length - 1 && (
                <Button
                  type="button"
                  variant="custom"
                  size="icon"
                  onClick={handleAddDescription}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="custom" className="text-sm" onClick={handleSave}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
