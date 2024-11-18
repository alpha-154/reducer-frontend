import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';

type PlaybackRate = 1 | 1.5 | 2;

interface VoiceMessageProps {
  audioUrl: string;
  timestamp: string;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ audioUrl, timestamp }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [isWaveformReady, setIsWaveformReady] = useState<boolean>(false);

  // Initialize WaveSurfer
  const initializeWaveSurfer = useCallback(() => {
    if (!containerRef.current) return;

    try {
      // Cleanup previous instance
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      const wavesurfer: WaveSurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#cccccc',
        progressColor: '#f97316',
        cursorColor: '#f97316',
        height: 48,
        normalize: true,
        barWidth: 2,
        barGap: 1,
        autoplay: false
      });

      wavesurferRef.current = wavesurfer;

      const handleReady = () => {
        setIsWaveformReady(true);
        const audioDuration = wavesurfer.getDuration();
        setDuration(formatTime(audioDuration));
      };

      const handleAudioProcess = () => {
        const time = wavesurfer.getCurrentTime();
        setCurrentTime(formatTime(time));
      };

      const handleFinish = () => {
        setIsPlaying(false);
      };

      wavesurfer.on('ready', handleReady);
      wavesurfer.on('audioprocess', handleAudioProcess);
      wavesurfer.on('finish', handleFinish);

      return wavesurfer;
    } catch (error) {
      console.error('Error initializing WaveSurfer:', error);
      return null;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const wavesurfer = initializeWaveSurfer();
    
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [initializeWaveSurfer]);

  // Load audio URL
  useEffect(() => {
    if (wavesurferRef.current && audioUrl) {
      try {
        wavesurferRef.current.load(audioUrl);
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    }
  }, [audioUrl]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = async (): Promise<void> => {
    if (wavesurferRef.current) {
      try {
        if (isPlaying) {
          await wavesurferRef.current.pause();
        } else {
          // Get the audio context from WaveSurfer
          const audioContext = (wavesurferRef.current as any).backend?.ac;
          if (audioContext?.state === 'suspended') {
            await audioContext.resume();
          }
          await wavesurferRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error toggling playback:', error);
      }
    }
  };

  const handlePlaybackRateChange = (): void => {
    const rates: PlaybackRate[] = [1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(nextRate);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 max-w-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlayPause}
          type="button"
          disabled={!isWaveformReady}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isWaveformReady 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-1" />
          )}
        </button>

        <div className="flex-1">
          <div ref={containerRef} className="w-full" />
          
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>{currentTime}</span>
            <button 
              onClick={handlePlaybackRateChange}
              type="button"
              disabled={!isWaveformReady}
              aria-label="Change playback speed"
              className={`transition-colors ${
                isWaveformReady 
                  ? 'hover:text-orange-500' 
                  : 'cursor-not-allowed'
              }`}
            >
              {playbackRate}x
            </button>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;