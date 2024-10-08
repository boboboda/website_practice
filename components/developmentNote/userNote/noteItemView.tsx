'use client'

import { useEffect, useState } from "react";
import BlockEditor from "../blockEditor";
import { defaultInitContent, Note } from "@/store/editorSotre";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function NoteItemView({fetchNotes, mainCategory}:{fetchNotes: Note[], mainCategory: string}) {
    const [note, setNote] = useState<Note | null>(defaultInitContent);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (fetchNotes.length > 0) {
            setNote(fetchNotes[0]);           
        }
    }, [fetchNotes]);

    return (
        <div className="flex justify-center relative w-full">
            {/* 토글 버튼 */}
            <button
                className="fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <ChevronLeftIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
            </button>

            {/* 사이드바 */}
            <div className={`fixed left-0 top-0 h-full bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
                {/* <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">목차</h2>
                    <ul>
                        {fetchNotes.map((note, index) => (
                            <li key={index} className="mb-2 cursor-pointer hover:text-blue-500"
                                onClick={() => setNote(note)}>
                                {note.title}
                            </li>
                        ))}
                    </ul>
                </div> */}
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className={`w-[80%] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <div className="w-full flex justify-center">
                    <BlockEditor fetchNotes={fetchNotes} note={note} editorType="read"/>
                </div>
            </div>
        </div>
    );
}