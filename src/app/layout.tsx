import type { Metadata } from "next";
import localFont from "next/font/local";
import ReduxProvider from "@/provider/ReduxProvider";
import { SocketProvider } from "@/contexts/socketContext";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Define each font variation separately
const styreneThin = localFont({
  src: "./fonts/styrene/StyreneB-Thin-Trial-BF63f6cc84a4246.otf",
  variable: "--font-styrene-thin",
});

const styreneThinItalic = localFont({
  src: "./fonts/styrene/StyreneB-ThinItalic-Trial-BF63f6cbe8d3333.otf",
  variable: "--font-styrene-thin-italic",
});

const styreneRegular = localFont({
  src: "./fonts/styrene/StyreneB-Regular-Trial-BF63f6cbe9db1d5.otf",
  variable: "--font-styrene-regular",
});

const styreneMedium = localFont({
  src: "./fonts/styrene/StyreneB-Medium-Trial-BF63f6cc85760c2.otf",
  variable: "--font-styrene-medium",
});

const styreneBold = localFont({
  src: "./fonts/styrene/StyreneB-Bold-Trial-BF63f6cbe9f13bb.otf",
  variable: "--font-styrene-bold",
});

const styreneAThinItalic = localFont({
  src: "./fonts/styrene/StyreneA-ThinItalic-Trial-BF63f6cbd95634b.otf",
  variable: "--font-styreneA-thin-italic",
});
const styreneAThinTrial = localFont({
  src: "./fonts/styrene/StyreneA-Thin-Trial-BF63f6cbd91263f.otf",
  variable: "--font-styreneA-thin-trial",
});

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
  description:
    "Reducer is a versatile communication platform that combines mail, group chat, and private messaging into a single, user-friendly interface, enhancing your messaging experience and productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${styreneThin.variable} 
          ${styreneThinItalic.variable}
          ${styreneRegular.variable}
          ${styreneMedium.variable}
          ${styreneBold.variable}
          ${styreneAThinItalic.variable}
          ${styreneAThinTrial.variable}
          antialiased
          bg-albasterbg
        `}
        style={{
          fontFamily: "var(--font-styrene-regular), sans-serif",
        }}
      >
        <ReduxProvider>
          <SocketProvider>
            {children}
            <Toaster className="max-sm:max-w-[300px]" richColors duration={2000} position="bottom-right" />
          </SocketProvider>
        </ReduxProvider>
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
