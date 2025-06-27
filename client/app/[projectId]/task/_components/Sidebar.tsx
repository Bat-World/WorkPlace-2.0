import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookmarkX, Clock, Ellipsis } from "lucide-react";
import React from "react";

const Sidebar = () => {
  return (
    <div className="w-3/14 flex flex-col">
      <div className="w-full h-auto rounded-3xl bg-[#141318] border border-[#3D3C41] flex flex-col p-6">
        {/* Rev */}
        <div className="flex items-center justify-between">
          <p className="text-[var(--background)]/50 text-sm">Шалгагчид</p>
          <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-7 h-auto aspect-square">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-[var(--background)] text-sm">De1oNn</p>
          </div>
          <div className="w-1.5 h-auto aspect-square bg-[#F9D769] rounded-full"></div>
        </div>
        {/* Assign */}
        <Separator className="my-5 dark" />
        <div className="flex items-center justify-between">
          <p className="text-[var(--background)]/50 text-sm">Хүлээж авсан</p>
          <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-7 h-auto aspect-square">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-[var(--background)] text-sm">De1oNn</p>
          </div>
          <div className="w-1.5 h-auto aspect-square bg-[#F9D769] rounded-full"></div>
        </div>
        {/* Label */}
        <Separator className="my-5 dark" />
        <div className="flex items-center justify-between">
          <p className="text-[var(--background)]/50 text-sm">Шошгонууд</p>
          <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
        </div>
        <div className="w-full flex gap-2 mt-2">
          <div className="w-fit px-3 py-1 rounded-full bg-[#450B2B] border border-[#5A2241] text-[#FCC3EC] text-xs">
            Яаралтай
          </div>
        </div>
        {/* Dead */}
        <Separator className="my-5 dark" />
        <div className="flex items-center justify-between">
          <p className="text-[var(--background)]/50 text-sm">Дуусах хугацаа</p>
          <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
        </div>
        <p className="text-[var(--background)] text-sm flex items-center gap-2 mt-2">
          <Clock className="w-4.5" strokeWidth={1.5} />
          8-р сарын 16, 2025
        </p>
      </div>
      {/* End */}
      <Button className="mt-5 py-5 bg-[#1D1B22] border border-[#3D3C41] hover:bg-[#232029] rounded-lg">
        <BookmarkX strokeWidth={1.5} className="stroke-[#EA3E3E] w-5! h-5!" />
        Таскыг хаах
      </Button>
    </div>
  );
};

export default Sidebar;
