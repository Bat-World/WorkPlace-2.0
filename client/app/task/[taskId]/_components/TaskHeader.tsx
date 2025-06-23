'use client'

import { MessagesSquare, PencilRuler, Scroll } from "lucide-react"
import { useState } from "react"
import { TaskDetail } from "./TaskDetail"
import { TaskLog } from "./TaskLog"

export const TaskHeader = () => {
    const [activeTab, setActiveTab] = useState<'main' | 'history'>('main')

    return (
        <div>
            <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8 mt-[20px]">
                <div className="flex justify-between">
                    <div>
                        <div className="flex text-xs text-white opacity-50">
                            <p>Tinder / </p>
                            <p>Swipe / </p>
                            <p>Tasks / </p>
                            <p>Info </p>
                        </div>
                        <div className="flex gap-2 items-end">
                            <p className="text-white text-2xl">Marketing ad script</p>
                            <div className="bg-[#0A8451] text-white rounded-full items-center justify-center p-2">
                                Нээлттэй таск
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="text-white flex items-center gap-2 bg-[#2E2C33] rounded-[9px] px-4 py-2 cursor-pointer hover:bg-[#3a383f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5f5d66]">
                            <PencilRuler className="w-4 h-4" />
                            Засварлах
                        </button>
                    </div>
                </div>
                <div>

                </div>
            </div>
            <div className="border-b border-gray-700 mt-5"></div>
            <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8 mt-[20px]">
                <div className="flex bg-[#141318] rounded-lg text-white w-fit">
                    <div
                        className={`w-fit flex gap-2 justify-center items-center px-4 py-2 text-xs rounded-md 
                        ${activeTab === 'main' ? 'ring-1 ring-[#3D3C41]' : ''}`}
                        onClick={() => setActiveTab('main')}
                    >
                        <MessagesSquare className="w-4 h-4" />
                        Үндсэн
                    </div>
                    <div
                        className={`w-fit flex gap-2 justify-center items-center px-4 py-2 text-xs rounded-md 
                        ${activeTab === 'history' ? 'ring-1 ring-[#3D3C41]' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <Scroll className="w-4 h-4" />
                        Түүх
                    </div>
                </div>

                {activeTab === 'main' && <TaskDetail />}
                {activeTab === 'history' && <TaskLog />}
            </div>
        </div>

    )
}