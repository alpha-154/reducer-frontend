"use client";
import { TaskForm } from "./_components/task-form";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./_components/task-card";
import { TaskModal } from "./_components/task-modal";
import { useState } from "react";
import { Task } from "../types";
import { Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { createDailyTaskThunk, deleteDailyTaskThunk, completeDailyTaskThunk } from "@/slices/dailyTaskSlice";

const Daily = ({userId}: {userId: string}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status, error }= useSelector((state: RootState) => state.dailyTask);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
  //   const task: Task = {
  //     ...newTask,
  //     _id: Math.random().toString(36).substr(2, 9),
  //     completed: false,
  //   };
  //   setTasks([...tasks, task]);
  //   setShowForm(false);
  // };
  const handleAddTask = ( newTask: Task) => {
    dispatch(createDailyTaskThunk({userId, taskData: newTask}));
    setShowForm(false);
  }


  // const handleCompleteTask = (taskId: string) => {
  //   setTasks(
  //     tasks.map((task) =>
  //       task._id === taskId ? { ...task, completed: !task.completed } : task
  //     )
  //   );
  // };
  
  const handleCompleteTask = (taskId: string) => {
    dispatch(completeDailyTaskThunk({userId, taskId}));
  }

  // const handleDeleteTask = (taskId: string) => {
  //   setTasks(tasks.filter((task) => task._id !== taskId));
  //   setSelectedTask(null);
  // };
  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteDailyTaskThunk({userId, taskId}));
    setSelectedTask(null);
  }

  return (
    <div>
      {/* Add Task Form */}
      <div className="mt-8 p-4">
        {showForm ? (
          <TaskForm
            userId={userId}
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Button
            onClick={() => setShowForm(true)}
            className="w-fit flex items-center justify-center mx-auto bg-boneInnerBg/30 hover:bg-boneInnerBg/50 shadow-[0_0_20px_rgba(0,0,0,0.15)] md:p-4"
          >
            <div className="flex items-center justify-center gap-1 font-styrene-a-thin-trial">
              <Plus className="h-5 w-5 mb-1" />
              <span className="font-styrene-a-thin-trial text-sm md:text-md">
                Add New Task
              </span>
            </div>
          </Button>
        )}
      </div>
      {/* Task Card */}
      <div className="mt-4 space-y-2 p-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>
      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onComplete={handleCompleteTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Daily;
