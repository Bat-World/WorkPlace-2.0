import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProjectMember } from "@/hooks/project/useGetProjectMembers";
import { useManageAssignees } from "@/hooks/task/useManageAssignees";

interface AssigneeDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  members: ProjectMember[];
  loading: boolean;
  taskId?: string;
}

const AssigneeDropdown = ({
  value,
  onChange,
  members,
  loading,
  taskId,
}: AssigneeDropdownProps) => {
  const selectedMembers = members.filter((m) => value.includes(m.user.id));
  const manageAssignees = useManageAssignees();

  const getDisplayText = () => {
    if (loading) return "";
    if (value.length === 0) return "Гишүүн сонгох";
    if (value.length === 1) {
      const member = members.find((m) => m.user.id === value[0]);
      return member?.user?.name || member?.user?.email || "Selected";
    }
    // Show up to 3 avatars, then '+N', and show total count
    const displayMembers = selectedMembers.slice(0, 3);
    const extraCount = value.length - displayMembers.length;
    return (
      <span className="flex items-center gap-1">
        {displayMembers.map((member) =>
          member.user.avatarUrl ? (
            <img
              key={member.user.id}
              src={member.user.avatarUrl}
              alt={member.user.name || member.user.email}
              className="w-5 h-5 rounded-full inline-block"
            />
          ) : (
            <span
              key={member.user.id}
              className="w-5 h-5 rounded-full bg-gray-400 text-xs flex items-center justify-center"
            >
              {(member.user.name || member.user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          )
        )}
        {extraCount > 0 && (
          <span className="text-xs text-gray-400">+{extraCount}</span>
        )}
        <span className="ml-1 text-xs text-gray-400">({value.length})</span>
      </span>
    );
  };

  const handleMemberToggle = async (userId: string) => {
    let newValue: string[];
    if (value.includes(userId)) {
      newValue = value.filter((id) => id !== userId);
    } else {
      newValue = [...value, userId];
    }
    onChange(newValue);
    if (taskId) {
      try {
        await manageAssignees.mutateAsync({ taskId, assigneeIds: newValue });
      } catch (e) {
        // Optionally: revert UI or show error
        // onChange(value);
      }
    }
  };

  return (
    <div className="w-full flex mt-6 items-center gap-3">
      <p className="text-[var(--foreground)]/50 text-base w-30">Гүйцэтгэгч</p>
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
              key={member.user.id}
              checked={value.includes(member.user.id)}
              onCheckedChange={() => handleMemberToggle(member.user.id)}
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
    </div>
  );
};

export default AssigneeDropdown;
