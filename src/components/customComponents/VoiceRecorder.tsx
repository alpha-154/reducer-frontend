"use client";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import dayjs from "dayjs";
import { Message } from "@/app/(root)/chat/_components/Drawer";
import WaveSurfer from "wavesurfer.js";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, Pause, Play, Send, Square, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendVoiceMessage } from "@/api";

interface VoiceRecorderProps {
  onToggle: () => void;
  currentUserUserName: string;
  currentUserProfileImage: string;
  chatWithUserUserName: string;
  socketInstance: Socket | null; 
  previousMessages: { [date: string]: Message[] };
  setPreviousMessages: React.Dispatch<
    React.SetStateAction<{ [date: string]: Message[] }>
  >;
}

export default function VoiceRecorder({
  onToggle,
  currentUserUserName,
  currentUserProfileImage,
  chatWithUserUserName,
  socketInstance,
  previousMessages,
  setPreviousMessages,
}: VoiceRecorderProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] =  useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4ade80",
        progressColor: "#22c55e",
        cursorColor: "#22c55e",
        barWidth: 2,
        barGap: 3,
        height: 32,
        cursorWidth: 0,
        normalize: true,
        //responsive: true,
      });

      wavesurfer.current.on("audioprocess", () => {
        if (wavesurfer.current) {
          const time = wavesurfer.current.getCurrentTime();
          setCurrentTime(formatTime(time));
        }
      });

      wavesurfer.current.on("ready", () => {
        if (wavesurfer.current) {
          setDuration(formatTime(wavesurfer.current.getDuration()));
        }
      });

      wavesurfer.current.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.pause();
      } else {
        if (
          wavesurfer.current.getCurrentTime() ===
          wavesurfer.current.getDuration()
        ) {
          wavesurfer.current.stop();
        }
        wavesurfer.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        if (wavesurfer.current) {
          wavesurfer.current.loadBlob(audioBlob);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      // Clean up the media stream
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setCurrentTime("0:00");
    setDuration("0:00");
    if (wavesurfer.current) {
      wavesurfer.current.empty();
      onToggle();
    }
  };

  const sendRecording = async () => {
    if (audioBlob) {
      console.log("Sending audio blob:", audioBlob);
      const formData = new FormData();
      formData.append("audio", audioBlob, "voiceMessage.wav");
      formData.append("sender", currentUserUserName);
      formData.append("receiver", chatWithUserUserName);

      try {
        const response = await sendVoiceMessage({ formData });
        console.log("formdata ", formData);
        //toast.success("Voice message sent successfully!");
        console.log("Voice message sent successfully:", response.data);
        const sentMessage = response.data.message;
        const dateKey = dayjs(sentMessage.createdAt).format("YYYY-MM-DD");

        setPreviousMessages((prevMessages) => ({
          ...prevMessages,
          [dateKey]: [...(prevMessages[dateKey] || []), sentMessage],
        }));

         // Emit the voice message to the server via the chat namespace
         if (socketInstance) {
          socketInstance.emit("privatemessage", sentMessage);
        }

        // Reset the component state after sending
        deleteRecording();
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        if (err.response && err.response.data) {
          toast.error(err.response.data.message);
        }
        console.error("Error sending voice message:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-sm bg-inputBg border border-boneInnerBg rounded-xl p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUserProfileImage} alt="Avatar" />
          <AvatarFallback>
            <Mic className="h-5 w-5 text-darkbrownText" />
          </AvatarFallback>
        </Avatar>

        {audioBlob ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-darkbrownText hover:text-brownText hover:bg-boneInnerBg"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        ) : (
          <div
            className={`w-full mx-auto p-2`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <div className="flex items-center justify-center gap-2">
                <Square className="h-5 w-5 text-darkbrownText hover:text-darkbrownText/80 cursor-pointer" />
                <h1 className="text-sm text-red-500">Recording...</h1>
              </div>
            ) : (
              <>
                <Mic className="h-6 w-6 text-darkbrownText hover:text-darkbrownText/80 cursor-pointer" />
              </>
            )}
          </div>
        )}

        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1" ref={waveformRef} />

          <div className="flex items-center gap-3 min-w-[140px]">
            <span className="text-sm text-darkbrownText">{currentTime}</span>

            {audioBlob && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-burntSienna hover:bg-boneInnerBg hover:text-brownText"
                  >
                    {playbackRate}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-albasterInnerBg text-brownText  cursor-pointer">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                    >
                      {rate}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <span className="text-sm text-colors-custom-orange-text-2">{duration}</span>
          </div>
        </div>

        {audioBlob && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-colors-custom-orange/30"
              onClick={deleteRecording}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-colors-custom-orange hover:text-colors-custom-orange/80 hover:bg-colors-custom-orange/30"
              onClick={sendRecording}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
