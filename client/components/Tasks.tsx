import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";



export const CreateTask = () => {
  return (
    <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8 mt-[20px]">
      <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-white">Swipe Integrations</div>
            <div className="text-sm text-gray-500">/ Tasks</div>
          </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#2FC285]">+ Нэмэх</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>Enter project details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Project Title" />
              <Input />
              <Button></Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
