import { Skeleton } from "@/components/ui/skeleton";

export default function TaskInfoSkeleton() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-10">
      <div className="w-full flex gap-4">
        <div>
          <Skeleton className="h-14 w-auto aspect-square bg-gray-500 rounded-full" />
        </div>
        <div className="w-full flex flex-col gap-6">
          <Skeleton className="h-96 w-full bg-gray-500 rounded-3xl" />
          <Skeleton className="h-30 w-full bg-gray-500 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
