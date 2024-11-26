"use client";
import axios from "axios";

// Creating an Axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 120000,
});

// API functions for different actions

// ************************** Chat APIs Starts ************************** //

const registerUser = (registrationData: {
  userName: string;
  password: string;
  imageUrl: string;
}) => {
  return apiClient.post("/api/user/register", registrationData);
};

const checkUsername = (username: string) => {
  return apiClient.get(`/api/user/check-username-unique?userName=${username}`);
};

const loginUser = (loginData: { userName: string; password: string }) => {
  return apiClient.post("/api/user/login", loginData);
};

const logoutUser = () => {
  return apiClient.post("/api/user/logout");
};

const searchUser = ({
  currentUserUserName,
  query,
}: {
  currentUserUserName: string;
  query: string;
}) => {
  return apiClient.get("/api/user/search", {
    params: { currentUserUserName, query },
  });
};

const sendMessageRequest = ({
  senderUsername,
  receiverUsername,
}: {
  senderUsername: string;
  receiverUsername: string;
}) => {
  return apiClient.post(`/api/user/message-request`, {
    senderUsername,
    receiverUsername,
  });
};

const fetchUser = () => {
  return apiClient.get('/api/user/get-user-id', {
    withCredentials: true,
  });
};


const updateProfileImage = ({currentUserUserName, imageUrl}: {currentUserUserName: string; imageUrl: string}) => {
  return apiClient.put(`/api/user/update-profile-image`, { currentUserUserName, imageUrl });
}


const updatePassword = ({ currentUserUserName, currentPassword, newPassword}: { currentUserUserName: string; currentPassword: string; newPassword:string;} ) => {
  return apiClient.put(`/api/user/update-password`, {
    currentUserUserName,
    currentPassword,
    newPassword
  });
}

// ->>>>>>>>>>> Fetching all the connected users with their userNames, profileImages, lastmessages & last message time >>>>>>>>>>>>> //
const fetchConnectedUsersWithData = (currentUserUserName: string) => {
  return apiClient.get(
    `/api/user/get-connected-users/${currentUserUserName}`
  );
};

// ->>>>>>>>>>>>>> json response will come from this api function `fetchConnectedUsersWithData` as following structure
// connectedUsers = [
//   {
//     listName:  type -> string,
//     members: [
//       {
//         //individual members data of this list type
//         userName:  type -> string,
//         profileImage:  type -> string,
//         lastMessage:  type -> string,
//         lastMessageTime:  type -> string,
//         privateMessageId:  type -> string,
//       },
//     ]
//   },
// ]  ->>>>>>>>>>>>>  End  >>>>>>>>>>>>>>>>>>>>>>.





//   >>>>>>>>>>>>>>>>>>>>  Fetching the previous messages of two users ( sender & receiver) >>>>>>>>>>>> //

const fetchPreviousMessagesofAPrivateChat = ({
  currentUserUserName,
  chatWithUserUserName,
}: {
  currentUserUserName: string;
  chatWithUserUserName: string;
}) => {
  return apiClient.get(
    `/api/user/get-previous-messages/${currentUserUserName}/${chatWithUserUserName}`
  );
};

// ->>>>>>>>>>>>>> json response will come from this api function `fetchPreviousMessagesofAPrivateChat` as following structure
// const previousMessages = {
//   "2024/11/5": [
//     {
//       from: type -> string,
//       to:  type -> string,
//       content:  type -> string,
//       isGroupMsg: boolean,
//       senderProfileImage?:  type -> string,
//       groupMsgIdentifier?:  type -> string,
//       privateMsgIdentifier?:  type -> string,
//       createdAt:  type -> Date,
//     },
//   ],
// }


// >>>>>>>>>>>>>>>> Sending a message from a sender to receiver through socket.io >>>>>>>>//

const sendPrivateMessage = ({
  currentUserUserName,
  chatWithUserUserName,
  message,
}: {
  currentUserUserName: string;
  chatWithUserUserName: string;
  message: string;
}) => {
   return apiClient.post(
    "/api/user/send-message",
    {
      sender: currentUserUserName,
      receiver: chatWithUserUserName,
      content: message,
    }
  );
}


