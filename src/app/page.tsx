import Link from "next/link";
import { Button } from "@/components/ui/button"




export default function Home() {
  return (
   <div className="container-max flex flex-col gap-4 items-center justify-center border border-zinc-500">
    <h1 className="text-3xl">Home</h1>
    <Link href="/register"><Button variant="custom">Register</Button></Link>
    <Link href="/login"><Button variant="custom">Login</Button></Link>
   
   </div>
  );
}
