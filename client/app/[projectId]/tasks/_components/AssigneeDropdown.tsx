import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProjectMember } from "@/hooks/project/useGetProjectMembers";

interface AssigneeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  members: ProjectMember[];
  loading: boolean;
}

const AssigneeDropdown = ({
  value,
  onChange,
  members,
  loading,
}: AssigneeDropdownProps) => (
  <div className="w-full flex mt-6 items-center gap-3">
    <p className="text-[var(--foreground)]/50 text-base w-20">Assignees</p>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {loading
            ? "Loading..."
            : value
            ? members.find((m) => m.id === value)?.name ||
              members.find((m) => m.id === value)?.email ||
              "Select"
            : "Select"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 dark bg-[#141318] rounded-xl mt-1"
      >
        <DropdownMenuCheckboxItem
          checked={!value}
          onCheckedChange={() => onChange("")}
        >
          Unassigned
        </DropdownMenuCheckboxItem>
        {members.map((member) => (
          <DropdownMenuCheckboxItem
            key={member.id}
            checked={value === member.id}
            onCheckedChange={() =>
              onChange(value === member.id ? "" : member.id)
            }
          >
            <span className="flex items-center gap-2">
              {member.avatarUrl && (
                <img
                  src={member.avatarUrl}
                  alt={member.name || member.email}
                  className="w-5 h-5 rounded-full"
                />
              )}
              {member.name || member.email}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    {value && (
      <span className="ml-2 text-xs text-green-400">
        {members.find((m) => m.id === value)?.name ||
          members.find((m) => m.id === value)?.email}
      </span>
    )}
  </div>
);

export default AssigneeDropdown;
