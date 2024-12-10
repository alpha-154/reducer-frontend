"use client";

import * as React from "react";
import { EllipsisVertical } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomDeleteDialog from "./CustomDeleteDialog";

interface CustomOptionsDropDownProps {
  labels: string[];
  actions: string;
  dropDownMenuSubtriggerText: string;
  commandInputPlaceholderText: string;
  commandEmptyText: string;
  addToList: (label: string) => void;
  endConnection: () => void;
}

const OptionsDropDownMenu = ({
  labels,
  actions,
  dropDownMenuSubtriggerText,
  commandInputPlaceholderText,
  commandEmptyText,
  addToList,
  endConnection,
}: CustomOptionsDropDownProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="h-5 w-5 text-textBlue transition-colors duration-200 hover:text-textBlue/80" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] bg-albasterInnerBg border-boneInnerBg"
        >
          <DropdownMenuLabel className="text-xs text-brownText">
            {actions}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs text-brownText">
                {dropDownMenuSubtriggerText}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0 max-sm:-mr-14 max-sm:mt-5 border border-boneInnerBg rounded-xl">
                <Command className=" bg-albasterInnerBg border border-boneInnerBg rounded-xl">
                  <CommandInput
                    placeholder={commandInputPlaceholderText}
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty className="text-sm text-brownText p-2">
                      {commandEmptyText}
                    </CommandEmpty>
                    <CommandGroup>
                      {labels.map((label) => (
                        <CommandItem
                          key={label}
                          value={label}
                          onSelect={(value) => {
                            addToList(value);
                            setOpen(false);
                          }}
                          className="text-xs text-brownText cursor-pointer hover:bg-boneInnerBg"
                        >
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <CustomDeleteDialog
              isAlertDialogTriggerContentIsButton={true}
              alertTriggerButtonText="End Connection"
              alertDialogDescription="Once you end connection with this user, you will no longer be able to see their messages."
              onDelete={endConnection}
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OptionsDropDownMenu;
