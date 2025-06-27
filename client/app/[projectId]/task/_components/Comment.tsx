import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline } from "lucide-react";
import React from "react";

const Comment = () => {
  return (
    <div className="w-full p-4 bg-[#141318] border-1 border-[#3D3C41] rounded-3xl">
      <Textarea
        placeholder="Сэтгэгдэл үлдээх"
        className="focus-visible:ring-0 border-0 text-[var(--background)]"
      />
      <div className="w-full flex justify-between items-center mt-5 pl-4">
        <div className="flex items-center gap-3">
          <Italic className="stroke-[var(--background)]/50 w-4 cursor-pointer" />
          <Underline className="stroke-[var(--background)]/50 w-4 cursor-pointer" />
          <Bold className="stroke-[var(--background)]/50 w-4 cursor-pointer" />
        </div>
        <Button className="bg-[#2E2C33] px-6">Илгээх</Button>
      </div>
    </div>
  );
};

export default Comment;
