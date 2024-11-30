"use client";
import Link from "next/link";
const Unauthorized = () => {
    

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-albasterInnerBg">
        <h1 className="text-lg md:text-2xl text-darkbrownText">You&apos;re <span className="text-red-500 font-styrene-bold">Unauthorized!</span></h1>
        <p className="text-md md:text-lg text-darkbrownText mt-4 md:mt-6">Please log in to access this page. <Link href={"/login"} className="text-md md:text-lg text-burntSiennaDeep hover:text-burntSienna">Login</Link> </p>
      </div>
    );
  };
  
  export default Unauthorized;
  