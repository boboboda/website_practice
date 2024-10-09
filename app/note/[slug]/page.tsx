import NoteItemView from "@/components/developmentNote/userNote/noteItemView";
import { NoteStoreProvider } from "@/components/providers/editor-provider";
import { allFetchEdtiorServer } from "@/lib/serverActions/editorServerAction";
import { Note } from "@/store/editorSotre";

export default async function NoteContentItemPage({ params }: { params: { slug: string } }) {

    const noteRes = await allFetchEdtiorServer()

    const notes: Note[] = JSON.parse(noteRes)

    const filterNotes = notes.filter((note) => note.mainCategory === params.slug)

    console.log('write', notes)

    return (
        <NoteStoreProvider>
            <div className="w-full">
                <NoteItemView fetchNotes={filterNotes} />
            </div>
        </NoteStoreProvider>

    )
}

