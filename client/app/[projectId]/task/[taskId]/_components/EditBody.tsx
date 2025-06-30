"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Upload,
  FileText,
  Image,
  File,
  X,
  Save,
  ArrowLeft,
  Undo,
  Redo,
  Quote,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Paperclip,
} from "lucide-react";
import { useGetTaskById } from "@/hooks/task/useGetTaskById";
import { useUpdateTask } from "@/hooks/task/useUpdateTask";
import { useParams } from "next/navigation";
import { formatDate } from "@/utils/DateFormatter";
import { useUploadThing } from "@/utils/uploadthing";
import { deleteUploadThingFile } from "@/utils/uploadthing";
import { uploadFileToCloudinary } from "@/utils/cloudinary";
import { deleteFromCloudinary } from "@/utils/cloudinary";
import CommentWidget from "./CommentWdiget";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  disabled = false,
  isActive = false,
  children,
  title,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded hover:bg-[#3D3C41] transition-colors ${
      isActive ? "bg-[#3D3C41] text-[#2FC285]" : "text-[var(--background)]"
    }`}
    title={title}
  >
    {children}
  </button>
);

const Toolbar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-[#3D3C41] bg-[#2E2C33]">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#3D3C41] mx-2" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#3D3C41] mx-2" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#3D3C41] mx-2" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#3D3C41] mx-2" />

      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive("link")}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Remove Link"
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#3D3C41] mx-2" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

interface SortableFileItemProps {
  file: FileItem;
  onRemove: (id: string) => Promise<void>;
}

const SortableFileItem: React.FC<SortableFileItemProps> = ({
  file,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (type.includes("pdf") || type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("text/") ||
      type.includes("json") ||
      type.includes("csv") ||
      type.includes("txt")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("word") ||
      type.includes("document") ||
      type.includes("doc")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      type.includes("xls")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("powerpoint") ||
      type.includes("presentation") ||
      type.includes("ppt")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("zip") ||
      type.includes("rar") ||
      type.includes("archive") ||
      type.includes("7z")
    )
      return <File className="w-4 h-4" />;
    if (type.includes("video/")) return <File className="w-4 h-4" />;
    if (type.includes("audio/")) return <File className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-[#191D21] rounded-xl hover:bg-[#1f2429] transition-colors"
    >
      <div
        className="flex items-center gap-3 cursor-grab active:cursor-grabbing flex-1"
        {...attributes}
        {...listeners}
      >
        {file.preview && file.type.startsWith("image/") ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-[#3D3C41] rounded flex items-center justify-center">
            <div className="text-[var(--background)]">
              {getFileIcon(file.type)}
            </div>
          </div>
        )}
        <div>
          <p className="text-[var(--background)] text-sm font-medium">
            {file.name}
          </p>
          <p className="text-[var(--background)]/50 text-xs">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          await onRemove(file.id);
        }}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

const EditBody = ({ onBack }: { onBack: () => void }) => {
  const params = useParams();
  const taskId = params.taskId as string;
  const { data: task, isLoading, error } = useGetTaskById(taskId);
  const updateTaskMutation = useUpdateTask();
  const { startUpload, isUploading } = useUploadThing("taskAttachments");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [content, setContent] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sortFiles = (fileList: FileItem[]) => {
    return fileList.sort((a, b) => {
      const aIsImage = a.type.startsWith("image/");
      const bIsImage = b.type.startsWith("image/");

      if (aIsImage && !bIsImage) return -1;
      if (!aIsImage && bIsImage) return 1;
      return 0;
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-[#2FC285] pl-4 italic",
          },
        },
      }),
      Underline,
      TextStyle,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#2FC285] underline hover:text-[#2FC285]/80",
        },
      }),
    ],
    content: task?.description || "",
    editable: true,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4 text-[var(--background)]",
        "data-placeholder": "Start writing your task description...",
      },
    },
  });

  const parseAttachment = (attachment: string, index: number): FileItem => {
    try {
      const fileMetadata = JSON.parse(attachment);
      if (fileMetadata.url && fileMetadata.name) {
        return {
          id: `existing-${index}`,
          name: fileMetadata.name,
          size: fileMetadata.size || 0,
          type: fileMetadata.type || "application/octet-stream",
          preview: fileMetadata.url,
        };
      }
    } catch (e) {}

    const isUploadThingUrl = attachment.includes("ufs.sh/f/");
    const isCloudinaryUrl =
      attachment.includes("cloudinary.com") && attachment.includes("/upload/");
    const fileName = isUploadThingUrl
      ? `File ${index + 1}`
      : attachment.split("/").pop()?.split("?")[0] || `File ${index + 1}`;

    let fileType = "application/octet-stream";
    if (
      isCloudinaryUrl ||
      attachment.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    ) {
      fileType = "image/*";
    } else if (
      attachment.includes("pdf") ||
      attachment.includes("application/pdf")
    ) {
      fileType = "application/pdf";
    } else if (attachment.includes("json") || attachment.includes("text/")) {
      fileType = "text/plain";
    } else if (attachment.match(/\.(doc|docx)$/i)) {
      fileType = "application/msword";
    } else if (attachment.match(/\.(xls|xlsx)$/i)) {
      fileType = "application/vnd.ms-excel";
    } else if (attachment.match(/\.(ppt|pptx)$/i)) {
      fileType = "application/vnd.ms-powerpoint";
    } else if (attachment.match(/\.(txt)$/i)) {
      fileType = "text/plain";
    }

    return {
      id: `existing-${index}`,
      name: fileName,
      size: 0,
      type: fileType,
      preview: attachment,
    };
  };

  const getFileType = (url: string): string => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return "image/*";
    if (url.includes("pdf") || url.includes("application/pdf"))
      return "application/pdf";
    if (url.includes("json") || url.includes("text/")) return "text/plain";
    if (url.match(/\.(doc|docx)$/i)) return "application/msword";
    if (url.match(/\.(xls|xlsx)$/i)) return "application/vnd.ms-excel";
    if (url.match(/\.(ppt|pptx)$/i)) return "application/vnd.ms-powerpoint";
    if (url.match(/\.(txt)$/i)) return "text/plain";
    return "application/octet-stream";
  };

  useEffect(() => {
    if (editor && task) {
      if (task.body) {
        editor.commands.setContent(task.body);
        setContent(task.body);
      } else if (task.description) {
        editor.commands.setContent(task.description);
        setContent(task.description);
      }

      if (task.attachments && task.attachments.length > 0) {
        const existingFiles = task.attachments.map((attachment, index) =>
          parseAttachment(attachment, index)
        );
        setFiles(sortFiles(existingFiles));
      }
    }
  }, [editor, task]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (file.size > 16 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 16MB.`);
        continue;
      }

      try {
        let fileUrl: string;
        if (file.type.startsWith("image/")) {
          fileUrl = await uploadFileToCloudinary(file, file.name);
        } else {
          const uploadedFiles = await startUpload([file]);
          if (!uploadedFiles || !uploadedFiles[0]) {
            alert(`Failed to upload ${file.name}`);
            continue;
          }
          fileUrl = uploadedFiles[0].url;
        }

        const fileItem: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: fileUrl,
        };
        setFiles((prev) => sortFiles([...prev, fileItem]));
      } catch (error) {
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeFile = async (fileId: string) => {
    const fileToRemove = files.find((file) => file.id === fileId);

    if (fileToRemove && fileToRemove.preview) {
      if (
        fileToRemove.preview.includes("utfs.io/f/") ||
        fileToRemove.preview.includes("ufs.sh/f/")
      ) {
        let fileKey = null;

        if (fileToRemove.preview.includes("/f/")) {
          fileKey = fileToRemove.preview.split("/f/")[1]?.split("?")[0];
        }

        if (!fileKey) {
          const urlParts = fileToRemove.preview.split("/");
          fileKey = urlParts[urlParts.length - 1]?.split("?")[0];
        }

        if (fileKey) {
          try {
            await deleteUploadThingFile(fileKey);
          } catch (error) {}
        }
      } else if (
        fileToRemove.preview.includes("cloudinary.com") &&
        fileToRemove.preview.includes("/upload/")
      ) {
        const urlParts = fileToRemove.preview.split("/upload/");
        if (urlParts.length > 1) {
          const publicIdWithVersion = urlParts[1]
            .split("/")
            .slice(1)
            .join("/")
            .split(".")[0];
          if (publicIdWithVersion) {
            try {
              await deleteFromCloudinary(publicIdWithVersion);
            } catch (error) {}
          }
        }
      }
    }

    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (type.includes("pdf") || type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("text/") ||
      type.includes("json") ||
      type.includes("csv") ||
      type.includes("txt")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("word") ||
      type.includes("document") ||
      type.includes("doc")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      type.includes("xls")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("powerpoint") ||
      type.includes("presentation") ||
      type.includes("ppt")
    )
      return <FileText className="w-4 h-4" />;
    if (
      type.includes("zip") ||
      type.includes("rar") ||
      type.includes("archive") ||
      type.includes("7z")
    )
      return <File className="w-4 h-4" />;
    if (type.includes("video/")) return <File className="w-4 h-4" />;
    if (type.includes("audio/")) return <File className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleSave = async () => {
    try {
      const allAttachments = files
        .map((file) => {
          if (file.preview && file.preview.startsWith("http")) {
            const fileMetadata = {
              url: file.preview,
              name: file.name,
              size: file.size,
              type: file.type,
            };
            return JSON.stringify(fileMetadata);
          }
          return null;
        })
        .filter((item): item is string => item !== null);

      await updateTaskMutation.mutateAsync({
        taskId,
        input: {
          body: content,
          attachments: allAttachments,
        },
      });

      onBack();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-10/12 flex gap-4">
        <div className="w-full p-4 bg-[#141318] rounded-3xl">
          <p className="text-[var(--background)]/50">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="w-10/12 flex gap-4">
        <div className="w-full p-4 bg-[#141318] rounded-3xl">
          <p className="text-red-500">Error loading task</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-10/12 flex gap-4">
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <p className="text-[var(--background)]/50 text-base">
                {task.createdBy.name}
              </p>
              <p className="text-[var(--background)]/50 text-base">
                {formatDate(task.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="text-[var(--background)] bg-transparent border-[#3D3C41]"
              >
                <ArrowLeft className="w-4 h-4" />
                Буцах
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateTaskMutation.isPending || isUploading}
                className="bg-[#2FC285] hover:bg-[#2FC285]/90"
              >
                <Save className="w-4 h-4" />
                {updateTaskMutation.isPending || isUploading
                  ? "Хадгалж байна..."
                  : "Хадгалах"}
              </Button>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="mb-6">
            <div className="border border-[#3D3C41] rounded-2xl overflow-hidden bg-[#191D21] shadow-sm">
              <Toolbar editor={editor} />
              <EditorContent editor={editor} className="min-h-[400px]" />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            {/* Upload Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className=""
              >
                <Paperclip className="w-4 h-4" />
                Файл оруулах
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.json,.csv,.zip,.rar"
              />
              <Label className="text-[var(--background)]/50 font-normal text-sm my-2">
                Файлын дээд хэмжээ (16MB)
              </Label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={files.map((file) => file.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 mt-5">
                    {files.map((file) => (
                      <SortableFileItem
                        key={file.id}
                        file={file}
                        onRemove={removeFile}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
        <CommentWidget />
      </div>
    </div>
  );
};

export default EditBody;
