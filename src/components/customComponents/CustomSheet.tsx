"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Settings, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import axios, { AxiosError } from "axios";
import {
  fetchUserThunk,
  updatePasswordThunk,
  updateProfileImageThunk,
} from "@/slices/userSlice";
import { toast } from "sonner";

export default function CustomSheet() {
  // >>>>>>>>>>>>>>  Accessing the Current User's Data >>>>>>>>>>>>>> //
  const dispatch = useDispatch<AppDispatch>();
  const { username, profileImage } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  //console.log("profile image", profileImage);

  //states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const [updateImageUrl, setUpdateImageUrl] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // File input ref

  // handle password change
  const handlePasswordChange = () => {
    // Handle password change logic here
    console.log("Password changed");
    if (!currentPassword || !newPassword) {
      toast.error("Current Password or New Password Not Provided!");
      return;
    } else if (currentPassword === newPassword) {
      toast.error("Current Password and New Password are Same!");
      return;
    }

    dispatch(
      updatePasswordThunk({
        currentUserUserName: username,
        currentPassword,
        newPassword,
      })
    );
    setChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  // handle image change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // console.log("e.target.files: ", e.target.files);
    // console.log("file: ", file);
    if (file && file.size > 2 * 1024 * 1024) {
      // Limit to 5MB
      toast.error("File size must be under 2MB.");
    } else {
      setUpdateImageUrl(file || null);
      setPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  // handle upload click
  const onImageUpload = async () => {
    if (updateImageUrl === null) return;

    setImageUploadLoading(true);
    let imageUrl = "";

    if (updateImageUrl) {
      const formData = new FormData();
      formData.append("file", updateImageUrl);
      formData.append("upload_preset", "user_profile_image");
      try {
        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dyy7hjubd/image/upload`,
          formData
        );
        imageUrl = cloudinaryResponse.data.secure_url;
        console.log("imageUrl: ", imageUrl);
      } catch (error) {
        console.log("error: ", error);
        toast.error("Something went wrong. Please try again later.");
        setImageUploadLoading(false);
        setPreview(null);
        setUpdateImageUrl(null);
        return;
      }
    }

    dispatch(
      updateProfileImageThunk({
        currentUserUserName: username,
        imageUrl,
      })
    )
      .then(() => {
        setUpdateImageUrl(null);
        setPreview(null);
        setImageUploadLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      })
      .catch((err) => {
        setImageUploadLoading(false);
        setPreview(null);
        setUpdateImageUrl(null);
      });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-burntSienna hover:bg-burntSienna/60"
        >
          <Settings2 className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-albasterInnerBg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-brownText">
            Profile Settings
          </SheetTitle>
          <SheetDescription className="text-left text-brownText">
            Select the checkbox next to the setting you want to update.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex flex-col items-center">
                <Image
                  src={preview ? preview : profileImage}
                  alt="Profile"
                  className="rounded-full w-auto"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <div className="flex justify-start space-x-2">
                  <Checkbox
                    id="changeImage"
                    checked={changeImage}
                    className="text-brownText border border-burntSienna"
                    onCheckedChange={(checked) =>
                      setChangeImage(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="changeImage"
                    className="text-md md:text-md text-brownText"
                  >
                    Change Profile Image
                  </Label>
                </div>
                <div>
                  {changeImage && (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="text-darkbrownText placeholder:text-darkbrownText"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="custom"
                        className="text-sm md:text-md"
                        disabled={!updateImageUrl || imageUploadLoading}
                        onClick={onImageUpload}
                      >
                        {imageUploadLoading ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center space-x-2 ">
              <h1 className="text-md text-brownText">Username:</h1>
              <h3 className="text-md text-darkbrownText font-styrene-bold">
                {username}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="changePassword"
                checked={changePassword}
                className="text-brownText border border-burntSienna"
                onCheckedChange={(checked) =>
                  setChangePassword(checked as boolean)
                }
              />
              <Label
                htmlFor="changePassword"
                className="text-md md:text-md text-brownText"
              >
                Change Password
              </Label>
            </div>

            {changePassword && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm md:text-md text-brownText"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    className="text-darkbrownText"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm md:text-md text-brownText"
                  >
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    className="text-darkbrownText"
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!currentPassword}
                  />
                </div>

                <Button
                  className="w-full text-sm md:text-md"
                  variant="custom"
                  onClick={handlePasswordChange}
                  disabled={!currentPassword || !newPassword}
                >
                  Change Password
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
