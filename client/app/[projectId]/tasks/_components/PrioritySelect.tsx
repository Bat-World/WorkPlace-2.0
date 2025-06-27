import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrioritySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => (
  <div className="mt-3">
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent className="dark">
        <SelectGroup>
          <SelectItem value="LOW">Энгийн</SelectItem>
          <SelectItem value="MEDIUM">Чухал</SelectItem>
          <SelectItem value="HIGH">Яаралтай</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default PrioritySelect;
