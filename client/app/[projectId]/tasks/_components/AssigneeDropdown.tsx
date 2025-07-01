import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProjectMember } from "@/hooks/project/useGetProjectMembers";

interface AssigneeDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  members: ProjectMember[];
  loading: boolean;
}

const AssigneeDropdown = ({
  value,
  onChange,
  members,
  loading,
}: AssigneeDropdownProps) => {
  const selectedMembers = members.filter((m) => value.includes(m.id));
  
  const getDisplayText = () => {
    if (loading) return "";
    if (value.length === 0) return "Гишүүн сонгох";
    if (value.length === 1) {
      const member = members.find((m) => m.id === value[0]);
      return member?.user?.name || member?.user?.email || "Selected";
    }
    return `${value.length} assignees selected`;
  };

  const handleMemberToggle = (memberId: string) => {
    if (value.includes(memberId)) {
      onChange(value.filter((id) => id !== memberId));
    } else {
      onChange([...value, memberId]);
    }
  };

  return (
    <div className="w-full flex mt-6 items-center gap-3">
      <p className="text-[var(--foreground)]/50 text-base w-20">Assignees</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-between">
            {getDisplayText()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 dark bg-[#141318] rounded-xl mt-1"
        >
          {members.map((member) => (
            <DropdownMenuCheckboxItem
              key={member.id}
              checked={value.includes(member.id)}
              onCheckedChange={() => handleMemberToggle(member.id)}
            >
              <span className="flex items-center gap-2">
                {member.user?.avatarUrl && (
                  <img
                    src={member.user.avatarUrl}
                    alt={member.user?.name || member.user?.email}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                {member.user?.name || member.user?.email}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-2">
          {selectedMembers.map((member) => (
            <span
              key={member.id}
              className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full"
            >
              {member.user?.name || member.user?.email}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssigneeDropdown;
