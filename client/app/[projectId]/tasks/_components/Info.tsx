import React from "react";
import {
  Breadcrumb,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateTaskDialog from "./CreateTaskDialog";

interface InfoProps {
  projectName: string;
}

const Info = ({ projectName }: InfoProps) => {
  return (
    <div className="w-full mt-10 flex justify-between items-center">
      <div className="flex flex-col">
        <Breadcrumb className="dark" />
        <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
          {projectName}
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
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
        <CreateTaskDialog />
      </div>
    </div>
  );
};

export default Info;
