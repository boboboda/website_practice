import AdminNoteList from "@/components/developmentNote/adminNoteList";
import NoteComponent from "@/components/developmentNote/noteComponent";
import { NoteStoreProvider } from "@/components/providers/editor-provider";
import { AllFetchEdtiorServer } from "@/lib/serverActions/edtorServerAction";
import { Note } from "@/store/editorSotre";





export default async function DevelopNoteList() {

  const noteRes = await AllFetchEdtiorServer()

  
  const notes = JSON.parse(noteRes)

  console.log('noteData', notes)

  return (
    <NoteStoreProvider>
      <div>
        <AdminNoteList fetchNotes={notes}/>
      </div>
    </NoteStoreProvider>
  );
}
