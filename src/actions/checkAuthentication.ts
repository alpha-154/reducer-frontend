"use server";
import { NextRequest } from "next/server";

export function checkAuthentication(request: NextRequest): boolean {
  const token = request.cookies.get("accessToken")?.value;
  console.log("checkAuthentication -> token:", token);
  if (token) {
    // Optionally validate the token here (e.g., check expiration)
    return true;
  }
  return false;
}
