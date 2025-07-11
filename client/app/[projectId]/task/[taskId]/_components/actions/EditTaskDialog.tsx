import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PencilRuler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EditTaskDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-[#2E2C33]">
            <PencilRuler strokeWidth={1.5} />
            Засварлах
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#141318] border-[#2A2A2A] dark text-[var(--foreground)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Шинэ таск үүсгэх</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Гарчиг</Label>
              <Input id="name-1" name="name" />
            </div>
            <div className="grid gap-3 mt-2">
              <Label htmlFor="username-1">Тайлбар</Label>
              <Textarea
                id="username-1"
                name="username"
                placeholder="Таскын товч тайлбар"
              />
            </div>
          </div>
          <div className="w-full gap-3 flex">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 py-5 rounded-xl">
                Буцах
              </Button>
            </DialogClose>
            <Button className="flex-1 py-5 rounded-xl">Үүсгэх</Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditTaskDialog; 