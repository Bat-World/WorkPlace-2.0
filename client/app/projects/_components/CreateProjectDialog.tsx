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
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/project/ useCreateProject";

const CreateProjectDialog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createProject = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      await createProject.mutateAsync({ title, description });
      setTitle("");
      setDescription("");
      window.location.reload();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="flex justify-end gap-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="text-[var(--background)]">
            <Plus /> Төсөл үүсгэх
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#141318] border-[#2A2A2A] dark text-[var(--foreground)] rounded-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="">Шинэ төсөл үүсгэх</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 mt-5">
              <div className="grid gap-3">
                <Label htmlFor="title">Гарчиг</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-3 mt-2">
                <Label htmlFor="description">Тайлбар</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Төслийн товч тайлбар"
                />
              </div>
            </div>
            <div className="w-full gap-3 flex mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 py-5 rounded-xl">
                  Буцах
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="flex-1 py-5 rounded-xl"
                disabled={createProject.isPending} // Changed from isLoading to isPending
              >
                Үүсгэх
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;