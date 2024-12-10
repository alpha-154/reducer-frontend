"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // `null` to indicate loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.replace("/unauthorized"); // Redirect to unauthorized page
    }
  }, [router]);

  if (isAuthorized === null) {
    // Show loading text while checking authorization
    return <div className="text-center text-darkbrownText text-md md:text-lg">Loading...</div>;
  }

  if (!isAuthorized) {
    // In case of redirect delay, prevent rendering of protected content
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
