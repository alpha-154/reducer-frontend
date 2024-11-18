"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import ToggleHeader from "./_components/ToggleHeader";
import UserCard from "./_components/UserCard";
import { BellDot } from "lucide-react";
import Link from "next/link";
import CustomChatSortListDialog from "@/components/customComponents/CustomChatSortListDialog";
import CustomSheet from "@/components/customComponents/CustomSheet";
import debounce from "lodash.debounce";
import { fetchConnectedUsersWithData, searchUser } from "@/api";
import UserSearchList from "./_components/UserSearchList";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/slices/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";
import CustomSkeleton from "@/components/customComponents/CustomSkeleton";

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

const Chat = () => {
  //  >>>>>>>>>>>>>>>>>  Accessing The Current LoggedIn User's Username >>>>>>>>>>>>> //
  const dispatch = useDispatch<AppDispatch>();
  const { username: currentUserUserName } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // >>>>>>>>>>>>>>>> Searching Users on the Search bar >>>>>>>>>>>>>> //
  const [query, setQuery] = useState<string>("");
  const [searchFindUsers, setSearchFindUsers] = useState<SearchUser[]>([]);
  const [fetchSearcedUserLoading, setFetchSearcedUserLoading] =
    useState<boolean>(false);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);

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
      console.log("searched user data", response.data);
      setSearchFindUsers(response.data.users);
    } catch (error) {
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

  //  >>>>>>>>>>>>>>>> Fetching The Connected Users Data >>>>>>>>>>>>//
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUserData[]>([]);
  const [fetchConnectedUsersLoading, setFetchConnectedUsersLoading] =
    useState<boolean>(false);


  

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        setFetchConnectedUsersLoading(true);
        const response = await fetchConnectedUsersWithData(currentUserUserName);
        console.log("connected users data", response.data.connectedUsers);
        if (response.status === 200) {
          setConnectedUsers(response.data.connectedUsers);
        }
      } catch (error) {
        console.error("Error fetching connected users data:", error);
      } finally {
        setFetchConnectedUsersLoading(false);
      }
    };

    if (currentUserUserName.length > 0) {
      fetchConnectedUsers();
    }
  }, [currentUserUserName]);


  // >>>>>>>>>>>> Extracting all the existing chat sort list names >>>>>>>>> //
  const chatSortListNames = connectedUsers.map((list) => list.listName);

  

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-5 md:gap-7 border border-colors-custom-orange rounded-xl py-8 md:py-10 max-sm:px-2">
      {/* Header portion */}
      <h1 className="text-3xl md:text-4xl text-colors-custom-orange">Private Message</h1>
      {/* User search section */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            placeholder="Search for a user"
            onChange={(e) => {
              setQuery(e.target.value);
              setFetchSearcedUserLoading(true); // Show "searching the user..." message while typing
              setSearchClicked(false); // Reset search click
            }}
          />
          <Button variant="custom" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className="max-h-[300px] flex flex-col items-center gap-2 p-4 overflow-y-auto">
          {/* Show loading message */}
          {fetchSearcedUserLoading && !searchClicked ? (
            <p>Searching the user...</p>
          ) : (
            <>
              {/* Show search results or "No users found" based on results */}
              {
                searchFindUsers.length > 0 ? (
                  <>
                    <h1 className="text-xl">Available Users:</h1>
                    {searchFindUsers.map((user, index) => (
                      <UserSearchList
                        key={index}
                        username={user.userName}
                        avatar={user.profileImage}
                        isFriend={user.isFriend}
                        isMessageRequestSent={user.isMessageRequestSent}
                        currentUserUserName={currentUserUserName}

                      />
                    ))}
                  </>
                ) : (
                  query.length !== 0 && searchFindUsers.length === 0 && <p>No users found</p>
                ) // Show "No users found" only if search button is clicked
              }
            </>
          )}
        </div>
      </div>

      {/* Main portion */}
      <div className="min-h-fit flex flex-col items-center justify-between gap-10">
        {/* Users list */}
        <div className="flex flex-col min-w-[330px] md:min-w-[550px] lg:min-w-[650px] items-center gap-4 mt-10 md:mt-15">
          {fetchConnectedUsersLoading ? (
            <CustomSkeleton 
            numOfTimes={4} 
            isChatSkeleton={false}
            />
          ) : (
            connectedUsers.map((user, index) => (
              <ToggleHeader key={index} title={user.listName}  currentUserUserName={currentUserUserName} >
                {user.members.map((member, index) => (
                  <UserCard
                    key={index}
                    profileImage={member.profileImage}
                    username={member.userName}
                    lastText={member.lastMessage}
                    date={member.lastMessageTime}
                    privateMessageId={member.privateMessageId}
                  
                   chatSortListNames={chatSortListNames}
                   currentUserUserName={currentUserUserName}
                  />
                ))}
              </ToggleHeader>
            ))
          )}
        </div>
        {/* Footer */}
        <div className=" bg-colors-custom-orange-thin mx-auto flex justify-between  min-w-[330px] md:min-w-[550px] lg:min-w-[650px] items-center mt-5 p-3 rounded-xl">
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
            <Link href={"/notification"}>
              <BellDot className="h-5 w-5 md:h-6 md:w-6 text-colors-custom-orange cursor-pointer transition hover:rotate-12 duration-200" />
            </Link>

            {/* Setting sheet*/}
            <CustomSheet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
