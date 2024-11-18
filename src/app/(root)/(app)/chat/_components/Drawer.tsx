// Drawer.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Video,
  Phone,
  CircleEllipsis,
  Send,
  MessageCircleX,
  Link,
  Sticker,
  Mic,
} from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"; // Import Emoji Picker
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
import CustomSkeleton from "@/components/customComponents/CustomSkeleton";
import VoiceRecorder from "../../../../../components/customComponents/VoiceRecorder";

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
  contentType: string;
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
  // >>>>>>>>>>>>>>>>> States >>>>>>>>>>>>>>>///
  const [socket, setSocket] = useState<Socket | null>(null);
  const [previousMessages, setPreviousMessages] = useState<{
    [date: string]: Message[];
  }>({});
  const [previousMessagesLoading, setPreviousMessagesLoading] = useState(false);

  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for Emoji Picker
  // Ref To The Message Container
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] =
    useState<boolean>(false);

  // >>>>>>>>>>>>>>>>> Voice Recorder Toggle Function >>>>>>>>>>>>>> //
  const toggleVoiceRecorder = () => {
    setIsVoiceRecorderOpen((prev) => !prev);
  };

  //  >>>>>>>>>>>>>>>>>  Accessing The Current LoggedIn User's Username >>>>>>>>>>>>> //
  const dispatch = useDispatch<AppDispatch>();
  const { username: currentUserUserName, profileImage: currentUserProfileImage } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // >>>>>>>>>>>>>>  Setting up the Socket Connection using the privateMessageId as the socket room property  >>>>>>>>>>> //

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

  // >>>>>>>>>>>>>>>>>>>> Sending Emoji >>>>>>>>>>>>>>>>>>>>>>>>>>> //

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowEmojiPicker(false); // Close picker after emoji is selected
  };

  // >>>>>>>>>>>>>>>>>>>> Sending Private Message >>>>>>>>>>>>>>>>>>>>>>>>>>> //

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
        className="fixed inset-0  bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Drawer */}
      <div
        className={`z-50 fixed bottom-0 left-0 w-full bg-black border border-colors-custom-orange rounded-xl transition-transform duration-300 ${
          isOpen ? "transform-none" : "translate-y-full"
        }`}
        style={{ height: "95vh" }}
      >
        <button
          className="absolute top-1 md:top-2 right-2 md:right-1 text-orange-500 text-2xl"
          onClick={onClose}
        >
          <MessageCircleX className="h-6 w-6 text-colors-custom-orange" />
        </button>

        <div className="mx-auto w-full max-w-3xl mt-3 md:mt-1 py-5 px-3">
          <div className="flex flex-col gap-1">
            {/* Header */}
            <div className="flex justify-between items-center bg-colors-custom-orange-thin border border-colors-custom-orange rounded-xl p-3 md:p-5">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <div className="w-10 h-10rounded-full">
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
              className="max-h-[62vh] md:max-h-[60vh] min-h-[50vh] md:min-h-[55vh] bg-colors-custom-orange-thin mt-2 flex flex-col gap-3 md:gap-5 border border-colors-custom-orange rounded-xl p-3 md:p-5 px-7 md:px-10 overflow-y-auto"
            >
              {previousMessagesLoading ? (
                <CustomSkeleton isChatSkeleton={true} numOfTimes={1} />
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
            {isVoiceRecorderOpen ? (
              <div className="flex items-center justify-center border border-colors-custom-orange rounded-xl p-4">
                <VoiceRecorder
                  onToggle={toggleVoiceRecorder}
                  currentUserUserName={currentUserUserName}
                  currentUserProfileImage={currentUserProfileImage}
                  chatWithUserUserName={userName}
                  socket={socket}
                  previousMessages={previousMessages}
                  setPreviousMessages={setPreviousMessages}
                />
              </div>
            ) : (
              <form
                onSubmit={handleSendMessage}
                className="flex items-center justify-center p-2 bg-colors-custom-orange-thin border border-colors-custom-orange rounded-xl gap-2 mt-2"
              >
                {/* Emoji Picker Button */}
                <div className="relative">
                  <div className="flex justify-center items-center gap-2">
                    <Sticker
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                      className="h-6 w-6 md:h-7 md:w-7 text-colors-custom-orange cursor-pointer transition duration-300 hover:text-colors-custom-orange/80 "
                    />
                    {/* File Upload */}
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Link className="h-5 w-5 md:h-6 md:w-6 text-colors-custom-orange transition duration-300 hover:text-colors-custom-orange/80" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      //onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 z-50">
                      <EmojiPicker
                        theme={Theme.DARK}
                        height={400}
                        width={330}
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>
                  )}
                </div>
                {/* Message Input */}
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className=" placeholder:text-colors-custom-orange-text-2"
                />
                <Mic
                  onClick={toggleVoiceRecorder}
                  className="h-8 w-8 text-colors-custom-orange cursor-pointer transition duration-300 hover:text-colors-custom-orange/80"
                />
                <button type="submit">
                  <Send className="h-6 w-6 text-colors-custom-orange cursor-pointer transition duration-300 hover:text-colors-custom-orange/80" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
