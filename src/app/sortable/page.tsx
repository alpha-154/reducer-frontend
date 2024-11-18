// app/page.tsx
"use client";

import VoiceMessage from "@/components/Random";
import Component from "@/components/Random";



export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
       <VoiceMessage 
        audioUrl="https://res.cloudinary.com/dyy7hjubd/video/upload/v1731775286/voice-messages/es6xatah5add7r3zibqo.webm"
        timestamp="10:00"

/>
    </main>
  );
}



