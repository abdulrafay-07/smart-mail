import { useState } from "react";

import type { DateRange } from "react-day-picker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { CalendarIcon, Search, Settings } from "lucide-react";
import { Hint } from "./hint";

export const Header = () => {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  return (
    <header className="h-14 flex items-center gap-4 border-b px-8">
      <SidebarTrigger />
      <div className="flex flex-1 justify-between items-center gap-4">
        <div className="flex items-center gap-x-2">
          {/* Search bar */}
          <div className="flex relative max-w-md lg:min-w-md lg:max-w-xl">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search emails"
              className="pl-9"
            />
          </div>
          
          {/* Date range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dates"
                className="w-56 justify-between font-normal hidden md:flex"
              >
                {range?.from && range?.to
                  ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                  : "Select date range"}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="range"
                selected={range}
                numberOfMonths={2}
                captionLayout="dropdown"
                onSelect={(range) => {
                  setRange(range)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-x-2">
          <Hint label="Preferences">
            <Button variant="ghost" size="icon">
              <Settings className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </header>
  )
};