import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const aladin = localFont({
  src: "./fonts/Aladin-Regular.ttf",
  variable: "--font-aladin",
});

export const metadata: Metadata = {
  title: "Reducer - Unified Communication Hub",
  description: "Reducer is a versatile communication platform that combines mail, group chat, and private messaging into a single, user-friendly interface, enhancing your messaging experience and productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body
        className={`${aladin.variable} ${geistSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-aladin), var(--font-geist-sans), sans-serif" }}
      >
        {children}
        <Toaster richColors duration={2000} position="bottom-right"  />
      </body>
    </html>
  );
}




// import { Metadata } from "next";

// export const generateMetadata = (): Metadata => {
//   return {
//     title: "Reducer - Group Chat",
//     description: "Collaborate with teams and communities in group chats on Reducer.",
//   };
// };