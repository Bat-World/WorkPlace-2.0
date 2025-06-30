"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  PencilRuler,
  FileText,
  Eye,
  Download,
  Check,
  CircleCheck,
} from "lucide-react";
import React, { useState } from "react";
import Comment from "./Comment";
import CommentWidget from "./CommentWdiget";
import EditBody from "./EditBody";
import { useGetTaskById } from "@/hooks/task/useGetTaskById";
import { useParams } from "next/navigation";
import { useMarkAsDone } from "@/hooks/task/useMarkAsDone";
import { useUser } from "@clerk/nextjs";
import { formatTaskDate } from "@/utils/TaskDateFormatter";
import TaskInfoSkeleton from "@/components/Skeletons/TaskInfoSkeleton";

const TaskInfo = () => {
  const params = useParams();
  const taskId = params.taskId as string;
  const { data: task, isLoading, error } = useGetTaskById(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const markAsDoneMutation = useMarkAsDone();
  const { user } = useUser();

  // Check if current user is assignee and task is approved
  const isCurrentUserAssignee = task?.assignees?.some(
    (assignee) => assignee.id === user?.id
  );
  const canMarkAsDone = isCurrentUserAssignee && task?.status === "APPROVED";

  const handleMarkAsDone = async () => {
    try {
      await markAsDoneMutation.mutateAsync({ taskId });
    } catch (error) {
      console.error("Failed to mark task as done:", error);
    }
  };

  const parseAttachment = (attachment: string, index: number) => {
    try {
      const fileMetadata = JSON.parse(attachment);
      if (fileMetadata.url && fileMetadata.name) {
        return {
          url: fileMetadata.url,
          name: fileMetadata.name,
          type: fileMetadata.type || "application/octet-stream",
        };
      }
    } catch (e) {}

    const isUploadThingUrl = attachment.includes("ufs.sh/f/");
    const fileName = isUploadThingUrl
      ? `File ${index + 1}`
      : attachment.split("/").pop()?.split("?")[0] || `File ${index + 1}`;

    return {
      url: attachment,
      name: fileName,
      type: "application/octet-stream",
    };
  };

  const getFileType = (type: string): string => {
    if (type.startsWith("image/")) return "Image file";
    if (type.includes("pdf")) return "PDF document";
    if (type.includes("text/") || type.includes("json")) return "Text file";
    if (type.includes("word")) return "Word document";
    if (type.includes("excel")) return "Excel spreadsheet";
    if (type.includes("powerpoint")) return "PowerPoint presentation";
    if (type.includes("zip") || type.includes("rar")) return "Archive file";
    return "File attachment";
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  const getImageAttachments = () => {
    if (!task?.attachments) return [];

    return task.attachments
      .map((attachment, index) => parseAttachment(attachment, index))
      .filter((item) => {
        const isImageUrl = item.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
        const isCloudinaryImage =
          item.url.includes("cloudinary.com") && item.url.includes("/upload/");
        const isImageType = item.type.startsWith("image/");

        return isImageUrl || isCloudinaryImage || isImageType;
      });
  };

  const getFileAttachments = () => {
    if (!task?.attachments) return [];

    return task.attachments
      .map((attachment, index) => parseAttachment(attachment, index))
      .filter((item) => {
        const isImageUrl = item.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
        const isCloudinaryImage =
          item.url.includes("cloudinary.com") && item.url.includes("/upload/");
        const isImageType = item.type.startsWith("image/");

        return !(isImageUrl || isCloudinaryImage || isImageType);
      });
  };

  if (isLoading) {
    return (
      <div className="w-10/12 flex gap-4">
        <TaskInfoSkeleton />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="w-10/12 flex gap-4">
        <TaskInfoSkeleton />
      </div>
    );
  }

  if (isEditing) {
    return <EditBody onBack={() => setIsEditing(false)} />;
  }

  const imageAttachments = getImageAttachments();
  const fileAttachments = getFileAttachments();

  return (
    <div className="w-10/12 flex gap-4 mb-20">
      <Avatar className="w-11 h-11">
        <AvatarImage
          src={task.createdBy.avatarUrl || undefined}
          alt={task.createdBy.name || task.createdBy.email}
        />
        <AvatarFallback>
          {task.createdBy.name
            ? task.createdBy.name.charAt(0).toUpperCase()
            : task.createdBy.email.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full h-auto rounded-3xl bg-[#141318] border border-[#3D3C41] flex flex-col p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="text-[var(--background)]/50 text-base">
                {task.createdBy.name}
              </p>
              <p className="text-[var(--background)]/50 text-base">
                {formatTaskDate(task.createdAt)}
              </p>
            </div>
            <Button className="bg-[#2E2C33]" onClick={() => setIsEditing(true)}>
              <PencilRuler strokeWidth={1.5} />
              Засварлах
            </Button>
          </div>

          {task.body && (
            <div
              className="text-[var(--background)] mt-6 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: task.body }}
            />
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div className="mt-8">
              {imageAttachments.length > 0 && (
                <Carousel
                  opts={{ align: "start" }}
                  className="w-full overflow-hidden"
                >
                  <CarouselContent className="w-full">
                    {imageAttachments.map((attachment, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-[30%]"
                      >
                        <div
                          className="w-full aspect-square rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${attachment.url})` }}
                        ></div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}

              {fileAttachments.length > 0 && (
                <div className="mt-10 space-y-2">
                  {fileAttachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#191D21] rounded-xl hover:bg-[#1f2429]"
                    >
                      <div className="w-10 h-10 bg-[#3D3C41] rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[var(--background)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[var(--background)] text-sm font-medium">
                          {attachment.name}
                        </p>
                        <p className="text-[var(--background)]/50 text-xs">
                          {getFileType(attachment.type)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(attachment.url, "_blank")}
                          className="text-[var(--background)]/50 hover:text-[var(--background)]/80 hover:bg-[var(--background)]/5"
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            downloadFile(attachment.url, attachment.name)
                          }
                          className="text-[#2FC285] hover:text-[#2FC285]/80 hover:bg-[var(--background)]/5"
                        >
                          <Download />
                          Татах
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {canMarkAsDone && (
          <div className="w-full flex flex-col justify-start gap-3 bg-[#141318] border border-[#1d1c1f] rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <CircleCheck className="stroke-[#0A8451] w-8 h-auto aspect-square" />
              <div className="flex flex-col">
                <p className="text-[var(--background)] text-base font-semibold">
                  Таск амжилттай батлагдлаа
                </p>
                <p className="text-[var(--background)]/50 text-sm">
                  Таск амжилттай батлагдлаа
                </p>
              </div>
            </div>
            <Button
              onClick={handleMarkAsDone}
              disabled={markAsDoneMutation.isPending}
              className="w-fit bg-[#0A8451] hover:bg-[#0A8451]/90 text-white px-9 mt-4"
            >
              <Check className="w-4 h-4" />
              {markAsDoneMutation.isPending ? "Дуусгаж байна..." : "Дуусгах"}
            </Button>
          </div>
        )}
        <Comment />
        <CommentWidget />
      </div>
    </div>
  );
};

export default TaskInfo;
