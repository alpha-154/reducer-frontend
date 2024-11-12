"use client";
import dayjs from "dayjs";
import { Message } from "./Drawer";
interface MessageProps {
  message: Message;
  currentUserUserName: string;
}

const MessageComponent = ({ message, currentUserUserName }: MessageProps) => {
  const messageCreatedAt = dayjs(message.createdAt).format("HH:mm");
  return (
    <div className={`relative w-fit max-w-sm md:max-w-md lg:max-w-lg px-5 md:px-7 py-3 md:py-5 bg-colors-dark-shade text-white rounded-2xl ${message.from === currentUserUserName ? "self-end" : "self-start"}`}>
      <span className={`absolute  bottom-0 right-1  ${message.from === currentUserUserName ? "pr-3" : "pr-0"} text-sm text-white`}>
        {messageCreatedAt}
      </span>
      <p className="text-lg md:text-xl">{message.content}</p>
      <div
        className={`absolute  bottom-0 ${
          message.from === currentUserUserName
            ? "right-[-10px]"
            : "left-[-10px]"
        }  w-5 h-5 bg-colors-dark-shade rounded-bl-[15px] transform rotate-[-45deg] shadow-sm`}
      ></div>
    </div>
  );
};

export default MessageComponent;
