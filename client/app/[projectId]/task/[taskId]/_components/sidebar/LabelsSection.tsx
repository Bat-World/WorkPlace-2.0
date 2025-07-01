import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ellipsis, X, Save } from "lucide-react";
import { useAddLabel } from "@/hooks/task/useAddLabel";

interface LabelsSectionProps {
  task: any;
  labels: string[];
  onLabelsChange: (labels: string[]) => void;
}

const LabelsSection = ({
  task,
  labels,
  onLabelsChange,
}: LabelsSectionProps) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [tempLabels, setTempLabels] = useState<string[]>(labels);
  const addLabelMutation = useAddLabel();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tempLabels.includes(input.trim())) {
        setTempLabels([...tempLabels, input.trim()]);
      }
      setInput("");
    }
  };

  const handleRemove = (label: string) => {
    setTempLabels(tempLabels.filter((l) => l !== label));
  };

  const handleSaveLabels = async () => {
    try {
      const newLabels = tempLabels.filter((label) => !labels.includes(label));

      for (const labelName of newLabels) {
        await addLabelMutation.mutateAsync({
          taskId: task.id,
          labelName,
          labelColor: "#2FC285",
        });
      }

      onLabelsChange(tempLabels);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save labels:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[var(--background)]/50 text-sm">Шошгонууд</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-70 dark mt-1 bg-[#141318] rounded-xl"
          >
            <div className="flex flex-col justify-center items-center gap-3 w-full">
              <Input
                name="labels"
                className="focus-visible:ring-0 w-full"
                placeholder=""
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex flex-wrap gap-2 mt-2 w-full">
                {tempLabels.map((label) => (
                  <span
                    key={label}
                    className="bg-[#2FC285]/20 text-[#2FC285] px-3 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {label}
                    <button
                      type="button"
                      className="ml-1 text-[var(--foreground)]/50 hover:text-red-500 cursor-pointer"
                      onClick={() => handleRemove(label)}
                    >
                      <X className="w-3" />
                    </button>
                  </span>
                ))}
              </div>
              {tempLabels.length <= 0 && (
                <p className="text-[var(--foreground)]/50 text-xs">
                  Шинэ шошго үүсгэхийн тулд Enter эсвэл таслал дээр дарна уу
                </p>
              )}
              <Button
                onClick={handleSaveLabels}
                disabled={addLabelMutation.isPending}
                className="w-full bg-[#2FC285] hover:bg-[#2FC285]/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {addLabelMutation.isPending ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex gap-2 mt-2">
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <div
              key={label}
              className="w-fit px-3 py-1 rounded-full bg-[#450B2B] border border-[#5A2241] text-[#FCC3EC] text-xs"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LabelsSection;
