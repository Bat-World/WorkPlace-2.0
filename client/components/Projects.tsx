"use client";

import { Button } from "./ui/button";
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
import { FileBox, Folder, Timer } from "lucide-react";

export const Projects = () => {
  return (
    <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8 mt-[20px]">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-white">Төслүүд</div>
          <div className="text-sm text-gray-500">/ Projects</div>
        </div>
        <Dialog>
          <DialogTrigger asChild >
            <Button className="bg-[#2FC285]">+ Төсөл үүсгэх</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>Enter project details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Project Title" />
              <Input placeholder="Project Description" />
              <Button className="w-full">Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full flex justify-center mt-[15px]">
        <div className="w-[1280px] h-[86px] bg-[#141318] border border-[#3D3C41] rounded-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <img
              src={"/avatar.svg"}
              alt="avatar"
              className="w-[60px] h-[60px] rounded-xl"
            />
            <div className="flex flex-col gap-1">
              <p className="text-white text-[20px] font-semibold leading-6">
                Swipe marketing project
              </p>
              <p className="text-white/50 text-[12px] leading-[17px]">
                Lets do the exact opposite of the first...
              </p>
            </div>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-2 bg-[#101014] rounded-[9px] px-3 h-[36px]">
              <FileBox color="#FFFFFF" strokeWidth={1.5}/>
              <p className="text-white text-[15px]">14</p>
            </div>
            <div className="flex items-center gap-2 bg-[#101014] rounded-[9px] px-3 h-[36px]">
              <Timer color="#A5A5A9" strokeWidth={1.5}/>
              <p className="text-white/50 text-sm">Jan 28</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
