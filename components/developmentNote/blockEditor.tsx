"use client";
import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { LinkMenu } from "@/components/menus";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import "@/styles/index.css";
import { Sidebar } from "@/components/Sidebar";
import ImageBlockMenu from "@/lib/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/lib/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/lib/extensions/Table/menus";
import { EditorHeader } from "./EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useNoteStore } from "../providers/editor-provider";
import { useRouter } from "next/navigation";
import { defaultInitContent, Note, SubCategory } from "@/store/editorSotre";
import { NoteEditorType } from "@/types";



export const BlockEditor = ({fetchNotes, editorType, note}: {note?:Note, fetchNotes?: Note[], editorType: NoteEditorType}) => {
  const menuContainerRef = useRef(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
 
  const leftSidebar = useSidebar();

  let {loadFromLocal , deleteLocal, setContent } = useNoteStore((state)=> state)

  const [readState, setReadState] = useState(true);

  const { editor } = useBlockEditor({ clientID: "kim", readState: readState })

  useEffect(() => {
    const fetchData = async () => {
      try {
      const localNote: Note = await loadFromLocal();

      if(localNote.title !== "") {
        console.log('로컬데이터 있어요', localNote)

        onOpen()
      }

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if(editorType !== "read")  {
      fetchData();
    }
  
  }, []);


  useEffect(()=>{

    switch(editorType) {
      case "add":

      break
      case "edit":

      editor.commands.clearContent();
      editor.commands.setContent(note.content)
      setContent({noteId: note.noteId, title: note.title, content: note.content})
      break

      case "read":

      editor.commands.clearContent();
      editor.commands.setContent(note.content)
      setContent({title: note.title, content: note.content})

      setReadState(false)
      break
    }
  }, [note])


  

  if (!editor) {
    return null;
  }

  


  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      <Modal
         placement="center"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        isDismissable={false}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10"
        }}
      >
        <ModalContent>
          {(onClose) => 
          <CustomModalContent 
          onClose={onClose} 
          deleteLocal={async () => {
            const success = await deleteLocal();
            if (success) {
              onClose();
              if (editor) {
                setContent({title: ""})
                editor.commands.clearContent();
                editor.commands.setContent(defaultInitContent.content)
              }
            } else {
              return
            }
          }} />}
        </ModalContent>
      </Modal>

      {
        isOpen ? 
        null
        : <>
        <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">

        {
          editorType !== "read" ?
          <EditorHeader
          editor={editor}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
          notes={fetchNotes}
          note={note}
          editType={editorType}
        />
        : null
        }
        
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
        </>
      }
    </div>
  );
};

export default BlockEditor;

const CustomModalContent = ({ onClose, deleteLocal }: { onClose: () => void, deleteLocal: ()=>void }) => {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">안내</ModalHeader>
      <ModalBody>
        <h3>이전에 쓰던 글을 불러오시겠습니까?</h3>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onPress={onClose}>
          예
        </Button>
        <Button
           color="danger"
          onPress={()=>{
            deleteLocal()
            onClose()
          }}
        >
          아니요
        </Button>
        </ModalFooter>
    </>
  );
};