import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="mt-6 space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full bg-gray-500 rounded-xl" />
        <Skeleton className="h-24 w-full bg-gray-500 rounded-xl" />
        <Skeleton className="h-24 w-full bg-gray-500 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="col-span-1 xl:col-span-2">
          <Skeleton className="h-[320px] w-full bg-gray-500 rounded-xl" />
        </div>
        <div className="col-span-1">
          <Skeleton className="h-[320px] w-full bg-gray-500 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