// >>>>>>>>>>>>   Sending Voice Message    >>>>>>>>>>>> //
const sendVoiceMessage = ({ formData } : { formData: FormData }) => {
  return apiClient.post(
    "/api/user/send-voice-message",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}


// >>>>>>>>>>>>>> handling users sorting list component >>>>>>>>//

const createSortList = ({currentUserUserName, listName} : { currentUserUserName: string; listName: string}) => {
  return apiClient.post("/api/user/create-user-sorting-list", {
    currentUserUserName,
    listName,
  })
}

const updateSortList = ({currentUserUserName, currentListName,  updatedListName} : { currentUserUserName: string; currentListName: string,  updatedListName: string }) => {
  return apiClient.put("/api/user/update-user-sorting-list", {
    currentUserUserName,
    currentListName,
    updatedListName
  })
}

const deleteSortList = ({currentUserUserName, deleteListName} : { currentUserUserName: string; deleteListName: string }) => {
  return apiClient.delete("/api/user/delete-user-sorting-list", {
    params: {
      currentUserUserName,
      deleteListName
    }
  })
}


// >>>>>>>>>>>>>>> End Connection with a Connected User >>>>>>>>>>>>>> //
const endConnectionWithAnUser = ({currentUserUserName, unfriendUserUserName } : { currentUserUserName: string; unfriendUserUserName : string }) => {
  return apiClient.delete("/api/user/end-connection", {
    params: {
      currentUserUserName,
      unfriendUserUserName
    }
  })
}

// >>>>>>>>>>>>> Adding a User to Chat Sort List >>>>>>>>>>>>>> //
const addToChatSortList = ({currentUserUserName, addedUserUserName, listName} : { currentUserUserName: string; addedUserUserName: string; listName: string }) => {
   return apiClient.post("/api/user/add-user-to-chat-sort-list", {
     currentUserUserName,
     addedUserUserName,
     listName
   })
}

// >>>>>>>>>>>        Chat APIs Ends      >>>>>>>>>>>>>>>>>> ///




//   >>>>>>>>>>>>>>>>  Notification APIs Starts >>>>>>>>>>>>>>> //

const fetchUserNotifications = (username: string) => {
    return apiClient.get(
      `/api/notification/get-user-notifications/${username}`
    );
}

const acceptPrivateMessageRequest = ({currentUserUserName, requestedUserUserName}:
  {
    currentUserUserName: string;
    requestedUserUserName: string;
  }
) => {
   return apiClient.post(
    "/api/user/accept-message-request",
    {
      currentUserUserName,
      requestedUserUserName,
    }
  );
}

const declinePrivateMessageRequest = ({currentUserUserName, requestedUserUserName}:
  {
    currentUserUserName: string;
    requestedUserUserName: string;
  }
) => {
    return apiClient.post(
      "/api/user/decline-private-message-request",
      {
        currentUserUserName,
        requestedUserUserName,
      }
    );
}

const acceptGroupJoinReqeust = ({ requestedUserUserName, groupName}:
  {
    requestedUserUserName: string;
    groupName: string;
  }
) => {
  return apiClient.post(
    "/api/group//accept-group-join-request",
    {
      requestedUserUserName,
      groupName,
    }
  );
}

const declineGroupJoinReqeust = ({ requestedUserUserName, groupName}:
  {
    requestedUserUserName: string;
    groupName: string;
  }
) => {
  return apiClient.post(
    "/api/group/decline-group-join-request",
    {
      requestedUserUserName,
      groupName,
    }
  );
}

const deleteNotification = ({ currentUserUserName, notificationType, notificationIndex}: { currentUserUserName: string; notificationType: string;  notificationIndex: string}) => {
  return apiClient.delete(
    `/api/notification/delete-user-notification/${currentUserUserName}`,
    {
      data: {
        notificationType,
        notificationIndex
      },
    }
  );
}

const isNotificationSeen = ({ currentUserUserName }: { currentUserUserName: string}) => {
  return apiClient.put(
    `/api/notification/seen-notification`,
    {
      currentUserUserName
    }
  );
}


// const isNotificationRead = ({ currentUserUserName, notificationType, notificationIndex}: { currentUserUserName: string; notificationType: string;  notificationIndex: string}) => {
//   return apiClient.put(
//     `/api/notification/read-notification`,
//     {
//       currentUserUserName,
//       notificationType,
//       notificationIndex
//     }
//   );
// }

//   >>>>>>>>>>>>>>>>  Notification APIs Ends >>>>>>>>>>>>>>> //


export {
  registerUser,
  checkUsername,
  loginUser,
  logoutUser,
  searchUser,
  fetchUser,
  updateProfileImage,
  updatePassword,
  sendMessageRequest,
  fetchConnectedUsersWithData,
  fetchPreviousMessagesofAPrivateChat,
  sendPrivateMessage,
  sendVoiceMessage,
  createSortList,
  updateSortList,
  deleteSortList,
  endConnectionWithAnUser,
  addToChatSortList,
  fetchUserNotifications,
  acceptPrivateMessageRequest,
  declinePrivateMessageRequest,
  acceptGroupJoinReqeust,
  declineGroupJoinReqeust,
  deleteNotification,
  //isNotificationRead,
  isNotificationSeen 
};
