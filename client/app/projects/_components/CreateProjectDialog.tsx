"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, XCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreateProjectDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [currentLabel, setCurrentLabel] = useState("");
  const createProject = useCreateProject();
  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent
  ) => {
    e.preventDefault();
    if (currentEmail.trim() && isValidEmail(currentEmail.trim())) {
      setEmails([...emails, currentEmail.trim()]);
      setCurrentEmail("");
    } else if (currentEmail.trim()) {
      toast.error("Please enter a valid email address");
    }
  };

  const handleAddLabel = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent
  ) => {
    e.preventDefault();
    if (currentLabel.trim() && currentLabel.length <= 20) {
      setLabels([...labels, currentLabel.trim()]);
      setCurrentLabel("");
    } else if (currentLabel.trim()) {
      toast.error("Label must be 20 characters or less");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Project title is required");
      return;
    }

    try {
      await createProject.mutateAsync({
        title,
        description,
        invitees: emails,
        labels,
      });
      setTitle("");
      setDescription("");
      setEmails([]);
      setLabels([]);
      setCurrentEmail("");
      setCurrentLabel("");
      toast.success("Project created successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Error creating project: " + String(error));
    }
  };

  return (
    <div className="flex justify-end gap-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="text-[var(--background)] flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Төсөл үүсгэх
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl bg-[#141318] border-[#3D3C41] dark text-[var(--foreground)] rounded-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Шинэ төсөл үүсгэх</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 mt-5">
              <div className="grid gap-3">
                <Label htmlFor="title">Гарчиг</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#1C1C24] border-[#2A2A2A] text-white focus:ring-0 focus:border-[#2A2A2A] focus:bg-[#25252D] transition-colors"
                  placeholder="Project title"
                />
              </div>
              <div className="grid gap-3 mt-2">
                <Label htmlFor="description">Тайлбар</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Төслийн товч тайлбар"
                  className="bg-[#1C1C24] border-[#2A2A2A] text-white focus:ring-0 focus:border-[#2A2A2A] focus:bg-[#25252D] transition-colors"
                />
              </div>
              <div className="grid gap-3 mt-2">
                <Label htmlFor="invitees">Гишүүдийн имэйлүүд</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="invitees"
                    placeholder="гишүүн@mail.com"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEmail(e)}
                    className="bg-[#1C1C24] border-[#2A2A2A] text-white focus:ring-0 focus:border-[#2A2A2A] focus:bg-[#25252D] transition-colors"
                  />
                  <Button
                    type="button"
                    onClick={handleAddEmail}
                    className="bg-[var(--foreground)]/10 text-white rounded-lg hover:bg-[var(--foreground)]/20 transition-colors"
                  >
                    Нэмэх
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {emails.map((email) => (
                      <motion.div
                        key={email}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1 bg-[#25252D] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {email}
                        <XCircle
                          className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveEmail(email)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="grid gap-3 mt-2">
                <Label htmlFor="labels">Шошгууд</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="labels"
                    placeholder="Шинэ шошго үүсгэхийн тулд Enter дээр дарна уу"
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddLabel(e)}
                    className="bg-[#1C1C24] border-[#2A2A2A] text-white focus:ring-0 focus:border-[#2A2A2A] focus:bg-[#25252D] transition-colors"
                  />
                  <Button
                    type="button"
                    onClick={handleAddLabel}
                    className="bg-[var(--foreground)]/10 text-white rounded-lg hover:bg-[var(--foreground)]/20 transition-colors"
                  >
                    Нэмэх
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {labels.map((label) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1 bg-[#25252D] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {label}
                        <XCircle
                          className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveLabel(label)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="w-full gap-3 flex mt-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 py-5 rounded-xl text-white border-[#2A2A2A] hover:bg-[#25252D]"
                >
                  Буцах
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={"secondary"}
                className="flex-1 py-5 rounded-xl text-white flex items-center justify-center gap-2"
                disabled={createProject.isPending || !title}
              >
                {createProject.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Үүсгэж байна...
                  </>
                ) : (
                  "Үүсгэх"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;
