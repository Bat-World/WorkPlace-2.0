import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface DueDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const DueDatePicker = ({ value, onChange }: DueDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState("10:30:00");

  // Update time value when the date value changes
  useEffect(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}:00`);
    } else {
      setTimeValue("10:30:00");
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && timeValue) {
      // Combine the selected date with the time
      const [hours, minutes] = timeValue.split(":");
      const combinedDate = new Date(date);
      combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onChange(combinedDate);
    } else {
      onChange(date);
    }
    setOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (value && newTime) {
      // Update the existing date with new time
      const [hours, minutes] = newTime.split(":");
      const updatedDate = new Date(value);
      updatedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onChange(updatedDate);
    }
  };

  return (
    <div className="w-full flex mt-3 items-center gap-3">
      <p className="text-[var(--foreground)]/50 text-base w-30">Дуусах хугацаа </p>
      <div className="flex gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {value ? value.toLocaleDateString() : "Сар өдөр"}
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
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
};

export default DueDatePicker;
