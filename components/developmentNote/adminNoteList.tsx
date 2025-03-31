import { Note } from "@/store/editorSotre";
import AdminNoteTable from "./table/noteTable";
import { unstable_noStore as noStore } from 'next/cache';

export default function AdminNoteList({fetchNotes}: {fetchNotes: Note[]}) {

    noStore();

    return(
        <div className="w-full pt-3">
            <div className="w-full flex justify-center">
                <h1 className=" text-[40px] font-bold">관리자 노트 리스트</h1>
            </div>
            <AdminNoteTable notes={fetchNotes}/>
        </div>
    )
}
