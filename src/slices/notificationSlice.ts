import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import {
  fetchUserNotifications,
  acceptPrivateMessageRequest,
  declinePrivateMessageRequest,
  acceptGroupJoinReqeust,
  declineGroupJoinReqeust,
  deleteNotification,
  isNotificationSeen,
  //isNotificationRead 
} from "@/api";
import { toast } from "sonner";

// Notification types
interface NotificationBase {
  id: string;
  name: string;
  image: string;
  date: string;
  index: string;
  isSeen: boolean;
  // isRead: boolean;
}

interface GroupNotification extends NotificationBase {
  groupName?: string;
}

interface Notification {
  acceptedSentPrivateMessageRequest: NotificationBase[];
  declinedSentPrivateMessageRequest: NotificationBase[];
  acceptedSentGroupMessageRequest: GroupNotification[];
  declinedSentGroupMessageRequest: GroupNotification[];
  receivedPrivateMessageRequest: NotificationBase[];
  receivedGroupJoinRequestAsAdmin: GroupNotification[];
}

type INotification = Notification;

interface InitialStateProps {
  notifications: INotification;
  unSeenNotifications: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InitialStateProps = {
  notifications: {
    acceptedSentPrivateMessageRequest: [],
    declinedSentPrivateMessageRequest: [],
    acceptedSentGroupMessageRequest: [],
    declinedSentGroupMessageRequest: [],
    receivedPrivateMessageRequest: [],
    receivedGroupJoinRequestAsAdmin: [],
  },
  unSeenNotifications: 0,
  status: "idle",
  error: null,
};

//Async thunk for fetching user notifications
export const fetchNotificationsThunk = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async (username: string, { rejectWithValue }) => {
    console.log("fetchUserNotification called");
    try {
      const response = await fetchUserNotifications(username);

      if (response.status === 200) {
        //console.log("notifications -> slice ", response.data.notifications);
        return response.data.notifications;
      }
    } catch (error) {
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

    }
  }
);

//Async thunk for accepting message request
export const acceptPrivateMessageRequestThunk = createAsyncThunk(
  "notifications/acceptMessageRequest",
  async (
    data: {
      currentUserUserName: string;
      requestedUserUserName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await acceptPrivateMessageRequest(data);
      if (response.status === 200) {
        toast.success(response.data.message);
       
        return response.data.requestedUserUserName;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      }
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

    }
  }
);

//Async thunk for rejecting message request
export const declinePrivateMessageRequestThunk = createAsyncThunk(
  "notifications/rejectMessageRequest",
  async (
    data: {
      currentUserUserName: string;
      requestedUserUserName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await declinePrivateMessageRequest(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data.requestedUserUserName;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      }
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

    }
  }
);

//Async thunk for deleting a notification
export const deleteNotificationThunk = createAsyncThunk(
  "notifications/deleteNotification",
  async (
    data: {
      currentUserUserName: string;
      notificationType: string;
      notificationIndex: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await deleteNotification(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        const filteringData = {
          filterNotificationType: response.data.notificationType,
          filterNotificationIndex: response.data.notificationIndex,
        };

        return filteringData;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      }
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

    }
  }
);


//Async thunk for accepting group join request
export const acceptGroupJoinRequestThunk = createAsyncThunk(
  "notifications/acceptGroupJoinRequest",
  async (
    data: {
      requestedUserUserName: string;
      groupName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await acceptGroupJoinReqeust(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        //Here, instead of sending the same data (which was sent in the request) from the backend
        // using these data in the action.payload to update the UI
        const filteringData = {
          requestedUserUserName : data.requestedUserUserName,
          groupName : data.groupName
        }
        return filteringData;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      }
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

    }
  }
);


