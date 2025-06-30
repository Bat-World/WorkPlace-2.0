'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline } from "lucide-react";
import React, { useState } from "react";
import { useAddComment } from "@/hooks/task/useAddComment";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const Comment = () => {
  const [content, setContent] = useState("");
  const params = useParams();
  const taskId = params.taskId as string;
  const addCommentMutation = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        taskId,
        content: content.trim(),
      }, {
        onSuccess: () => {
          setContent("");
          // No success toast - it's instant now!
        },
      });
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 bg-[#141318] border-1 border-[#3D3C41] rounded-3xl">
      <Textarea
        placeholder="Сэтгэгдэл үлдээх"
        className="focus-visible:ring-0 border-0 text-[var(--background)]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={addCommentMutation.isPending}
      />
      <div className="w-full flex justify-between items-center mt-5 pl-4">
        <div className="flex items-center gap-3">
          <Italic className="stroke-[var(--background)]/50 w-4 cursor-pointer" />
          <Underline className="stroke-[var(--background)]/50 w-4 cursor-pointer" />
          <Bold className="stroke-[var(--background)]/50 w-4 cursor-pointer" />
        </div>
        <Button 
          type="submit"
          className="bg-[#2E2C33] px-6"
          disabled={addCommentMutation.isPending || !content.trim()}
        >
          {addCommentMutation.isPending ? "Илгээж байна..." : "Илгээх"}
        </Button>
      </div>
    </form>
  );
};

export default Comment;
