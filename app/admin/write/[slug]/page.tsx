import NoteComponent from "@/components/developmentNote/noteComponent";
import { NoteStoreProvider } from "@/components/providers/editor-provider";
import { findOneEditorServer } from "@/lib/serverActions/edtorServerAction";
import { Note } from "@/store/editorSotre";





export default async function DevelopNoteWrite({ params }: { params: { slug: string } }) {


  console.log('id', params.slug)

  const noteRes = await findOneEditorServer(params.slug)

  
  const notes = JSON.parse(noteRes)

  console.log('editor note', notes)


  return (
    <NoteStoreProvider>
      <div>
        <NoteComponent fetchNotes={notes} editorType="edit"/>
      </div>
    </NoteStoreProvider>
  );
}
