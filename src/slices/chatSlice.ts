import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchConnectedUsersWithData,
  createSortList,
  updateSortList,
  deleteSortList,
  endConnectionWithAnUser,
  addToChatSortList,
} from "@/api";
import { toast } from "sonner";
import { handleAxiosError } from "@/helpers/axiosError";
import { handleAxiosErrorWithToastMessage } from "@/helpers/axiosErrorWithToastMessage";
import { isArray } from "util";

interface SearchUser {
  userName: string;
  profileImage: string;
  isFriend: boolean;
  isMessageRequestSent: boolean;
}

interface members {
  userName: string;
  profileImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  privateMessageId: string;
}
interface ConnectedUserData {
  listName: string;
  members: members[];
}

interface InitialStateProps {
  searchFindUsers: SearchUser[];
  connectedUsers: ConnectedUserData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InitialStateProps = {
  searchFindUsers: [],
  connectedUsers: [],
  status: "idle",
  error: null,
};

//Async thunk for handling seen notification status
export const fetchConnectedUsersThunk = createAsyncThunk(
  "chat/fetchConnectedUsers",
  async (currentUserUserName: string, { rejectWithValue }) => {
    try {
      const response = await fetchConnectedUsersWithData(currentUserUserName);
      if (response.status === 200) {
        return response.data.connectedUsers;
      }
    } catch (error) {
      rejectWithValue(handleAxiosError(error));
    }
  }
);

// Async thunk for creating a users sort list
export const createUsersSortListThunk = createAsyncThunk(
  "chat/createUsersSortList",
  async (
    data: {
      currentUserUserName: string;
      listName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await createSortList(data);
      if (response.status === 201) {
        toast.success(response.data.message);
        return response.data.createdList;
      }
    } catch (error) {
      rejectWithValue(handleAxiosErrorWithToastMessage(error));
    }
  }
);

// Async thunk for updating a existing users sort list's name
export const updateUsersSortListThunk = createAsyncThunk(
  "chat/updateUsersSortList",
  async (
    data: {
      currentUserUserName: string;
      currentListName: string;
      updatedListName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateSortList(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data.updatedListNameData;
      }
    } catch (error) {
      rejectWithValue(handleAxiosErrorWithToastMessage(error));
    }
  }
);

// Async thunk for deleting a existing users sort list
export const deleteUsersSortListThunk = createAsyncThunk(
  "chat/deleteUsersSortList",
  async (
    data: {
      currentUserUserName: string;
      deleteListName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await deleteSortList(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data.deletedListName;
      }
    } catch (error) {
      rejectWithValue(handleAxiosErrorWithToastMessage(error));
    }
  }
);

// Async thunk for end connection with a connected user
export const endConnectionWithAnUserThunk = createAsyncThunk(
  "chat/endConnectionWithAnUser",
  async (
    data: {
      currentUserUserName: string;
      unfriendUserUserName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await endConnectionWithAnUser(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data.unfriendedUserUserName;
      }
    } catch (error) {
      rejectWithValue(handleAxiosErrorWithToastMessage(error));
    }
  }
);

// Async thunk for end connection with a connected user
export const addUserToAChatSortListThunk = createAsyncThunk(
  "chat/addUserToAChatSortList",
  async (
    data: {
      currentUserUserName: string;
      addedUserUserName: string;
      listName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToChatSortList(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data.addedUserListData;
      }
    } catch (error) {
      rejectWithValue(handleAxiosErrorWithToastMessage(error));
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConnectedUsersThunk.pending, (state) => {
      state.status = "loading";
    })
    builder.addCase(fetchConnectedUsersThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connectedUsers = Array.isArray(action.payload) ? action.payload : [];
      // state.connectedUsers = action.payload;
    });
    builder.addCase(fetchConnectedUsersThunk.rejected, (state, action) => {
      console.error("Fetch connected users failed:", action.payload); // Debugging
      state.status = "failed";
      state.error = action.payload as string;
    })
    builder.addCase(createUsersSortListThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connectedUsers.push({
        listName: action.payload.listName,
        members: [],
      });
    });
    builder.addCase(updateUsersSortListThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connectedUsers = state.connectedUsers.map((list) => {
        if (list.listName === action.payload.currentListName) {
          list.listName = action.payload.updatedListName;
        }
        return list;
      });
    });
    builder.addCase(deleteUsersSortListThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connectedUsers = state.connectedUsers.filter(
        (eachList) => eachList.listName !== action.payload
      );
    });
    builder.addCase(endConnectionWithAnUserThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connectedUsers = state.connectedUsers.map((eachList) => ({
        listName: eachList.listName,
        members: eachList.members.filter(
          (member) => member.userName !== action.payload
        ),
      }));
    });
    builder.addCase(addUserToAChatSortListThunk.fulfilled, (state, action) => {
      state.status = "succeeded";

      const { userName } = action.payload;

      // Locate the user document in the connectedUsers
      let userDocument: members | undefined;
      let previousListName = "All Connected Users";

      state.connectedUsers.forEach((list) => {
        const foundUserIndex = list.members.findIndex(
          (member) => member.userName === userName
        );
        if (foundUserIndex !== -1) {
          if (list.listName !== "All Connected Users") {
            previousListName = list.listName;
          }
          userDocument = list.members[foundUserIndex];
          if (list.listName !== "All Connected Users") {
            list.members.splice(foundUserIndex, 1); // Remove from non-"All Connected Users" list
          }
        }
      });

      // Push the user to the selected chat sort list
      const selectedList = state.connectedUsers.find(
        (list) => list.listName === action.payload.listName
      );

      if (selectedList && userDocument) {
        selectedList.members.push(userDocument);
      }
    });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
