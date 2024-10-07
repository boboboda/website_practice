import { NoteEditorType } from "@/types";
import NoteEditor from "./Editor";
import { Note } from "@/store/editorSotre";
import BlockEditor from "./blockEditor";

export default function NoteComponent({fetchNotes, editNote, editorType}: {editNote?:Note, fetchNotes: Note[], editorType: NoteEditorType}) {
    
    return(
        <div>
            <BlockEditor fetchNotes={fetchNotes} editorType={editorType} editNote={editNote}/>  
        </div>
    )
} 