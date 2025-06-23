import React from "react";
import Info from "./_components/Info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkX,
  Clock,
  Dot,
  Ellipsis,
  PencilRuler,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./_components/Sidebar";
import TaskInfo from "./_components/TaskInfo";

const Task = () => {
  return (
    <div className="w-full flex flex-col justify-center px-4 md:px-10 lg:px-28 xl:px-32">
      <Info />
      <div className="w-full flex gap-6 mt-10">
        <TaskInfo />
        <Sidebar />
      </div>
    </div>
  );
};

export default Task;
