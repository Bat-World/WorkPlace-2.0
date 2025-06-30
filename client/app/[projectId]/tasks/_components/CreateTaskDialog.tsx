"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/hooks/task/useCreateTask";
import { useParams } from "next/navigation";
import {
  useGetProjectMembers,
  ProjectMember,
} from "@/hooks/project/useGetProjectMembers";
import AssigneeDropdown from "./AssigneeDropdown";
import PrioritySelect from "./PrioritySelect";
import StatusSelect from "./StatusSelect";
import LabelsInput from "./LabelsInput";
import DueDatePicker from "./DueDatePicker";

interface FormState {
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: string[];
  labels: string[];
  labelInput: string;
  date: Date | undefined;
}

const initialForm: FormState = {
  title: "",
  description: "",
  priority: "",
  status: "",
  assignee: [],
  labels: [],
  labelInput: "",
  date: undefined,
};

const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const params = useParams();
  const projectId = params.projectId as string;
  const createTaskMutation = useCreateTask();
  const { data: members = [], isLoading: membersLoading } =
    useGetProjectMembers(projectId);

  const handleChange = (field: keyof FormState, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !projectId) return;
    createTaskMutation.mutate(
      {
        title: form.title,
        description: form.description,
        projectId,
        assigneeIds: form.assignee.length > 0 ? form.assignee : undefined,
        dueDate: form.date ? form.date.toISOString() : undefined,
        priority: form.priority || undefined,
        status: form.status || undefined,
        labels: form.labels.length > 0 ? form.labels : undefined,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          setOpen(false);
          createTaskMutation.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-[var(--background)]">
          <Plus /> Таск үүсгэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40rem] bg-[#141318]/0 backdrop-blur-2xl border-[#2A2A2A] dark text-[var(--foreground)] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-[var(--foreground)]/50 font-medium text-base">
            Шинэ таск үүсгэх
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Title"
            className="bg-transparent text-3xl font-semibold border-transparent focus-visible:ring-0 outline-none my-2"
            required
          />
          <PrioritySelect
            value={form.priority}
            onChange={(v: string) => handleChange("priority", v)}
          />
          <AssigneeDropdown
            value={form.assignee}
            onChange={(v: string[]) => handleChange("assignee", v)}
            members={members}
            loading={membersLoading}
          />
          <DueDatePicker
            value={form.date}
            onChange={(v: Date | undefined) => handleChange("date", v)}
          />
          <div className="flex gap-4 mt-4 items-center">
            <p className="text-[var(--foreground)]/50 text-base w-19">
              Details
            </p>
            <StatusSelect
              value={form.status}
              onChange={(v: string) => handleChange("status", v)}
            />
            <LabelsInput
              labels={form.labels}
              input={form.labelInput}
              setLabels={(labels: string[]) => handleChange("labels", labels)}
              setInput={(input: string) => handleChange("labelInput", input)}
            />
          </div>
          <div className="w-full flex flex-col mt-6">
            <p className="text-[var(--foreground)] text-lg font-semibold">
              Description
            </p>
            <Textarea
              name="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="rounded-2xl mt-4"
            />
          </div>
          <div className="w-full flex justify-end mt-4">
            <Button
              variant="secondary"
              className="font-semibold"
              type="submit"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending
                ? "Таск үүсгэж байна..."
                : "Таск үүсгэх"}
            </Button>
          </div>
          {createTaskMutation.error && (
            <div className="text-red-500 text-sm mt-2">
              {createTaskMutation.error.message}
            </div>
          )}
          {createTaskMutation.isSuccess && (
            <div className="text-green-500 text-sm mt-2">Task created!</div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
export {
  AssigneeDropdown,
  PrioritySelect,
  StatusSelect,
  LabelsInput,
  DueDatePicker,
};
