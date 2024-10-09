import NoteContentCard from "@/components/developmentNote/userNote/noteContentCard";
import { NoteStoreProvider } from "@/components/providers/editor-provider";

export default function Note() {
  return (
    <div className="mx-auto flex mt-7 md:flex-col flex-row items-center justify-center">
      <NoteContentCard />
    </div>
  );
}
