'use client'

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Note, SubCategory } from "@/store/editorSotre";
import ReadBlockEditor from "./readBlockEditor";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface GroupedNotes {
  [key: string]: Note[];
}

export default function NoteItemView({fetchNotes}: {fetchNotes: Note[]}) {
    const router = useRouter(); // 컴포넌트 최상위 레벨에서 호출
    const [note, setNote] = useState<Note | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [groupedNotes, setGroupedNotes] = useState<GroupedNotes>({});

    useEffect(() => {
        if (fetchNotes && fetchNotes.length > 0) {
            console.log("Setting first note:", fetchNotes[0]);
            setNote(fetchNotes[0]);
            const grouped = fetchNotes.reduce((acc, note) => {
                const subCategoryName = note.subCategory?.name || 'Uncategorized';
                if (!acc[subCategoryName]) {
                    acc[subCategoryName] = [];
                }
                acc[subCategoryName].push(note);
                return acc;
            }, {} as GroupedNotes);
            setGroupedNotes(grouped);
        }
    }, [fetchNotes]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex relative w-full">
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-gray-100 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'} flex flex-col`}>
                {isSidebarOpen && (
                    <>
                        <div className="flex-grow overflow-y-auto">
                            <div className="p-4">
                                <h2 className="text-black font-bold text-[25px] mb-4">{note?.mainCategory}</h2>
                                <h3 className="text-black font-bold text-[20px] mb-2">목차</h3>
                                {Object.entries(groupedNotes).map(([subCategoryName, notes]) => (
                                    <div key={subCategoryName} className="mb-4">
                                        <h4 className="text-black font-semibold mb-2">{subCategoryName}</h4>
                                        <ul className="ml-3">
                                            {notes.map((note, index) => (
                                                <li key={index} 
                                                    className="mb-2 cursor-pointer text-black hover:text-gray-600"
                                                    onClick={() => setNote(note)}>
                                                    {note.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 mb-[20px]">
                            <Button className="w-full bg-slate-500" onClick={() => router.back()}>
                                뒤로가기
                            </Button>
                        </div>
                        <div className="h-[100px] bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">광고 영역</p>
                        </div>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className={`w-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <button
                    className="m-2 bg-slate-700 hover:bg-slate-500 text-white p-2 rounded-[5px]"
                    onClick={toggleSidebar}
                >
                    {isSidebarOpen ? <ChevronLeftIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
                </button>
                {note && <ReadBlockEditor note={note} />}
            </div>
        </div>
    );
}