import clsx from "clsx";
import { Task } from "../../types";
import { Button } from "@/components/ui/button";
import { DescriptionList } from "./description-list";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export function TaskCard({
  task,
  onComplete,
  onDelete,
  onClick,
}: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "p-5 bg-boneInnerBg/30 hover:bg-boneInnerBg/50 shadow-[0_0_20px_rgba(0,0,0,0.15)] relative border border-albasterInnerBgDarker rounded-xl space-y-4 cursor-pointer",
        "h-fit overflow-hidden",
        task.completed ? "border-green-500/10 bg-green-900/20 hover:bg-green-900/25" : "border-boneInnerBg"
      )}
    >
      <div className="absolute top-4 right-4 text-sm text-darkbrownText">
        {task.time}
      </div>

      <div className="pr-20 mb-4">
        <h3 className="text-md font-styrene-bold text-darkbrownText">{task.title}</h3>
      </div>

      {task.description.length > 0 && (
        <div className="pl-2">
          <DescriptionList descriptions={task.description} maxItems={2} />
        </div>
      )}

      <div className="flex gap-2 justify-end ">
        <Button
          
          className={`text-sm ${task.completed ? "bg-green-700/60 text-whtie hover:bg-green-700/70" : "bg-albasterInnerBg/60 hover:bg-albasterInnerBg/80"} `}
          onClick={(e) => {
            e.stopPropagation();
            onComplete(task._id || "");
          }}
        >
          {task.completed ? "Completed" : "Complete"}
        </Button>
        <Button
          variant="destructive"
          className="text-sm "
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id || "");
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
