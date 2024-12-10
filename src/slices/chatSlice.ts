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

interface SearchUser {
  userId: string;
  userName: string;
  profileImage: string;
  isFriend: boolean;
  isMessageRequestSent: boolean;
}

interface members {
  userId: string;
  userName: string;
  profileImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  totalUnseenMessages: number;
  privateMessageId: string;
  status: "online" | "offline";
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
  reducers: {
    // This reducer is handling connected users online/offline status
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      state.connectedUsers.forEach((list) => {
        list.members.forEach((member) => {
          if (member.userId === userId) {
            member.status = status; // Update status
          }
        });
      });
    },
    // This reducer is handling update connected users card with their upcoming messages
    // when this current user is not connected to the associated private chat room
    updateUserCardForRealTimeMsg: (state, action) => {
      console.log(
        "action.payload: (updateUserCardForRealTimeMsg)",
        action.payload
      );
      const { from, content, createdAt } = action.payload;

      state.connectedUsers.forEach((list) => {
        const userIndex = list.members.findIndex(
          (member) => member.userId === from
        );

        if (userIndex !== -1) {
          const currentUser = list.members[userIndex];

          // Update the user's message data
          currentUser.lastMessage = content;
          currentUser.lastMessageTime = createdAt;
          console.log(
            "currentUser.totalUnseenMessages -> updateUserCardForRealTimeMsg",
            currentUser.totalUnseenMessages
          );
          currentUser.totalUnseenMessages = currentUser.totalUnseenMessages + 1;

          // Move the user to the top of the list
          if (list.members[0].userId !== from) {
            list.members.splice(userIndex, 1); // Remove the user
            list.members.unshift(currentUser); // Add to the top
          }
        }
      });
    },
    // This reducer update the totalUnseenMessages field for a specific user
    // as soon as the chat drawer is opened
    updateUnseenMessages: (state, action) => {
      state.connectedUsers.forEach((list) => {
        list.members.forEach((member) => {
          if (member.userName === action.payload.userName) {
            member.totalUnseenMessages = 0;
          }
        });
      });
    },
  // this reducer updates the last message after the user close the chat drawer
    updateLastMessage: (state, action) => {
      console.log("action.payload -> updateLastMessage reducer: ", action.payload);
      state.connectedUsers.forEach((list) => {
        list.members.forEach((member) => {
          if (member.userName === action.payload.username) {
            member.lastMessage = action.payload.lastMessage;
            member.lastMessageTime = action.payload.lastMessageTime;
          }
        });
      });
      
     
   }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConnectedUsersThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchConnectedUsersThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connectedUsers = Array.isArray(action.payload)
        ? action.payload
        : [];
    });
    builder.addCase(fetchConnectedUsersThunk.rejected, (state, action) => {
      console.error("Fetch connected users failed:", action.payload); // Debugging
      state.status = "failed";
      state.error = action.payload as string;
    });
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

export const {
  updateUserStatus,
  updateUserCardForRealTimeMsg,
  updateUnseenMessages,
  updateLastMessage
} = chatSlice.actions;

export default chatSlice.reducer;

// import { NextResponse , NextRequest} from "next/server";
// import { checkAuthentication } from "./actions/checkAuthentication";

// export function middleware(request: NextRequest) {
//   console.log("middleware function is called");
//   const path = request.nextUrl.pathname;
//  console.log("middleware -> path:", path);

//   const authenticationRoute = ["/register", "/login",];

//   const landingPage = "/";

//   // Debug cookies
//  // console.log("All Cookies:", request.cookies);
//   //console.log("Token:", request.cookies.get("accessToken")?.value);

//  // const token = request.cookies.get("accessToken")?.value || null;
//  const token = checkAuthentication(request);

//   console.log("middleware -> token:", token);

//   // If the user is authenticated and tries to access auth pages, redirect them to the dashboard
//   if (authenticationRoute.includes(path) && token) {
//     console.log("path: ", path, "token", token);
//     return NextResponse.redirect(new URL("/chat", request.nextUrl));
//   }

//   //If the user is already logged in the app & tries to access the
//   //landing page then user should redirect to `/chat` field since we're making it default
//   if(path === landingPage && token){
//     return NextResponse.redirect(new URL("/chat", request.nextUrl));
//   }

//   const privateRoutes = [

//     "/mail",
//     "/group",
//     "/chat",
//     "/notification",
//    ];

//   // If the user tries to access private routes without authentication, redirect to sign-in
//   if (privateRoutes.includes(path) && !token) {
//     // const signInUrl = new URL("/login", request.nextUrl);
//     // signInUrl.searchParams.set("redirect", path); // Pass the original path as a query parameter
//     console.log("redirect path")
//     return NextResponse.redirect(new URL("/login", request.nextUrl));

//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/",
//     "/register",
//     "/login",
//     "/mail",
//     "/group",
//     "/chat",
//     "/notification",
//   ],
// };
