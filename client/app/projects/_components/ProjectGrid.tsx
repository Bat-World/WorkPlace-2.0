import { Project } from "@/lib/types";
import Image from "next/image";

export const ProjectGrid = ({
  projects,
  router,
}: {
  projects: Project[] | undefined;
  router: any;
}) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-8">
      {projects?.map((project: Project) => (
        <div
          key={project.id}
          className="w-full p-6 bg-[#141318] rounded-2xl hover:bg-[#1c1b22] transition duration-200 ease-in-out cursor-pointer flex flex-col justify-between"
          onClick={() => router.push(`/${project.id}/dashboard`)}
        >
          <div className="flex gap-4 items-start">
            <div
              className="w-16 h-16 min-w-16 rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  project.avatarUrl ||
                  "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18xbHlXRFppb2JyNjAwQUtVZVFEb1NsckVtb00iLCJyaWQiOiJvcmdfMnlPbDNOWHdQV2tIQ25pM1VxSFhETVkzcnExIiwiaW5pdGlhbHMiOiI0In0?width=160"
                })`,
              }}
            ></div>
            <div className="flex flex-col w-full max-w-[180px]">
              <p className="text-white text-xl font-semibold leading-tight line-clamp-2">
                {project.title}
              </p>
              <p className="text-sm text-white/50 mt-1 line-clamp-2">
                {project.description || "No description"}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-10">
            <div className="flex gap-2 flex-wrap">
              {project.labels?.slice(0, 3).map((label) => (
                <span
                  key={label.id}
                  className="text-xs px-3 py-1 rounded-full bg-[#301a2f] text-white"
                >
                  {label.name}
                </span>
              ))}
            </div>

            <div className="flex -space-x-2">
              {project.members
                ?.filter((member) => member.user !== null)
                .slice(0, 3)
                .map((member, idx) => (
                  <Image
                    src={member.user?.avatarUrl || "/default-avatar.png"}
                    alt={member.user?.name || "Avatar"}
                    width={28}
                    height={28}
                    className="rounded-full border-2 border-[#141318]"
                    title={member.user?.name}
                  />
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
