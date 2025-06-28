import { Skeleton } from "@/components/ui/skeleton";

const ProjectGridSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="w-full max-w-[280px] h-[280px] bg-[#141318] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex gap-4 items-center">
            <Skeleton className="w-14 h-14 rounded-lg" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGridSkeleton;