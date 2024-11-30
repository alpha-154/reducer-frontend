"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  //const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthorized(true);
    } else {
      router.replace("/unauthorized"); // Redirect to unauthorized page
    }
  }, [router]);

  if (!isAuthorized) return null; // Render nothing until the check is complete

  return <>{children}</>;
};

export default ProtectedRoute;
