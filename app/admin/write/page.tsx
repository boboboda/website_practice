import NoteComponent from "@/components/developmentNote/noteComponent";
import { NoteStoreProvider } from "@/components/providers/editor-provider";
import { AllFetchEdtiorServer } from "@/lib/serverActions/edtorServerAction";
import { Note } from "@/store/editorSotre";





export default async function DevelopNoteWrite() {

  const noteRes = await AllFetchEdtiorServer()

  
  const notes = JSON.parse(noteRes)

  console.log('write', notes)


  return (
    <NoteStoreProvider>
      <div>
        <NoteComponent fetchNotes={notes}/>
      </div>
    </NoteStoreProvider>
  );
}
