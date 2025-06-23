import React from "react";
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
import { Input } from "@/components/ui/input";
import { Clock, FileBox, Folder, Plus, Timer } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const Info = () => {
  return (
    <div className="w-full mt-10 flex justify-between items-center">
      <div className="flex flex-col">
        <Breadcrumb className="dark">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Tinder</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Swipe</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
          Swipe integrations
        </p>
      </div>
      <div className="flex justify-end gap-6">
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale dark">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="secondary" className="text-[var(--background)]">
                <Plus />
                Таск үүсгэх
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#141318] border-[#2A2A2A] dark text-[var(--foreground)] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="">Шинэ таск үүсгэх</DialogTitle>
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
                  <Button
                    variant={"outline"}
                    className="flex-1 py-5 rounded-xl"
                  >
                    Буцах
                  </Button>
                </DialogClose>
                <Button className="flex-1 py-5 rounded-xl">Үүсгэх</Button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Info;
