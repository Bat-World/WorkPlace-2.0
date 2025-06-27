import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusSelect = ({ value, onChange }: StatusSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent className="dark bg-[#141318]">
      <SelectGroup>
        <SelectItem value="TODO">Not started</SelectItem>
        <SelectItem value="DOING">Doing</SelectItem>
        <SelectItem value="REVIEW">Review</SelectItem>
        <SelectItem value="DONE">Done</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default StatusSelect; 