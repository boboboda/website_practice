import NoteContentCard from "@/components/developmentNote/userNote/noteContentCard";
import { NoteStoreProvider } from "@/components/providers/editor-provider";

export default function Note() {
  return (
    <div className="mx-auto flex md:flex-col flex-col items-center justify-center">
      <NoteContentCard />
    </div>
  );
}
