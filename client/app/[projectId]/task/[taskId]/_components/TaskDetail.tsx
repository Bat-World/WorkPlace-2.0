'use client'

import { useUser } from "@clerk/nextjs";
import { Clock, PencilRuler } from "lucide-react";
import { CommentInput } from "./CommentInput";

export const TaskDetail = () => {
    const { user, isSignedIn } = useUser();
    return (
        <div className="mt-5 flex gap-4">
            <div>
                <img
                    src={user?.imageUrl}
                    alt="User"
                    className="w-12 h-12 rounded-full border border-[#434043]"
                />
            </div>
            <div className=" w-[75%] text-white">
                <div className="p-5 rounded-[23px] bg-[#141318] border border-[#3D3C41] flex flex-col gap-5 h-fit">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <p className="text-white opacity-50">{user?.firstName}</p>
                            <p className="text-white opacity-50">2 өдрийн өмнө</p>
                        </div>
                        <button className="text-white flex items-center gap-2 bg-[#2E2C33] rounded-[9px] px-4 py-2 cursor-pointer hover:bg-[#3a383f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5f5d66]">
                            <PencilRuler className="w-4 h-4" />
                            Засварлах
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-2xl font-semibold">Main script & storyboard</p>
                        <p className="text-xs leading-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>

                </div>
                <div className="mt-5 p-5 rounded-[23px] bg-[#141318] border border-[#3D3C41] overflow-x-auto">
                    <div className="flex gap-5 w-max">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <img
                                key={i}
                                src="https://res.cloudinary.com/prod/image/upload/e_gen_recolor:prompt_armchair;to-color_FF00FF;multiple_true/me/gr-chair-1.jpg"
                                alt=""
                                className="w-[234px] h-[234px] rounded-3xl object-cover shrink-0"
                            />
                        ))}
                    </div>
                </div>
                <CommentInput />
            </div>
            <div className="rounded-[23px] bg-[#141318] border border-[#3D3C41] w-[25%] p-5 text-white h-fit">
                <div className="flex flex-col gap-3">
                    <p className="text-white opacity-50">Шалгагчид</p>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
                        User1
                    </div>
                </div>
                <div className="mt-5 opacity-20 border border-white"></div>
                <div className="flex flex-col gap-3">
                    <p className="text-white opacity-50">Хүлээж авсан</p>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
                        User1
                    </div>
                </div>
                <div className="my-5 opacity-20 border border-white"></div>
                <div className="flex flex-col gap-2">
                    <p className="text-white opacity-50">Шошгонууд</p>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex justify-center items-center rounded-2xl px-4 py-1 text-[#FCC3EC] bg-[#5A2241]">
                            Яаралтай
                        </div>
                        <div className="flex justify-center items-center rounded-2xl px-4 py-1 text-white bg-[#272A33]">
                            Tinder
                        </div>
                    </div>
                </div>
                <div className="my-5 opacity-20 border border-white"></div>
                <div className="flex flex-col gap-2">
                    <p className="text-white opacity-50">Дуусах хугацаа</p>
                    <div className="flex gap-2">
                        <Clock />
                        <p>8-р сарын 16, 2025</p>
                    </div>
                </div>
            </div>
        </div>
    )
}