"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"sm"}>
              {theme === "light" ? (
                <Sun
                  key="light"
                  size={ICON_SIZE}
                  className={
                    "text-muted-foreground fill-muted-foreground hover:fill-primary hover:text-primary active:fill-primary active:text-primary"
                  }
                />
              ) : theme === "dark" ? (
                <Sun
                  key="dark"
                  size={ICON_SIZE}
                  className={
                    "text-muted-foreground fill-muted-foreground hover:fill-primary hover:text-primary active:fill-primary active:text-primary"
                  }
                />
              ) : (
                <Sun
                  key="system"
                  size={ICON_SIZE}
                  className={
                    "text-muted-foreground fill-muted-foreground hover:fill-primary hover:text-primary active:fill-primary active:text-primary"
                  }
                />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Change Theme</TooltipContent>
        <DropdownMenuContent className="w-content" align="start">
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(e) => setTheme(e)}
          >
            <DropdownMenuRadioItem className="flex gap-2" value="light">
              <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
              <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="flex gap-2" value="dark">
              <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
              <span>Dark</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
};

export { ThemeSwitcher };
