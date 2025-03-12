"use client";

import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DescriptionModal } from "./description-modal";
import { DescriptionList } from "./description-list";
import { Task } from "../../types";



interface TaskFormProps {
  userId: string;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export function TaskForm({ userId, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const presetTimes = [
    "8:00 AM - 10:00 AM",
    "9:00 AM - 11:00 AM",
    "10:00 AM - 12:00 AM",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedTime) return;

    //let the user know that the task is being created as soon as the form is submitted
    onSubmit({
      time: selectedTime,
      title,
      description,
      links,
      completed: false
    });
    
    
    // Reset form
    setTitle("");
    setDescription([]);
    setLinks([]);
    setSelectedTime("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-5 bg-boneInnerBg/30 border border-boneInnerBg rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.15)]"
    >
      <div className="space-y-2">
        <Popover open={timeOpen} onOpenChange={setTimeOpen}>
          <PopoverTrigger asChild>
            <Button variant="custom" className="w-full justify-between text-sm">
              {selectedTime || "Select Time"}
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-md p-0 text-sm bg-albasterInnerBg border-boneInnerBg rounded-xl text-darkbrownText">
            <div className="space-y-2 p-2">
              {showCustomTime ? (
                <div className="space-y-2">
                  
                  <div className="flex gap-2 p-2">
                    <Input
                      placeholder="Start time"
                      className="text-darkbrownText text-xs"
                      value={customStartTime}
                      onChange={(e) => setCustomStartTime(e.target.value)}
                    />
                    <Input
                      placeholder="End time"
                      className="text-darkbrownText text-xs"
                      value={customEndTime}
                      onChange={(e) => setCustomEndTime(e.target.value)}
                    />
                    
                  </div>
                  <div className="flex items-center gap-2">
                  <Button
                   
                  className="w-fit text-sm bg-white/10 hover:bg-white/30"
                   onClick={() => setShowCustomTime(false)}
                 >
                   <ArrowLeft className="h-4 w-4" />
                   Back to preset times
                 </Button>
                 <Button
                    variant="custom"
                   className="w-fit flex items-center justify-center gap-2 text-sm"
                     onClick={() => {
                       if (customStartTime && customEndTime) {
                         setSelectedTime(
                           `${customStartTime} - ${customEndTime}`
                         );
                         setCustomStartTime("");
                         setCustomEndTime("");
                         setShowCustomTime(false);
                         setTimeOpen(false);
                       }
                     }}
                   >
                     Add
                   </Button>
                  </div>
                 
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-boneInnerBg hover:text-darkbrownText"
                    onClick={() => setShowCustomTime(true)}
                  >
                    <span className="text-base items-start">Add custom time range</span>
                  </Button>
                  {presetTimes.map((time) => (
                    <Button
                      key={time}
                      variant="ghost"
                      className="w-full text-sm justify-start hover:bg-boneInnerBg hover:text-darkbrownText"
                      onClick={() => {
                        setSelectedTime(time);
                        setTimeOpen(false);
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Enter Task"
          className="text-sm text-darkbrownText"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="custom"
          className="w-full flex justify-between text-sm"
          onClick={() => setDescriptionOpen(true)}
        >
          {description.length > 0
            ? `${description.length} Sub Tasks Added`
            : "Add Sub Tasks(s)"}
          <Plus className="h-4 w-4" />
        </Button>
        {description.length > 0 && (
          <DescriptionList descriptions={description} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Add link(s)"
            className="text-sm text-darkbrownText"
            value={currentLink}
            onChange={(e) => setCurrentLink(e.target.value)}
          />
          <Button
            type="button"
            variant="custom"
            className="text-sm"
            onClick={() => {
              if (currentLink) {
                setLinks([...links, currentLink]);
                setCurrentLink("");
              }
            }}
          >
            Add
          </Button>
        </div>
        {links.map((link, index) => (
          <div key={index} className="text-blue-400 underline">
            {link}
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-center">
        <Button type="submit" variant="custom" className="w-fit text-sm">
          Create Task
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="w-fit text-sm bg-white/10 hover:bg-white/30"
        >
          Cancel
        </Button>
      </div>

      <DescriptionModal
        open={descriptionOpen}
        onOpenChange={setDescriptionOpen}
        onSave={setDescription}
      />
    </form>
  );
}
