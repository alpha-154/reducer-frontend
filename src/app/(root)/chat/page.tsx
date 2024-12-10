"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import ToggleHeader from "./_components/ToggleHeader";
import UserCard from "./_components/UserCard";
import { BellDot } from "lucide-react";
import Link from "next/link";
import CustomChatSortListDialog from "@/components/customComponents/CustomChatSortListDialog";
import CustomSheet from "@/components/customComponents/CustomSheet";
import debounce from "lodash.debounce";
import { searchUser, sendMessageRequest } from "@/api";
import UserSearchList from "./_components/UserSearchList";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "@/slices/userSlice";
import { fetchNotificationsThunk } from "@/slices/notificationSlice";
import {
  fetchConnectedUsersThunk,
  updateUserStatus,
  updateUserCardForRealTimeMsg,
} from "@/slices/chatSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { AxiosError } from "axios";
import { toast } from "sonner";

import CustomSkeleton from "@/components/customComponents/CustomSkeleton";
import { useSocketInstance } from "@/contexts/socketContext";

interface SearchUser {
  userId: string;
  userName: string;
  profileImage: string;
  isFriend: boolean;
  isMessageRequestSent: boolean;
}

const Chat = () => {
  // >>>>>>>>>>>>>>>>>> Initializing States >>>>>>>>>>>>>>>>>> //
  const [query, setQuery] = useState<string>("");
  const [searchFindUsers, setSearchFindUsers] = useState<SearchUser[]>([]);
  const [fetchSearcedUserLoading, setFetchSearcedUserLoading] =
    useState<boolean>(false);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const { connectedUsers, status, error } = useSelector(
    (state: RootState) => state.chat
  );
  const socket = useSocketInstance();

  if (process.env.NODE_ENV === "development") {
    console.log("connected Users", connectedUsers);
  }

  //  >>>>>>>>>>>>>>>>>  Accessing The Current LoggedIn User's Username >>>>>>>>>>>>> //
  const dispatch = useDispatch<AppDispatch>();
  const {
    userId: currentUserId,
    username: currentUserUserName,
    profileImage: currentUserProfileImage,
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  // >>>> fetching the notification as soon as currentUserUserName is available >>> //
  useEffect(() => {
    if (currentUserUserName) {
      dispatch(fetchNotificationsThunk(currentUserUserName));
    }
  }, [currentUserUserName, dispatch]);

  // >>>>>>>>>>>>>>>> Searching Users on the Search bar >>>>>>>>>>>>>> //

  // Debounced search function
  const fetchUsers = debounce(async (query: string) => {
    if (!currentUserUserName) return;
    if (query.trim() === "") {
      setSearchFindUsers([]);
      setFetchSearcedUserLoading(false);
      return;
    }
    const data = {
      currentUserUserName,
      query,
    };
    try {
      setFetchSearcedUserLoading(true); // Start loading when search begins
      const response = await searchUser(data);
      if (process.env.NODE_ENV === "development")
        console.log("searched user data", response.data.users);
      setSearchFindUsers(response.data.users);
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Error fetching users:", error);
    } finally {
      setFetchSearcedUserLoading(false); // End loading when search completes
    }
  }, 300);

  // Effect to handle input change
  useEffect(() => {
    fetchUsers(query);
  }, [query]);

  // Cancel debounce on component unmount to avoid potential memory leaks
  useEffect(() => {
    return () => fetchUsers.cancel();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    setSearchClicked(true);
    fetchUsers(query);
  };

  // Update this function inside the Chat component
  const handleSendPrivateMessageRequest = async ({
    receiverUsername,
    receiverUserId,
  }: {
    receiverUsername: string;
    receiverUserId: string;
  }) => {
    const data = {
      senderUsername: currentUserUserName,
      receiverUsername,
    };
    try {
      const response = await sendMessageRequest(data);

      if (response.status === 200) {
        toast.success(response.data.message);

        // Update the searchFindUsers state
        setSearchFindUsers((prev) =>
          prev.map((user) =>
            user.userName === receiverUsername
              ? { ...user, isMessageRequestSent: true }
              : user
          )
        );
        socket?.emit("newNotification", {
          recipientUserId: receiverUserId,

          payload: `${currentUserUserName} has sent you a private message request.`,
        });
      } else {
        toast.error("Error while sending message request!");
      }
    } catch (error) {
      const errorResponse = error as AxiosError<{ message: string }>;
      if (errorResponse.response && errorResponse.response.data) {
        toast.error(errorResponse.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  //  >>>>>>>>>>>>>>>> Fetching The Connected Users With Formatted Data >>>>>>>>>>>>//

  useEffect(() => {
    if (!currentUserUserName) return;
    dispatch(fetchConnectedUsersThunk(currentUserUserName));
  }, [currentUserUserName, dispatch]);

  // >>>>>>>>>>>> Extracting all the existing chat sort list names >>>>>>>>> //
  const chatSortListNames = connectedUsers?.map((list) => list.listName);

  // >>>>>>>>>>>>>>>>> Fetching the number of unseen notifications >>>>>>>>>>>>//
  const { unSeenNotifications } = useSelector(
    (state: RootState) => state.notification
  );

  // setting up the socket for checking user's online status
  socket?.on("userStatusUpdate", (data) => {
    console.log("Received user status update: (/chat/page.tsx): ", data);
    dispatch(updateUserStatus(data));
  });

  // setting up the socket for updating the UserCard for upcoming messages
  socket?.on("realTimeMsgDataUpdate", (data) => {
    console.log("Received realTimeMsgDataUpdate: (/chat/page.tsx): ", data);

    dispatch(updateUserCardForRealTimeMsg(data));
  });

  return (
    <div className="min-h-screen bg-albasterInnerBg  w-full flex flex-col items-center gap-5 md:gap-7  py-6 md:py-8">
      {/* Header portion */}
      <h1 className="text-2xl md:text-3xl text-brownText font-styrene-a-thin-trial">
        Private Message
      </h1>
      {/* User search section */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            className="text-sm text-brownText font-styrene-a-thin-trial"
            placeholder="Search for a user"
            onChange={(e) => {
              setQuery(e.target.value);
              setFetchSearcedUserLoading(true); // Show "searching the user..." message while typing
              setSearchClicked(false); // Reset search click
            }}
          />
          <Button
            variant="custom"
            className="text-sm font-styrene-a-thin-trial"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <div className="max-h-[200px] flex flex-col items-center gap-2 p-4 overflow-y-auto">
          {/* Show loading message */}
          {fetchSearcedUserLoading && !searchClicked ? (
            <p className="text-sm text-brownText font-styrene-a-thin-trial">
              Searching the user...
            </p>
          ) : (
            <>
              {/* Show search results or "No users found" based on results */}
              {
                searchFindUsers.length > 0 ? (
                  <>
                    <h1 className="text-sm text-brownText ">
                      Available Users:
                    </h1>
                    {searchFindUsers.map((user, index) => (
                      <UserSearchList
                        key={index}
                        username={user.userName}
                        userId={user.userId}
                        avatar={user.profileImage}
                        isFriend={user.isFriend}
                        isMessageRequestSent={user.isMessageRequestSent}
                        currentUserUserName={currentUserUserName}
                        currentUserProfileImage={currentUserProfileImage}
                        onSendMessageRequest={handleSendPrivateMessageRequest}
                      />
                    ))}
                  </>
                ) : (
                  query.length !== 0 &&
                  searchFindUsers.length === 0 && (
                    <p className="text-sm text-brownText ">No users found</p>
                  )
                ) // Show "No users found" only if search button is clicked
              }
            </>
          )}
        </div>
      </div>

      {/* Main portion */}
      <div className="min-h-fit flex flex-col items-center justify-between gap-10 -mt-6 md:-mt-10">
        {/* Users list */}
        <div className="flex flex-col gap-2 min-w-[330px] md:min-w-[550px] lg:min-w-[650px] items-center mt-10 md:mt-15">
          {status === "loading" ? (
            <CustomSkeleton numOfTimes={4} isChatSkeleton={false} />
          ) : (
            <>
              {connectedUsers?.length === 0 ? (
                <p className="text-center text-md text-red-600 max-w-xs font-styrene-a-thin-trial">
                  {error ??
                    "Something went wrong while fetching the connected users."}
                </p>
              ) : (
                connectedUsers?.map((user, index) => (
                  <ToggleHeader
                    key={index}
                    title={user.listName}
                    currentUserUserName={currentUserUserName}
                  >
                    {user.members.map((member, index) => (
                      <UserCard
                        key={index}
                        profileImage={member.profileImage}
                        username={member.userName}
                        otherUserId={member.userId}
                        lastMessage={member.lastMessage}
                        totalUnseenMessages={member.totalUnseenMessages}
                        date={member.lastMessageTime}
                        status={member.status}
                        privateMessageId={member.privateMessageId}
                        chatSortListNames={chatSortListNames}
                        currentUserUserName={currentUserUserName}
                        currentUserId={currentUserId}
                        currentUserProfileImage={currentUserProfileImage}
                      />
                    ))}
                  </ToggleHeader>
                ))
              )}
            </>
          )}
        </div>
        {/* Footer */}
        {status === "loading" ? (
          <CustomSkeleton numOfTimes={1} isChatSkeleton={false} />
        ) : (
          <div className="bg-burntSienna/15 hover:bg-burntSienna/30  mx-auto flex justify-between  min-w-[330px] md:min-w-[550px] lg:min-w-[650px] items-center mt-5 p-3 border border-burntSienna rounded-xl">
            <div>
              <CustomChatSortListDialog
                triggerButtonText="Add a list"
                dialogTitleText="Create a list"
                isMessagePlus={true}
                dialogDescriptionText="Enter the name of the list you want to create."
                labelText="List name"
                saveButtonText="Create"
                currentUserUserName={currentUserUserName}
              />
            </div>
            <div className="flex justify-center items-center gap-5">
              <div className="relative ">
                <span
                  className={`${
                    unSeenNotifications === 0 ? "hidden" : ""
                  } bg-red-600 absolute -top-3 -right-2 text-sm w-5 h-5 flex justify-center items-center text-white font-bold p-2 border border-burntSienna rounded-full`}
                >
                  {unSeenNotifications}
                </span>
                <Link href={"/notification"}>
                  <BellDot className="h-5 w-5 md:h-6 md:w-6 text-burntSienna cursor-pointer transition hover:rotate-12 duration-200" />
                </Link>
              </div>

              {/* Setting sheet*/}
              <CustomSheet />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
