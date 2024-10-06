import NoteEditor from "./Editor";
import { Note } from "@/store/editorSotre";

export default function NoteComponent({fetchNotes}: {fetchNotes: Note[]}) {
    return(
        <div>
            <NoteEditor fetchNotes={fetchNotes}/>
        </div>
    )
} 