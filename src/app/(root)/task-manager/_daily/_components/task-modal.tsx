"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "../../types";
import { Button } from "@/components/ui/button";
import { DescriptionList } from "./description-list";

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskModal({
  task,
  open,
  onOpenChange,
  onComplete,
  onDelete,
}: TaskModalProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg lg:max-w-2xl bg-albasterInnerBg text-darkbrownText border border-boneInnerBg rounded-xl">
        <DialogHeader>
          <div className="w-full text-right text-sm text-darkbrownText/50 mt-5 mb-1">
            {task.time}
          </div>
          <DialogTitle className="text-lg font-styrene-bold mb-6">
            {task.title}
          </DialogTitle>
          <DialogDescription>
            Task details and management options
          </DialogDescription>
        </DialogHeader>

        {task.description.length > 0 && (
          <div className="mt-4 pl-2">
            <DescriptionList descriptions={task.description} />
          </div>
        )}

        {task.links.length > 0 && (
          <div className="mt-6 pl-2">
            <h3 className="text-lg font-semibold mb-2">Links:</h3>
            <div className="space-y-1 pl-[4.5rem]">
              {task.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-400 hover:underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-6">
          <Button
            className="text-sm bg-albasterInnerBg/60 hover:bg-albasterInnerBg/80"
            variant="default"
            onClick={() => onComplete(task.id)}
          >
            {task.completed ? "Completed" : "Complete"}
          </Button>
          <Button variant="destructive" className="text-sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
