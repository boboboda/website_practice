import NoteComponent from "@/components/developmentNote/noteComponent";
import { NoteStoreProvider } from "@/components/providers/editor-provider";
import { allFetchEdtiorServer } from "@/lib/serverActions/edtorServerAction";
import { Note } from "@/store/editorSotre";





export default async function DevelopNoteWrite() {

  const noteRes = await allFetchEdtiorServer()

  
  const notes = JSON.parse(noteRes)

  console.log('write', notes)


  return (
    <NoteStoreProvider>
      <div>
        <NoteComponent fetchNotes={notes} editorType="add"/>
      </div>
    </NoteStoreProvider>
  );
}
