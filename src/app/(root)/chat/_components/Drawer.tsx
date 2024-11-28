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
import { useSocketInstance } from "@/contexts/socketContext";
import bgImg from "@/assets/messagefieldbg.png"
import { Textarea } from "@/components/ui/textarea";

import { AxiosError } from "axios";

import dayjs from "dayjs";
import { fetchPreviousMessagesofAPrivateChat, sendPrivateMessage } from "@/api";

import Image from "next/image";
import MessageComponent from "./Message";
import CustomSkeleton from "@/components/customComponents/CustomSkeleton";
import VoiceRecorder from "@/components/customComponents/VoiceRecorder";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserUserName: string;
  currentUserProfileImage: string;
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
  currentUserUserName,
  currentUserProfileImage,
  userName,
  profileImage,
  privateMessageId,
}) => {
  // >>>>>>>>>>>>>>>>> States >>>>>>>>>>>>>>>///

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

    // Access the main socket instance
    const socketInstance = useSocketInstance(); 
    
    if(process.env.NODE_ENV === "development"){
      console.log("socket instance called!")
    }
    


  // >>>>>>>>>>>>>>>>> Voice Recorder Toggle Function >>>>>>>>>>>>>> //
  const toggleVoiceRecorder = () => {
    setIsVoiceRecorderOpen((prev) => !prev);
  };



  // Join the private chat room
  useEffect(() => {
    if(process.env.NODE_ENV === "development") console.log("socket useEffect triggered:");
    if (!privateMessageId || !socketInstance) return;

    const joinRoomData = { roomIdentifier: privateMessageId };
    socketInstance.emit("joinRoom", joinRoomData);

    const handleIncomingMessage = (incomingMessage: Message) => {
      const dateKey = dayjs(incomingMessage.createdAt).format("YYYY-MM-DD");
      setPreviousMessages((prevMessages) => ({
        ...prevMessages,
        [dateKey]: [...(prevMessages[dateKey] || []), incomingMessage],
      }));
    };

    socketInstance.on("privatemessage", handleIncomingMessage);

    return () => {
      // Emit leaveRoom event before cleaning up
      socketInstance.emit("leaveRoom", { roomIdentifier: privateMessageId });
      socketInstance.off("privatemessage", handleIncomingMessage);
      if(process.env.NODE_ENV === "development")  console.log("privatemessage event removed");
    };
  }, [socketInstance, privateMessageId]);
 
  


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
       // Update UI with the new message
      setPreviousMessages((prevMessages) => ({
        ...prevMessages,
        [dateKey]: [...(prevMessages[dateKey] || []), sentMessage],
      }));

         // Emit the message to the other user through the socket instance
         if (socketInstance) {
          socketInstance.emit("privatemessage", sentMessage);
        }
      
      setMessage("");
    } catch (error) {
      const errorResponse = error as AxiosError<{ message: string }>;
      if(process.env.NODE_ENV === "development")  console.log("error response ", errorResponse);
      if(process.env.NODE_ENV === "development")  console.log("Error while sending private message", error);
    } 
  };

  // >>>>>>>>>>>>>>>>>>> Fetching Previous Conversation Messages >>>>>>>>>>>>>>>>>> //

  useEffect(() => {
    if(process.env.NODE_ENV === "development")  console.log("fetching previous messages useEffect triggered: ")
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
         if(process.env.NODE_ENV === "development") console.log("previous Messages: ", response.data.previousMessages);
          setPreviousMessages(response.data.previousMessages);
        }
      } catch (error) {
        const errorResponse = error as AxiosError<{ message: string }>;
        if(process.env.NODE_ENV === "development")   console.log("error response", errorResponse);
        if(process.env.NODE_ENV === "development")  console.log("Error while fetching previous private messages", error);
      } finally {
        setPreviousMessagesLoading(false);
      }
    };

    if (currentUserUserName && userName) {
      getPreviousMessages();
    }
  }, [currentUserUserName, userName]);


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


  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0  bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Drawer */}
      <div
        className={`z-50 fixed bottom-0 left-0 w-full bg-albasterbg border border-burntSienna rounded-xl transition-transform duration-300 ${
          isOpen ? "transform-none" : "translate-y-full"
        }`}
        style={{ height: "95vh" }}
      >
        <button
          className="absolute top-1 md:top-2 right-2 md:right-1 text-burntSienna text-2xl"
          onClick={onClose}
        >
          <MessageCircleX className="h-6 w-6 text-textBlue" />
        </button>

        <div className="mx-auto w-full max-w-3xl mt-3 md:mt-1 py-5 px-3">
          <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="flex justify-between items-center bg-albasterInnerBg border border-cardBlueBorder  rounded-xl  p-3 md:p-5">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <div className="max-w-10 max-h-10">
                  <Image
                    src={profileImage}
                    width={30}
                    height={30}
                    alt="profileImage"
                    className="w-auto h-auto rounded-xl"
                  />
                </div>
                <h1 className="text-md md:text-lg text-textBlue">
                  {userName}
                </h1>
              </div>

              <div className="flex items-center justify-center gap-4 md:gap-6">
                <Video className="h-6 w-6 text-textBlue cursor-pointer transition transform hover:text-textBlue/80 duration-300" />
                <Phone className="h-5 w-5 text-textBlue cursor-pointer transition transform hover:text-textBlue/80 duration-300" />
                <CircleEllipsis className="h-5 w-5 text-textBlue cursor-pointer transition transform hover:text-textBlue/80 duration-300" />
              </div>
            </div>

            {/* Message area */}
            <div
              ref={messageContainerRef}
              className="max-h-[65vh] min-h-[64vh] shadow-[0_0_20px_rgba(0,0,0,0.20)] mt-2 flex flex-col gap-3 md:gap-5 border-2 border-boneInnerBg rounded-xl p-3 md:p-5 px-7 md:px-10 overflow-y-auto"
              style={{
                backgroundImage: `url(${bgImg.src})`,
                backgroundSize: "cover", // Ensures the image covers the area
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat", // Prevents tiling
              }}
            >
              {previousMessagesLoading ? (
                <CustomSkeleton isChatSkeleton={true} numOfTimes={1} />
              ) : Object.keys(previousMessages).length > 0 ? (
                Object.keys(previousMessages).map((date) => (
                  <div key={date} className="flex flex-col gap-4">
                    <h2 className="text-center text-sm text-darkbrownText">
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
              <div className="flex items-center justify-center border border-boneInnerBg rounded-xl p-4">
                <VoiceRecorder
                  onToggle={toggleVoiceRecorder}
                  currentUserUserName={currentUserUserName}
                  currentUserProfileImage={currentUserProfileImage}
                  chatWithUserUserName={userName}
                  socketInstance={socketInstance} // Pass the chat socket instance
                  previousMessages={previousMessages}
                  setPreviousMessages={setPreviousMessages}
                />
              </div>
            ) : (
              <form
                onSubmit={handleSendMessage}
                className="flex items-center justify-center p-2 bg-inputBg border border-inputBg rounded-xl gap-2 mt-2"
              >
                {/* Emoji Picker Button */}
                <div className="relative">
                  <div className="flex justify-center items-center gap-2">
                    <Sticker
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                      className="h-5 w-5 md:h-7 text-darkbrownText cursor-pointer transition duration-300 hover:text-darkbrownText/80 "
                    />
                    {/* File Upload */}
                   
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
                  className=" placeholder:text-darkbrownText text-darkbrownText"
                />
                <Mic
                  onClick={toggleVoiceRecorder}
                  className="h-7 w-7 text-darkbrownText cursor-pointer transition duration-300 hover:text-darkbrownText/80"
                />
                <button type="submit">
                  <Send className="h-5 w-5 text-darkbrownText cursor-pointer transition duration-300 hover:text-darkbrownText/80" />
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
