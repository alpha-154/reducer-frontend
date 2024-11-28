"use client";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import logo from "@/assets/reducer.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formLoginSchema } from "@/schema/auth.schema";
import { Button } from "@/components/ui/button";
import bgImg from "@/assets/messagefieldbg.png"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "@/api";

//AxiosError props Interface
interface ErrorResponse {
  message: string;
}

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Defining and validating form fields.
  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  // Defining submit handler.
  const onSubmit = async (data: z.infer<typeof formLoginSchema>) => {
    //console.log("data", data);

    if (!data.userName || !data.password) {
      toast.error("Username or Password Not Provided!");
      return;
    }
    try {
      setLoading(true);
      const loginData = {
        userName: data.userName,
        password: data.password,
      };
      const response = await loginUser(loginData);

      if (response.status === 200) {
        toast.success(response.data.message);
        form.reset();
        setLoading(false);
        router.replace("/chat");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setLoading(false);
      if (error.response && error.response.data) {
        form.reset();
        setLoading(false);
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${bgImg.src})`,
      backgroundSize: "cover", // Ensures the image covers the area
      backgroundPosition: "center", // Centers the image
      backgroundRepeat: "no-repeat", // Prevents tiling
    }}>
         <div className="container-max flex flex-col  items-center justify-center max-sm:p-4">
      {/* <div className="">
        <Image
          src={logo}
          alt="logo"
          width={125}
          height={125}
          className="w-auto h-auto"
          priority
        />
      </div> */}
      <div className="bg-albasterInnerBg border border-burntSienna rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darkbrownText text-md">Username</FormLabel>
                  <FormControl>
                    <Input className="text-brownText" type="text" placeholder="Johndoe" {...field} />
                  </FormControl>
                  <FormDescription className="text-brownText">Enter your username</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darkbrownText text-md">Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="text-darkbrownText" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription  className="text-brownText">
                    Enter your password maintaining the requirements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-center mx-auto">
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin  text-burntSienna" />
                   <span className="text-sm text-burntSienna"></span>Log In...
                </Button>
              ) : (
                <Button variant="custom" type="submit">
                  Login
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <h1 className="text-md md:text-lg text-nightText mt-4 md:mt-5">
        Don&apos;t have an account?{" "}
        <Link href="/register">
          <span className="text-burntSienna hover:text-burntSiennaDeep font-styrene-bold text-md md:text-lg">Register</span>
        </Link>{" "}
      </h1>
    </div>
    </div>
  );
};

export default Login;