//Async thunk for rejecting group join request
export const declineGroupJoinRequestThunk = createAsyncThunk(
  "notifications/declineGroupJoinRequest",
  async (
    data: {
      requestedUserUserName: string;
      groupName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await declineGroupJoinReqeust(data);
      //improvement needed here for status calls other than 200 
      if (response.status === 200) {
        toast.success(response.data.message);
        //Here, instead of sending the same data (which was sent in the request) from the backend
        // using these data in the action.payload to update the UI
        const filteringData = {
          requestedUserUserName : data.requestedUserUserName,
          groupName : data.groupName
        }
        return filteringData;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

    }
  }
);    

//Async thunk for handling seen notification status
export const seenNotificationThunk = createAsyncThunk(
  "notifications/seenNotification",
  async ( data: {
    currentUserUserName: string;
  }, { rejectWithValue }) => {
    console.log("username in seenNotificationThunk: ", data.currentUserUserName)
    try {
      const response = await isNotificationSeen(data);
      if (response.status === 200) {
        return response.data.updatedNotifications;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      }
      return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred"); 

    }
  }
)



// Async thunk for handling read notification status
// export const readNotificationThunk = createAsyncThunk(
//   "notifications/readNotification",
//   async ( data: {
//     currentUserUserName: string;
//     notificationType: string;
//     notificationIndex: string;
//   }, { rejectWithValue }) => {
//     try {
//       const response = await isNotificationRead(data);
//       if (response.status === 200) {
//         return response.data;
//       }
//     } catch (error) {
//       const err = error as AxiosError<{ message: string }>;
//       if (err.response && err.response.data) {
//         toast.error(
//           err.response.data.message ||
//             "Something went wrong. Please try again later."
//         );
//       }
//       return rejectWithValue(error instanceof AxiosError ? error.response?.data?.message : "An unexpected error occurred");

//     }
//   }
// )


const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updateUnseenNotifications: (state, action) => {
      console.log("action.payload -> updateUnseenNotification reducer: ", action.payload);
      if(action.payload.allSeen){
        state.unSeenNotifications = 0;
      }
      else if(action.payload.addOne){
        state.unSeenNotifications += 1;
      } 
      //console.log("unSeenNotifications -> slice ", state.unSeenNotifications);
    },
    clearNotification: (state) => {
      state.notifications = {
        acceptedSentPrivateMessageRequest: [],
        declinedSentPrivateMessageRequest: [],
        acceptedSentGroupMessageRequest: [],
        declinedSentGroupMessageRequest: [],
        receivedPrivateMessageRequest: [],
        receivedGroupJoinRequestAsAdmin: [],
      };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handling success and failure of async thunks
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        //console.log("notifications -> slice payload ", action.payload);
        state.status = "succeeded";
        state.notifications = action.payload;
        // counting the total unseen notifications
        if(state.notifications){
            let totalUnseenNotifications: number = 0;
            Object.entries(state.notifications).forEach(([notificationTypeString, notificationTypeArray]) => {
                notificationTypeArray.forEach((notification) => {
                     if(!notification.isSeen){
                        totalUnseenNotifications += 1;
                        
                     }                  
                })
            })

            state.unSeenNotifications = totalUnseenNotifications;
            //console.log("totalUnSeenNotifications: ", totalUnseenNotifications);
        }else {
          state.unSeenNotifications = 0;
        }
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch notifications";
      })
      .addCase(seenNotificationThunk.fulfilled, (state, action) => {
        console.log("action payload : seenNotificationThunk ", action.payload);
      })
      // .addCase( readNotificationThunk.fulfilled, (state, action) => {
      //   console.log("action payload :  readNotificationThunkNotificationThunk ", action.payload);
      //   const { notificationType, notificationIndex } = action.payload;
       
      //   state.notifications[notificationType as keyof typeof state.notifications].forEach( (eachNotification) => {
      //       if(eachNotification.index === notificationIndex){
      //         eachNotification.isRead = true;
      //       }
      //   })
      // })
      .addCase(acceptPrivateMessageRequestThunk.fulfilled, (state, action) => {
        //console.log("action payload : acceptPrivateMessageRequestThunk ", action.payload);
        state.notifications.receivedPrivateMessageRequest =
          state.notifications.receivedPrivateMessageRequest.filter(
            (request) => request.name !== action.payload
          );
        state.unSeenNotifications -= 1;
      })
      .addCase(declinePrivateMessageRequestThunk.fulfilled, (state, action) => {
        //console.log("action payload : declinePrivateMessageRequestThunk ", action.payload);
        state.notifications.receivedPrivateMessageRequest =
          state.notifications.receivedPrivateMessageRequest.filter(
            (request) => request.name !== action.payload
          );
          state.unSeenNotifications -= 1;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
       // console.log("action payload : deleteNotificationThunk ", action.payload);
        if (action.payload) {
          const { filterNotificationType, filterNotificationIndex } =
            action.payload;
            state.notifications[
              filterNotificationType as keyof typeof state.notifications
            ] = state.notifications[
              filterNotificationType as keyof typeof state.notifications
            ].filter(( eachNotification) => eachNotification.index !== filterNotificationIndex);
            
            //console.log("deleted states ", state.notifications[filterNotificationType as keyof typeof state.notifications]);
        }
        state.unSeenNotifications -= 1;
       
      })
      .addCase(acceptGroupJoinRequestThunk.fulfilled, (state, action) => {
       // console.log("action payload : acceptGroupJoinRequestThunk ", action.payload);
        if(action.payload){
           const { requestedUserUserName, groupName } = action.payload;
           state.notifications.receivedGroupJoinRequestAsAdmin = state.notifications.receivedGroupJoinRequestAsAdmin.filter( (req) => req.name !== requestedUserUserName && req.groupName !== groupName);
        }
        state.unSeenNotifications -= 1;
        
      })
      .addCase(declineGroupJoinRequestThunk.fulfilled, (state, action) => {
       // console.log("action payload : declineGroupJoinRequestThunk ", action.payload);
        if(action.payload){
          const { requestedUserUserName, groupName } = action.payload;
          state.notifications.receivedGroupJoinRequestAsAdmin = state.notifications.receivedGroupJoinRequestAsAdmin.filter( (req) => req.name !== requestedUserUserName && req.groupName !== groupName);
       }
       state.unSeenNotifications -= 1;
       
      })
  },
});

export const { clearNotification , updateUnseenNotifications} = notificationSlice.actions;

export default notificationSlice.reducer;
