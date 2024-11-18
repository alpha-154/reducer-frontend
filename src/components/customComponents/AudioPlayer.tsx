'use client'


import { Button } from "@/components/ui/button"
import dayjs from "dayjs"
import { Mic, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import WaveSurfer from 'wavesurfer.js'


interface AudioPlayerProps {
  audioUrl: string;
  createdAt: Date;
}
// abort error fix it...
export default function AudioPlayer({ audioUrl , createdAt}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)

 


  useEffect(() => {
    if (wavesurfer.current) {
      // Cleanup any existing instance before initializing a new one
      wavesurfer.current.destroy();
      wavesurfer.current = null;
    }
  
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ffffff',
        progressColor: '#eb683f',
        cursorColor: '#eb683f',
        barWidth: 2,
        barRadius: 3,
        barGap: 2,
        height: 40,
        normalize: true,
      });
  
      //wavesurfer.current.load(audioUrl);
      try {
        wavesurfer.current.load(audioUrl);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
      
  
      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current?.getDuration() || 0);
      });
  
      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
      });
  
      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
      });
  
      return () => {
        if (wavesurfer.current) {
          console.log("Cleaning up WaveSurfer instance...");
          try {
            wavesurfer.current.destroy();
            console.log("WaveSurfer instance destroyed successfully.");
          } catch (error) {
            console.error("Error during WaveSurfer cleanup:", error);
          }
          wavesurfer.current = null;
        }
      };
    }
  }, [audioUrl]);
  


  const togglePlayback = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause()
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const togglePlaybackRate = () => {
    const rates = [1,1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]
    setPlaybackRate(nextRate)
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(nextRate)
    }
  }

  const messageCreatedAt = dayjs(createdAt).format("HH:mm");

  return (
    <div className="bg-colors-dark-shade p-3 rounded-xl max-w-md md:max-w-lg flex items-center gap-10">
        <div className="flex items-center justify-center gap-2">
       

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 rounded-full text-white"
        onClick={togglePlayback}
      >
        {isPlaying ? <Pause className="h-4 w-4 text-colors-custom-orange" /> : <Play className="h-4 w-4 " />}
      </Button>
        </div>
     

      <div className="flex flex-col gap-2">
        <div ref={waveformRef} className="w-full" />
        <div className="w-full flex justify-between items-center text-sm text-colors-custom-orange">
          <span className="mr-2">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlaybackRate}
              className="hover:text-white"
            >
              {playbackRate}x
            </button>
            <span>{messageCreatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}





