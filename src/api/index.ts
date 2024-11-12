"use client";
import axios from "axios";

// Creating an Axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 120000,
});

// API functions for different actions

// ************************** Chat APIs ************************** //

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

export {
  registerUser,
  checkUsername,
  loginUser,
  logoutUser,
  searchUser,
  sendMessageRequest,
  fetchConnectedUsersWithData,
  fetchPreviousMessagesofAPrivateChat,
  sendPrivateMessage,
  createSortList,
  updateSortList,
  deleteSortList
};
