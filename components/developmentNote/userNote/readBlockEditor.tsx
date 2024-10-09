"use client";
import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import "@/styles/index.css";
import { Note } from "@/store/editorSotre";

export const ReadBlockEditor = ({ note }: { note?: Note }) => {
  const menuContainerRef = useRef(null);
  const { editor } = useBlockEditor({ clientID: "kim", readState: false });

  useEffect(() => {
    if (editor && note) {
        editor.commands.clearContent();
        editor.commands.setContent(note.content);
    }
  }, [editor, note]);

  if (!editor) {
    return  // 또는 원하는 로딩 인디케이터를 여기에 넣으세요
  }

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
       <div className="relative flex flex-col w-full h-full overflow-hidden">
        <EditorContent editor={editor} className="w-full" />
      </div> 
    </div>
  );
};

export default ReadBlockEditor;