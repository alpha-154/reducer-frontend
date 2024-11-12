// Drawer.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Video,
  Phone,
  CircleEllipsis,
  Send,
  MessageCircleX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { getSocket } from "@/lib/socket.config";
import { Socket } from "socket.io-client";
import dayjs from "dayjs";
import { fetchPreviousMessagesofAPrivateChat, sendPrivateMessage } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/slices/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import Image from "next/image";
import MessageComponent from "./Message";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  profileImage: string;
  privateMessageId: string;
}

export interface Message {
  from: string;
  to: string;
  content: string;
  isGroupMsg: boolean;
  senderProfileImage?: string;
  groupMsgIdentifier?: string;
  privateMsgIdentifier?: string;
  createdAt: Date;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  userName,
  profileImage,
  privateMessageId,
}) => {
  //  >>>>>>>>>>>>>>>>>  Accessing The Current LoggedIn User's Username >>>>>>>>>>>>> //
  const dispatch = useDispatch<AppDispatch>();
  const { username: currentUserUserName } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // >>>>>>>>>>>>>>  Setting up the Socket Connection using the privateMessageId as the socket room property  >>>>>>>>>>> //
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = getSocket();
    socketInstance.auth = {
      room: privateMessageId,
    };
    socketInstance.connect();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [privateMessageId]);

  // >>>>>>>>>>>>>>>>>>>> Sending Private Message >>>>>>>>>>>>>>>>>>>>>>>>>>> //
  const [message, setMessage] = useState<string>("");
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUserUserName && !userName && message === "") return;

    const data = {
      currentUserUserName,
      chatWithUserUserName: userName,
      message,
    };

    try {
      const response = await sendPrivateMessage(data);

      const sentMessage = response.data.message;
      const dateKey = dayjs(sentMessage.createdAt).format("YYYY-MM-DD");

      setPreviousMessages((prevMessages) => ({
        ...prevMessages,
        [dateKey]: [...(prevMessages[dateKey] || []), sentMessage],
      }));

      socket?.emit("message", sentMessage);
      setMessage("");
    } catch (error) {
      const errorResponse = error as AxiosError<{ message: string }>;
      console.log("error response ", errorResponse);
      console.log("Error while sending private message", error);
    }
  };

  // >>>>>>>>>>>>>>>>>>> Fetching Previous Conversation Messages >>>>>>>>>>>>>>>>>> //

  const [previousMessages, setPreviousMessages] = useState<{
    [date: string]: Message[];
  }>({});
  const [previousMessagesLoading, setPreviousMessagesLoading] = useState(false);

  useEffect(() => {
    const getPreviousMessages = async () => {
      if (!currentUserUserName) return;
      const data = {
        currentUserUserName,
        chatWithUserUserName: userName,
      };
      try {
        setPreviousMessagesLoading(true);
        const response = await fetchPreviousMessagesofAPrivateChat(data);

        if (response.status === 200) {
          console.log("previous Messages: ", response.data.previousMessages);
          setPreviousMessages(response.data.previousMessages);
        }
      } catch (error) {
        const errorResponse = error as AxiosError<{ message: string }>;
        console.log("error response", errorResponse);
        console.log("Error while fetching previous private messages", error);
      } finally {
        setPreviousMessagesLoading(false);
      }
    };

    if (currentUserUserName && userName) {
      getPreviousMessages();
    }
  }, [currentUserUserName, userName]);

  // >>>>>>>>>>>>>>>>>>>>>>>>> Listen Upcoming Messages >>>>>>>>>>>>>>>>>>>>>>> //
  useEffect(() => {
    socket?.on("message", (data: Message) => {
      const dateKey = dayjs(data.createdAt).format("YYYY-MM-DD");
      setPreviousMessages((prevMessages) => ({
        ...prevMessages,
        [dateKey]: [...(prevMessages[dateKey] || []), data],
      }));
    });

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  // >>>>>>>>>>>>>>>>>>>>>>> Scrolling to bottom of the Message div >>>>>>>>>>>>> //

  // Ref To The Message Container
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to Scroll to The Bottom of The Message Container
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth", // This enables smooth scrolling
      });
    }
  };

  // Scroll To The Bottom When The Component Mounts and When previousMessages get updated
  useEffect(() => {
    scrollToBottom();
  }, [previousMessages]);

  // if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-90 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Drawer */}
      <div
        className={`z-100 fixed -bottom-2 left-0 w-full bg-black border border-colors-custom-orange rounded-xl transition-transform duration-300 ${
          isOpen ? "transform-none" : "translate-y-full"
        }`}
        style={{ height: "95vh" }}
      >
        <div className="relative w-full h-full">
          <button
            className="absolute -top-2 md:top-0 right-2 text-orange-500 text-2xl"
            onClick={onClose}
          >
            <MessageCircleX className="h-6 w-6 text-colors-custom-orange" />
          </button>

          <div className="mx-auto w-full max-w-3xl mt-3 md:mt-1 py-5 px-3">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center bg-colors-custom-orange-thin border border-colors-custom-orange rounded-xl p-3 md:p-5">
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  <div className="w-10 h-10 bg-colors-custom-orange rounded-full">
                    <Image
                      src={profileImage}
                      width={40}
                      height={40}
                      alt="profileImage"
                      className="rounded-xl"
                    />
                  </div>
                  <h1 className="text-xl md:text-2xl font-semibold">
                    {userName}
                  </h1>
                </div>

                <div className="flex items-center justify-center gap-4 md:gap-6">
                  <Video className="h-6 w-6 text-colors-custom-orange cursor-pointer transition transform hover:text-colors-custom-orange/80 duration-300" />
                  <Phone className="h-5 w-5 text-colors-custom-orange cursor-pointer transition transform hover:text-colors-custom-orange/80 duration-300" />
                  <CircleEllipsis className="h-5 w-5 text-colors-custom-orange cursor-pointer transition transform hover:text-colors-custom-orange/80 duration-300" />
                </div>
              </div>

              {/* Message area */}
              <div
                ref={messageContainerRef}
                className="min-h-[350px] max-sm:max-h-[440px] max-h-[420px] bg-colors-custom-orange-thin mt-2 flex flex-col gap-3 md:gap-5 border border-colors-custom-orange rounded-xl p-3 md:p-5 px-7 md:px-10 overflow-y-auto"
              >
                {previousMessagesLoading ? (
                  <div className="flex items-center justify-center text-colors-custom-orange">
                    <span>Loading messages...</span>
                  </div>
                ) : Object.keys(previousMessages).length > 0 ? (
                  Object.keys(previousMessages).map((date) => (
                    <div key={date} className="flex flex-col gap-4">
                      <h2 className="text-center text-sm text-gray-500">
                        {date === dayjs().format("YYYY-MM-DD") ? "Today" : date}
                      </h2>
                      {previousMessages[date].map((message, index) => (
                        <MessageComponent
                          key={index}
                          message={message}
                          currentUserUserName={currentUserUserName}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <h1 className="text-2xl text-center text-colors-custom-orange">
                    No messages yet!
                  </h1>
                )}
              </div>

              {/* Input Field */}

              <form
                onSubmit={handleSendMessage}
                className="flex items-center justify-center p-2 bg-colors-custom-orange-thin border border-colors-custom-orange rounded-xl gap-2 mt-2"
              >
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="placeholder:text-colors-custom-orange-text-2"
                />
                <Button variant="custom" type="submit">
                  send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
