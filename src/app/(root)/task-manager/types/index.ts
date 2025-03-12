export interface Task {
  _id?: string;
  time: string;
  title: string;
  description: string[];
  links: string[];
  completed: boolean;
}

export type TimeFrame = "daily" | "weekly" | "monthly";
