import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ellipsis, ChevronDown, Save, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useUpdateTask } from "@/hooks/task/useUpdateTask";
import { formatTaskDueDate } from "@/utils/TaskDateFormatter";

interface DueDateSectionProps {
  task: any;
  dueDate: Date | undefined;
  onDueDateChange: (date: Date | undefined) => void;
}

const DueDateSection = ({
  task,
  dueDate,
  onDueDateChange,
}: DueDateSectionProps) => {
  const [tempDueDate, setTempDueDate] = useState<Date | undefined>(dueDate);
  const [tempTimeValue, setTempTimeValue] = useState("10:30:00");
  const [isOpen, setIsOpen] = useState(false);
  const updateTaskMutation = useUpdateTask();

  // Update temp values when dueDate prop changes
  useEffect(() => {
    if (dueDate) {
      setTempDueDate(dueDate);
      setTempTimeValue(
        `${dueDate.getHours().toString().padStart(2, "0")}:${dueDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:00`
      );
    } else {
      setTempDueDate(undefined);
      setTempTimeValue("10:30:00");
    }
  }, [dueDate]);

  const handleSaveDueDate = async () => {
    try {
      let dateString = undefined;
      if (tempDueDate && tempTimeValue) {
        const [hours, minutes] = tempTimeValue.split(":");
        const newDate = new Date(tempDueDate);
        newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        dateString = newDate.toISOString();

        // Update the parent component
        onDueDateChange(newDate);
      } else if (tempDueDate) {
        dateString = tempDueDate.toISOString();
        onDueDateChange(tempDueDate);
      } else {
        onDueDateChange(undefined);
      }

      if (dateString !== undefined) {
        await updateTaskMutation.mutateAsync({
          taskId: task.id,
          input: { dueDate: dateString },
        });
      }
    } catch (error) {
      console.error("Failed to update due date:", error);
    }
  };

  const formatDisplayDate = (date: Date | undefined): string => {
    if (!date) return "Хугацаа тодорхойгүй";
    return formatTaskDueDate(date.toISOString());
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[var(--background)]/50 text-sm">Дуусах хугацаа</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="dark bg-black/10 backdrop-blur-3xl rounded-3xl text-[var(--foreground)]">
            <DialogHeader>
              <DialogTitle>Дуусах хугацаа</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-32 justify-between font-normal"
                  >
                    {tempDueDate
                      ? tempDueDate.toLocaleDateString()
                      : "Select date"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0 dark bg-[#141318]"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={tempDueDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setTempDueDate(date);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={tempTimeValue}
                onChange={(e) => setTempTimeValue(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button
                  onClick={handleSaveDueDate}
                  variant="secondary"
                  className="w-fit"
                  disabled={updateTaskMutation.isPending}
                >
                  <Save className="w-4 h-4" />
                  {updateTaskMutation.isPending
                    ? "Хадгалж байна..."
                    : "Хадгалах"}
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-[var(--background)] text-sm flex items-center gap-2 mt-2">
        <Clock className="w-4.5" strokeWidth={1.5} />
        {formatDisplayDate(dueDate)}
      </p>
    </>
  );
};

export default DueDateSection;
