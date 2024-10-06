import NoteContent from "@/components/developmentNote/noteContent";
import { NoteStoreProvider } from "@/components/providers/editor-provider";

export default function Note() {
  return (
    <div className="mx-auto flex md:flex-col flex-col items-center justify-center">
      <NoteContent />
    </div>
  );
}
