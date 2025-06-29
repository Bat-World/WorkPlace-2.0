"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import {
  useGetComments,
  type Comment as CommentType,
} from "@/hooks/task/useGetComments";
import { useLikeComment } from "@/hooks/task/useLikeComment";
import { useUnlikeComment } from "@/hooks/task/useUnlikeComment";
import { useAddComment } from "@/hooks/task/useAddComment";
import { useParams } from "next/navigation";
import { formatRelativeTime } from "@/utils/DateFormatter";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const CommentItem = ({
  comment,
  isReply = false,
  onLike,
  onUnlike,
  onReply,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  addCommentMutation,
}: {
  comment: CommentType;
  isReply?: boolean;
  onLike: (commentId: string) => void;
  onUnlike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  setReplyingTo: (commentId: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  addCommentMutation: any;
}) => (
  <div
    className={`w-full p-6 bg-[#141318] rounded-4xl ${
      isReply
        ? "ml-8 border-l-2 border-[#3D3C41] bg-transparent rounded-none"
        : ""
    }`}
  >
    <div className="flex gap-3">
      <Avatar>
        <AvatarImage
          src={comment.author.avatarUrl || undefined}
          alt={comment.author.name || comment.author.email}
        />
        <AvatarFallback>
          {comment.author.name
            ? comment.author.name.charAt(0).toUpperCase()
            : comment.author.email.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex gap-3">
          <p className="text-sm text-[var(--background)] font-semibold">
            {comment.author.name || comment.author.email}
          </p>
          <p className="text-sm text-[var(--background)]/50">
            {formatRelativeTime(comment.createdAt)}
          </p>
        </div>
        <p className="text-sm text-[var(--background)]">{comment.content}</p>
      </div>
    </div>
    <div className="w-full flex justify-between items-center mt-5">
      <div className="flex items-center gap-3">
        <Button
          className="px-6"
          onClick={() =>
            comment.isLikedByUser ? onUnlike(comment.id) : onLike(comment.id)
          }
        >
          <Heart className={comment.isLikedByUser ? "fill-current" : ""} />
          {comment.likeCount}
        </Button>
        {!isReply && (
          <p
            className="text-sm text-blue-500 cursor-pointer"
            onClick={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
          >
            Reply
          </p>
        )}
      </div>
    </div>

    {!isReply && replyingTo === comment.id && (
      <div className="mt-4 p-4 bg-[#2E2C33] rounded-2xl">
        <Textarea
          placeholder="Write a reply..."
          className="focus-visible:ring-0 border-0 text-[var(--background)]"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          disabled={addCommentMutation.isPending}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setReplyingTo(null);
              setReplyContent("");
            }}
            disabled={addCommentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onReply(comment.id)}
            disabled={addCommentMutation.isPending || !replyContent.trim()}
          >
            {addCommentMutation.isPending ? "Sending..." : "Reply"}
          </Button>
        </div>
      </div>
    )}

    {/* Replies */}
    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-4 space-y-3">
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            isReply={true}
            onLike={onLike}
            onUnlike={onUnlike}
            onReply={onReply}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            addCommentMutation={addCommentMutation}
          />
        ))}
      </div>
    )}
  </div>
);

const CommentWidget = () => {
  const params = useParams();
  const taskId = params.taskId as string;
  const { data: comments = [], isLoading, error } = useGetComments(taskId);
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();
  const addCommentMutation = useAddComment();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleLike = async (commentId: string) => {
    try {
      await likeCommentMutation.mutateAsync(commentId);
    } catch (error: any) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment. Please try again.");
    }
  };

  const handleUnlike = async (commentId: string) => {
    try {
      await unlikeCommentMutation.mutateAsync(commentId);
    } catch (error: any) {
      console.error("Error unliking comment:", error);
      toast.error("Failed to unlike comment. Please try again.");
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    const contentToSend = replyContent.trim();
    setReplyContent("");
    setReplyingTo(null);

    try {
      await addCommentMutation.mutateAsync({
        taskId,
        content: contentToSend,
        parentId: commentId,
      });
    } catch (error: any) {
      console.error("Error adding reply:", error);
      toast.error("Failed to post reply. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-[#141318] rounded-3xl">
        <p className="text-[var(--background)]/50">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-[#141318] rounded-3xl">
        <p className="text-red-500">Error loading comments</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="w-full p-4 bg-[#141318] rounded-xl">
        <p className="text-[var(--background)]/50 text-sm ml-3">
          Одоогоор сэтгэгдэл алга байна.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {comments.map((comment: CommentType) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onReply={handleReply}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          addCommentMutation={addCommentMutation}
        />
      ))}
    </div>
  );
};

export default CommentWidget;
