import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanSkeleton() {
  return (
    <div className="w-full flex justify-center items-center gap-10 mt-10">
      <div className="w-full flex flex-col gap-5">
        <Skeleton className="h-8 w-40 bg-gray-500 rounded-2xl" />
        <Skeleton className="h-[40rem] w-full bg-gray-500 rounded-2xl" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <Skeleton className="h-8 w-40 bg-gray-500 rounded-2xl" />
        <Skeleton className="h-[40rem] w-full bg-gray-500 rounded-2xl" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <Skeleton className="h-8 w-40 bg-gray-500 rounded-2xl" />
        <Skeleton className="h-[40rem] w-full bg-gray-500 rounded-2xl" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <Skeleton className="h-8 w-40 bg-gray-500 rounded-2xl" />
        <Skeleton className="h-[40rem] w-full bg-gray-500 rounded-2xl" />
      </div>
    </div>
  );
}
