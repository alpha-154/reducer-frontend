import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  getAllDailyTasks, createDailyTask, deleteDailyTask, completeDailyTask } from "@/api";
import { handleAxiosError } from "@/helpers/axiosError";
import { toast } from "sonner";
import { handleAxiosErrorWithToastMessage } from "@/helpers/axiosErrorWithToastMessage";

interface TaskState {
    _id?: string;
    time: string;
    title: string;
    description: string[];
    links: string[];
    completed: boolean;
}

interface initialStateProps {
    tasks: TaskState[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: initialStateProps = {
    tasks: [],
    status: "idle",
    error: null
};

// Async thunk to fetch user's daily tasks data
export const fetchGetAllDailyTasksThunk = createAsyncThunk(
  "user/fetchGetAllDailyTasks",
  async (userId: string , { rejectWithValue }) => {
    try {
      const response = await getAllDailyTasks(userId);
      return response.data.tasks;
    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Async thunk to create daily task
export const createDailyTaskThunk = createAsyncThunk(
  "user/createDailyTask",
  async (data: { userId: string; taskData: TaskState }, { rejectWithValue }) => {
    try {
      const response = await createDailyTask(data);
      if(response.status === 201){
        toast.success("Task created!");
        return response.data.task;
      }
      
    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Async thunk to delete daily task
export const deleteDailyTaskThunk = createAsyncThunk(
  "user/deleteDailyTask",
  async (data: { userId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await deleteDailyTask(data);
      if(response.status === 200){
        toast.success("Task deleted!");
        return response.data.taskId;
      }

    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);
// Async thunk to mark a daily task to complete
export const completeDailyTaskThunk = createAsyncThunk(
    "user/completeDailyTask",
    async (data: { userId: string; taskId: string }, { rejectWithValue }) => {
      try {
        const response = await completeDailyTask(data);
        if(response.status === 200){
            // Todo: add a confetti here ... 
            toast.success("Task completed!");
            return response.data.taskId;
          }
      } catch (error: any) {
        return rejectWithValue(handleAxiosError(error));
      }
    }
  );

const dailyTaskSlice = createSlice({
  name: "dailyTask",
  initialState,
  reducers: {
   
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllDailyTasksThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGetAllDailyTasksThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("(fetch tasks data)=> ", action.payload);
        state.tasks = action.payload as TaskState[];
        
      })
      .addCase(fetchGetAllDailyTasksThunk.rejected, (state, action) => {
        state.status = "failed";
        console.log("(fetch tasks data)=> rejected ", action.payload);
        state.error = action.payload as string;
      })
      .addCase(createDailyTaskThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDailyTaskThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("(create tasks)=> ", action.payload);
        state.tasks.push(action.payload as TaskState);
        
      })
      .addCase(createDailyTaskThunk.rejected, (state, action) => {
        state.status = "failed";
        console.log("(create tasks)=> rejected ", action.payload);
        state.error = action.payload as string;
      })
      .addCase(deleteDailyTaskThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDailyTaskThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("(delete tasks)=> ", action.payload);
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        
      })
      .addCase(deleteDailyTaskThunk.rejected, (state, action) => {
        state.status = "failed";
        console.log("(delete tasks)=> rejected ", action.payload);
        state.error = action.payload as string;
      })
      .addCase(completeDailyTaskThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("(complete tasks)=> ", action.payload);
        state.tasks.find((task) => task._id === action.payload)!.completed = true;
        
      })
  },
});


export default dailyTaskSlice.reducer;