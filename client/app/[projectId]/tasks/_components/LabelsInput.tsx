import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tags, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

interface LabelsInputProps {
  labels: string[];
  input: string;
  setLabels: (labels: string[]) => void;
  setInput: (input: string) => void;
}

const LabelsInput = ({
  labels,
  input,
  setLabels,
  setInput,
}: LabelsInputProps) => {
  const [open, setOpen] = useState(false);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!labels.includes(input.trim())) {
        setLabels([...labels, input.trim()]);
      }
      setInput("");
    }
  };
  const handleRemove = (label: string) =>
    setLabels(labels.filter((l) => l !== label));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Tags /> Шошгууд
        </Button>
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
            {labels.map((label) => (
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
          {labels.length <= 0 && (
            <p className="text-[var(--foreground)]/50 text-xs">
              Утгаа оруулсны дараа Enter дарна уу.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LabelsInput;
