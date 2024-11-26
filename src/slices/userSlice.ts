import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser,  updatePassword, updateProfileImage } from "@/api";
import { handleAxiosError } from "@/helpers/axiosError";
import { toast } from "sonner";
import { handleAxiosErrorWithToastMessage } from "@/helpers/axiosErrorWithToastMessage";

interface UserState {
  userId: string;
  username: string;
  profileImage: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  userId: "",
  username: "",
  profileImage: "",
  status: "idle",
  error: null,
};

// Async thunk to fetch user information
export const fetchUserThunk = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Async thunk to update an user's username
export const updatePasswordThunk = createAsyncThunk(
  "user/updateUsername",
  async (
    data: { 
      currentUserUserName: string; 
      currentPassword: string;
       newPassword: string;
      },
    { rejectWithValue }
  ) => {
    try {
      const response = await updatePassword(data);
      if(response.status === 200) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleAxiosErrorWithToastMessage(error));
      
    }
  }
);

// Async thunk to update an user's Profile Image
export const updateProfileImageThunk = createAsyncThunk(
  "user/updateUserProfileImage",
  async (
    data: { 
      currentUserUserName: string; 
      imageUrl: string;
      },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateProfileImage(data);
      if(response.status === 200) {
        toast.success(response.data.message);
      }
      console.log("response.data.updatedProfileImage: async thunk", response.data.updatedProfileImage)
      return response.data.updatedProfileImage;
    } catch (error: any) {
      return rejectWithValue(handleAxiosErrorWithToastMessage(error));
      
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.userId = "";
      state.username = "";
      state.profileImage = "";
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        state.profileImage = action.payload.profileImage;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
      builder.addCase(updatePasswordThunk.pending, (state) => {
        state.status = "loading";
      })
      builder.addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      builder.addCase(updatePasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      builder.addCase(updateProfileImageThunk.pending, (state) => {
        state.status = "loading";
      })
      builder.addCase(updateProfileImageThunk.fulfilled, (state, action) => {
        console.log("action.payload: ADDCASE", action.payload);
        state.status = "succeeded";
        state.profileImage = action.payload;
        console.log("state.profileImage: ADDCASE", state.profileImage);
      })
      builder.addCase(updateProfileImageThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
