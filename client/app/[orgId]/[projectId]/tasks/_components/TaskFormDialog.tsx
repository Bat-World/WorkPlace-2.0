import { useState, useMemo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, Plus } from "lucide-react";
import { z } from "zod";
import { Formik, Form, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { format } from "date-fns";
import { useCreateTask } from "@/hooks/task/useCreateTask";
import { useGetMembersByOrgId } from "@/hooks/project/useGetMembersByOrgId";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STATUS_OPTIONS = [
  { value: "TODO", label: "Todo" },
  { value: "DOING", label: "Хийгдэж байгаа" },
  { value: "REVIEW", label: "Шалгуулхад бэлэн" },
];
const PRIORITY_OPTIONS = [
  { value: "HIGH", label: "Яаралтай" },
  { value: "MEDIUM", label: "Чухал" },
  { value: "LOW", label: "Энгийн" },
];
const DEFAULT_TIME = "12:00:00";

const TaskSchema = z.object({
  title: z.string().min(1, "Гарчиг шаардлагатай"),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
  reviewerId: z.string().optional(),
});
type TaskFormValues = z.infer<typeof TaskSchema>;

export function TaskFormDialog({
  open,
  setOpen,
  orgId,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  orgId: string;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState(DEFAULT_TIME);
  const params = useParams();
  const projectId = params?.projectId as string;
  const { data: members = [] } = useGetMembersByOrgId(orgId);
  const adminMembers = useMemo(
    () => members.filter((m: any) => m.role === "ADMIN"),
    [members]
  );
  const { mutate: createTask, isPending } = useCreateTask();
  const queryClient = useQueryClient();

  const initialValues: TaskFormValues = {
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assignedToId: "",
    reviewerId: "",
  };

  const handleDateSelect = (date: Date | undefined, setFieldValue: any) => {
    setSelectedDate(date);
    if (!date) {
      setFieldValue("dueDate", "");
      return;
    }
    const isoString = new Date(
      `${date.toISOString().split("T")[0]}T${time}`
    ).toISOString();
    setFieldValue("dueDate", isoString);
    setCalendarOpen(false);
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (!selectedDate) return;
    const isoString = new Date(
      `${selectedDate.toISOString().split("T")[0]}T${newTime}`
    ).toISOString();
    setFieldValue("dueDate", isoString);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-[var(--background)]">
          <Plus /> Таск үүсгэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#141318] border-[#2A2A2A] dark text-[var(--foreground)] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Шинэ таск үүсгэх</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(TaskSchema)}
          onSubmit={(values, { resetForm }) => {
            const input = {
              title: values.title,
              description: values.description || undefined,
              projectId,
              priority: values.priority,
              assignedToId: values.assignedToId || undefined,
              dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
            };
            createTask(input, {
              onSuccess: () => {
                toast.success("Таск амжилттай үүслээ");
                setOpen(false);
                resetForm();
                setSelectedDate(undefined);
                setTime(DEFAULT_TIME);
                queryClient.invalidateQueries({
                  queryKey: ["tasks", projectId],
                });
              },
              onError: () => {
                toast.error("Таск үүсгэхэд алдаа гарлаа");
              },
            });
          }}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="grid gap-4 mt-5">
              <Input
                name="title"
                placeholder="Гарчиг"
                value={values.title}
                onChange={handleChange}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
              <Textarea
                name="description"
                placeholder="Тайлбар"
                value={values.description}
                onChange={handleChange}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="w-full">
                  <Select
                    value={values.status}
                    onValueChange={(val) => setFieldValue("status", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Төлөв" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="w-full">
                  <Select
                    value={values.priority}
                    onValueChange={(val) => setFieldValue("priority", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Яаралтай байдал" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="date-picker" className="px-1">
                    Date
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-full justify-between font-normal"
                      >
                        {selectedDate
                          ? format(selectedDate, "yyyy-MM-dd")
                          : "Select date"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        onSelect={(date) =>
                          handleDateSelect(date, setFieldValue)
                        }
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="time-picker" className="px-1">
                    Time
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    value={time}
                    onChange={(e) => handleTimeChange(e, setFieldValue)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
              </div>
              <Select
                value={values.assignedToId}
                onValueChange={(val) => setFieldValue("assignedToId", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Хүлээлгэж өгөх" />
                </SelectTrigger>
                <SelectContent className="dark">
                  {members.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage
                            src={m.avatarUrl || ""}
                            alt={m.name || m.email}
                          />
                          <AvatarFallback>
                            {m.name?.slice(0, 2) || m.email?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{m.name || m.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={values.reviewerId}
                onValueChange={(val) => setFieldValue("reviewerId", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Шалгагч" />
                </SelectTrigger>
                <SelectContent className="dark">
                  {adminMembers.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage
                            src={m.avatarUrl || ""}
                            alt={m.name || m.email}
                          />
                          <AvatarFallback>
                            {m.name?.slice(0, 2) || m.email?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{m.name || m.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="w-full flex gap-3 mt-5">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 py-5 rounded-xl"
                  >
                    Буцах
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="flex-1 py-5 rounded-xl"
                  disabled={isPending}
                >
                  {isPending ? "Үүсгэж байна..." : "Үүсгэх"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
