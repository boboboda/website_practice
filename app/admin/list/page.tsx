import AdminNoteList from "@/components/developmentNote/adminNoteList";
import NoteComponent from "@/components/developmentNote/noteComponent";
import { NoteStoreProvider } from "@/components/providers/editor-provider";
import { allFetchEdtiorServer } from "@/lib/serverActions/editorServerAction";
import { Note } from "@/store/editorSotre";





export default async function DevelopNoteList() {

  const noteRes = await allFetchEdtiorServer()

  
  const notes = JSON.parse(noteRes)

  return (
    <NoteStoreProvider>
      <div className="w-full">
        <AdminNoteList fetchNotes={notes}/>
      </div>
    </NoteStoreProvider>
  );
}
