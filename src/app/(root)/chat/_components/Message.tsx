"use client";
import dayjs from "dayjs";
import { Message } from "./Drawer";
import AudioPlayer from "@/components/customComponents/AudioPlayer";
interface MessageProps {
  message: Message;
  currentUserUserName: string;
  currentUserId: string;
}

const MessageComponent = ({ message, currentUserUserName, currentUserId }: MessageProps) => {
  //console.log("message", message.seenBy);
  const messageCreatedAt = dayjs(message.createdAt).format("HH:mm");
  return (
    <>
    
        {message.contentType === "text" ? (
          <div
            className={`relative w-fit max-w-sm md:max-w-md lg:max-w-lg px-5 md:px-7 py-3 md:py-5  text-darkbrownText rounded-2xl ${
              message.from === currentUserId ? "self-end bg-messageOne shadow-[0_-10px_20px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.15)]" : "self-start bg-boneInnerBg shadow-[0_-10px_20px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.15)]"
            }`}
          >
            { message.from === currentUserId && (
              message.seenBy.includes(message.to) ? <p className="text-xs text-green-500">Seen</p> : <p className="text-xs text-darkbrownText">Delivered</p>
            )}
            
            
      
            <span
              className={`absolute  bottom-0 right-1  ${
                message.from === currentUserId ? "pr-3" : "pr-0"
              } text-xs text-darkbrownText`}
            >
              {messageCreatedAt}
            </span>
            <p className="text-sm md:text-md">{message.content}</p>
            <div
              className={`absolute  bottom-0 ${
                message.from === currentUserId
                  ? "right-[-10px] bg-messageOne "
                  : "left-[-10px] bg-boneInnerBg "
              }  w-5 h-5  rounded-bl-[15px] transform rotate-[-45deg] shadow-sm`}
            ></div>
          </div>
        ) : (
          <div className={`w-fit  max-w-sm md:max-w-md lg:max-w-lg ${message.from === currentUserId ? "self-end" : "self-start"}`}>
            <AudioPlayer audioUrl={message.content} createdAt={message.createdAt} from={message.from} currentUserId={currentUserId} />
           
          </div>
        )}
    
    </>
  );
};

export default MessageComponent;
