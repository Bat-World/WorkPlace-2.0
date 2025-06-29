import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      <Skeleton className="h-96 w-full bg-gray-500 rounded-3xl" />
      <Skeleton className="h-14 w-full bg-gray-500 rounded-xl" />
    </div>
  );
}
