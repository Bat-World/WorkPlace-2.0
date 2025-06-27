import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DueDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const DueDatePicker = ({ value, onChange }: DueDatePickerProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full flex mt-3 items-center gap-3">
      <p className="text-[var(--foreground)]/50 text-base w-20">Due date</p>
      <div className="flex gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {value ? value.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 dark bg-[#141318]"
            align="start"
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
};

export default DueDatePicker;
