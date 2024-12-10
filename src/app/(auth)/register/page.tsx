"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formRegisterSchema } from "@/schema/auth.schema";
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
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { checkUsername, registerUser } from "@/api";

// AxiosError props Interface
interface ErrorResponse {
  message: string;
}

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [usernameStatus, setUsernameStatus] = useState<{
    message: string;
    color: "red" | "green";
  }>({ message: "", color: "red" });
  // Color mapping for conditional styling
  const colorMap = {
    red: "text-red-500",
    green: "text-green-500",
  };
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Password requirement states
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasSpecialChar: false,
  });

  const form = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      userName: "",
      password: "",
      profileImage: null,
    },
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // console.log("e.target.files: ", e.target.files);
    // console.log("file: ", file);
    if (file && file.size > 2 * 1024 * 1024) {
      // Limit to 5MB
      toast.error("File size must be under 2MB.");
    } else {
      setImage(file || null);
      setPreview(URL.createObjectURL(e.target.files![0])); // Image preview
    }
  };

  // Checking username uniqueness
  const checkUsernameUnique = async (username: string) => {
    setIsCheckingUsername(true);
    try {
      const response = await checkUsername(username);
      //console.log("response", response.data);
      setUsernameStatus({
        message: response.data.isUnique
          ? "Username is Valid"
          : "Username isn't Valid",
        color: response.data.isUnique ? "green" : "red",
      });
    } catch (error) {
      console.error("Error checking username uniqueness:", error);
      toast.error("Failed to check username. Please try again.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  
  const username = form.watch("userName");
  // Watch username field and debounce check for uniqueness
  useEffect(() => {
  
    if (username.length < 5) {
      setUsernameStatus({
        message: "Username must be at least 5 characters long.",
        color: "red",
      });
    } else {
      const debouncedCheck = debounce(checkUsernameUnique, 500);
      debouncedCheck(username);
  
      return () => {
        debouncedCheck.cancel();
      };
    }
  }, [username, form]);
  
  
   
  const password = form.watch("password");
  // Watch the password field and update requirements
  useEffect(() => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const onSubmit = async (data: z.infer<typeof formRegisterSchema>) => {
    try {
      setLoading(true);
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "user_profile_image");

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dyy7hjubd/image/upload`,
          formData
        );

        imageUrl = cloudinaryResponse.data.secure_url;
      }

      const registrationData = {
        userName: data.userName,
        password: data.password,
        imageUrl: imageUrl || "",
      };
      const response = await registerUser(registrationData);

      if (response.status === 201) {
        toast.success("User Registration Successful!");
        form.reset();
        setImage(null);
        setLoading(false);
        router.replace("/login");
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
    <div className="container-max flex flex-col items-center justify-center  max-sm:p-4">
     
      <div className="bg-albasterInnerBg border border-burntSienna rounded-xl  p-6 md:p-8 shadow-[0_0_20px_rgba(0,0,0,0.15)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darkbrownText text-sm md:text-base">Username</FormLabel>
                  <FormControl>
                    <Input className="text-brownText" type="text" placeholder="Johndoe" {...field} />
                  </FormControl>

                  {isCheckingUsername ? (
                    <p className="flex gap-2">
                      {" "}
                      <Loader2 className="animate-spin text-burntSienna" />{" "}
                      <span className="text-burntSienna text-sm">
                        Checking username...
                      </span>
                    </p>
                  ) : (
                    <p className={`${colorMap[usernameStatus.color]} text-xs`}>
                      {usernameStatus.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darkbrownText text-sm md:text-base">Password</FormLabel>
                  <FormControl>
                    <Input className="text-brownText"  type="password" placeholder="********" {...field} />
                  </FormControl>
                  <div className="mt-2 space-y-1">
                    <p
                      className={`text-${
                        passwordRequirements.minLength ? "green" : "red"
                      }-500 text-xs`}
                    >
                      • Minimum 8 characters
                    </p>
                    <p
                      className={`text-${
                        passwordRequirements.hasNumber ? "green" : "red"
                      }-500 text-xs`}
                    >
                      • Contains a number
                    </p>
                    <p
                      className={`text-${
                        passwordRequirements.hasUppercase ? "green" : "red"
                      }-500 text-xs`}
                    >
                      • Contains uppercase letter
                    </p>
                    <p
                      className={`text-${
                        passwordRequirements.hasSpecialChar ? "green" : "red"
                      }-500 text-xs`}
                    >
                      • Contains special character
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileImage"
              render={() => (
                <FormItem>
                  <FormLabel className="text-darkbrownText text-sm md:text-base">Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="text-brownText"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Render preview in the component: */}
            <div className="w-full flex justify-center items-center">
              {preview && (
                <Image
                  src={preview}
                  alt="Profile Preview"
                  width={100}
                  height={100}
                  className="rounded-xl"
                />
              )}
            </div>

            <div className="w-full flex items-center justify-center mx-auto">
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin text-burntSienna" />
                   <span className="text-xs text-burntSienna">Registration in progress...</span>
                </Button>
              ) : (
                <Button variant="custom" type="submit" className="text-sm md:text-base">
                  Register
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <h1 className="text-md md:text-lg text-nightText mt-3 md:mt-4 ">
        Already have an account?{" "}
        <Link href="/login">
        <span className="text-burntSienna hover:text-burntSiennaDeep font-styrene-bold text-md md:text-lg">Login</span>
        </Link>{" "}
      </h1>
    </div>
    </div>
  );
};

export default Register;
