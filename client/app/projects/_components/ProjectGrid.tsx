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
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {projects?.map((project: Project) => (
                <div
                    key={project.id}
                    className="w-full h-[200px] p-4 bg-[#141318] rounded-2xl hover:bg-[#1c1b22] transition duration-200 ease-in-out cursor-pointer flex flex-col justify-between"
                    onClick={() => router.push(`/${project.id}/dashboard`)}
                >
                    <div className="flex gap-4 items-start">
                        <div
                            className="w-16 h-16 min-w-16 rounded-lg bg-cover bg-center"
                            style={{
                                backgroundImage: `url(https://platform.theverge.com/wp-content/uploads/sites/2/2025/02/STK143_Tinder_01.jpg?quality=90&strip=all&crop=0,0,100,100)`,
                            }}
                        ></div>
                        <div className="flex flex-col w-full max-w-[180px]">
                            <p className="text-white text-base font-semibold leading-tight line-clamp-2">
                                {project.title}
                            </p>
                            <p className="text-sm text-white/50 mt-1 line-clamp-2">
                                {project.description || "No description"}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                        <div className="flex gap-2 flex-wrap">
                            {project.labels?.map((label) => (
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
