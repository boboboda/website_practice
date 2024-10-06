import { Note } from "@/store/editorSotre";
import AdminNoteTable from "./table/noteTable";


export default function AdminNoteList({fetchNotes}: {fetchNotes: Note[]}) {

    console.log(fetchNotes)

    return(
        <div>
            <AdminNoteTable notes={fetchNotes}/>
        </div>
    )
}
