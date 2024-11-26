"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  from: string;
  currentUserUserName: string;
  audioUrl: string;
  createdAt: Date;
}

export default function AudioPlayer({
  from,
  currentUserUserName,
  audioUrl,
  createdAt,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const messageCreatedAt = dayjs(createdAt).format("HH:mm");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (!isNaN(audio.duration)) {
        console.log("Audio duration:", audio.duration);
        setDuration(audio.duration);
      }
      
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleAudioEnded = () => setIsPlaying(false);

    // Add event listeners
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("durationchange", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleAudioEnded);

    // Initial duration check
    setAudioData();

    // Cleanup
    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("durationchange", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, []);

  // useEffect(() => {
  //   console.log("Current duration:", duration);
  // }, [duration]);

  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  return (
    <div className={`w-full ${from === currentUserUserName ? "bg-messageOne" : "bg-boneInnerBg"} max-w-md  rounded-xl p-4 shadow-lg`}>


      <audio ref={audioRef} src={audioUrl} />

      <div className="relative flex items-center justify-between gap-4">
        
        <Button
          variant="custom"
          size="icon"
          onClick={togglePlayPause}
          className="h-10 w-10"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <div className="flex-1 text-sm text-darkbrownText">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{  (formatTime(duration)) === "Infinity:NaN" ? "0:00" : formatTime(duration) }</span>
        </div>
        <div className="flex flex-col justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-boneInnerBg"
              >
                <Settings className="h-4 w-4 text-brownText" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-albasterInnerBg text-darkbrownText"
            >
              {[0.5, 1, 1.5, 2].map((rate) => (
                <DropdownMenuItem
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  className={
                    playbackRate === rate
                      ? "bg-boneInnerBg hover:border-boneInnerBg"
                      : ""
                  }
                >
                  {rate}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-xs text-brownText">{messageCreatedAt}</span>
        </div>
      </div>
    </div>
  );
}
