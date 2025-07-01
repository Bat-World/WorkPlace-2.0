import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusSelect = ({ value, onChange }: StatusSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Төлөв сонгох" />
    </SelectTrigger>
    <SelectContent className="dark bg-[#141318]">
      <SelectGroup>
        <SelectItem value="TODO">Шинэ хүсэлт</SelectItem>
        <SelectItem value="DOING">Хийж байгаа</SelectItem>
        <SelectItem value="REVIEW">Шалгуулхад бэлэн</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default StatusSelect;
