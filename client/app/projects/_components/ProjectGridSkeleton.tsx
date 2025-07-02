import { Skeleton } from "@/components/ui/skeleton";

const ProjectGridSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-8">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton
          key={idx}
          className="w-full h-50 bg-gray-500 p-5 flex flex-col justify-between rounded-2xl"
        ></Skeleton>
      ))}
    </div>
  );
};

export default ProjectGridSkeleton;
