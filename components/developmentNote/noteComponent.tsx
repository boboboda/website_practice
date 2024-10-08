import { NoteEditorType } from "@/types";
import { Note } from "@/store/editorSotre";
import BlockEditor from "./blockEditor";

export default function NoteComponent({fetchNotes, editNote, editorType}: {editNote?:Note, fetchNotes?: Note[], editorType: NoteEditorType}) {
    
    return(
        <div className="w-full">
            <BlockEditor fetchNotes={fetchNotes} editorType={editorType} note={editNote}/>  
        </div>
    )
} 