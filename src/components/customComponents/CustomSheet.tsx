"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { CustomSheetDropDown } from "./CustomSheetDropDown";

const CustomSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Settings className="h-5 w-5 md:h-6 md:w-6 text-colors-custom-orange cursor-pointer  transition hover:rotate-90 duration-300" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-[80vh] flex flex-col items-center justify-between gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" placeholder="Johndoe" className="col-span-3 placeholder:text-colors-custom-orange" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                placeholder="********"
                className="col-span-3 placeholder:text-colors-custom-orange"
              />
            </div>
            <SheetClose asChild>
              <Button variant="custom" type="submit">
                Save changes
              </Button>
            </SheetClose>
          </div>
          <div className="">
            <CustomSheetDropDown />
          </div>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
