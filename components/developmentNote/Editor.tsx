
import { Note } from '@/store/editorSotre'
import BlockEditor from './blockEditor'
import { useNoteStore } from '../providers/editor-provider';

export default function NoteEditor({fetchNotes}: {fetchNotes: Note[]}) {
 
  return (
    <>
      <BlockEditor fetchNotes={fetchNotes}/>
    </>
  )
}