"use client";

import { Icon } from "@/components/ui/Icon";
import { Toolbar } from "@/components/ui/Toolbar";
import { Editor, removeDuplicates } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { EditorInfo } from "./EditorInfo";
import { EditorUser } from "./types";
import { Button, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import { noteCategories, NoteCategory, NoteEditorType } from "@/types/index";
import { useEffect, useState } from "react";
import { useNoteStore, useNoteStoreSubscribe } from "../providers/editor-provider";
import { Note, SubCategory } from "@/store/editorSotre";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { revalidatePath } from 'next/cache';

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  editor: Editor;
  // collabState: WebSocketStatus
};

export const EditorHeader = ({
  editor,
  isSidebarOpen,
  toggleSidebar,
  // title,
  // setTitle,
  notes,
  note,
  editType
}: {
  editor: Editor;
  isSidebarOpen?: boolean;
  toggleSidebar: () => void;
  // title: string,
  // setTitle: (string)=>void
  notes: Note[]
  note: Note
  editType: NoteEditorType
}) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  });

  const {
    setContent,
    mainCategory,
    subCategories,
    subCategory,
    setSubCategories,
    saveToServer,
    updateToServer,
    title
  } = useNoteStore((state) => state);


  const [viewMainCategory, setViewMainCategory] = useState<Set<NoteCategory>>(new Set());

  const [viewSubCategory, setViewSubCategory] = useState<SubCategory>(null);

  const handleSelectionChange = (newValue: Set<NoteCategory>) => {
    setViewMainCategory(newValue);

    // 선택된 카테고리 가져오기
    const selectedCategory = Array.from(newValue)[0];

    if (selectedCategory) {
      setContent({ mainCategory: selectedCategory });
    }
  };

  const router = useRouter()

  

  useEffect(()=> {

    switch (editType) {
      case "add":
        const serverSubCategories = notes.map(note => note.subCategory);
        if (serverSubCategories.length !== 0 && serverSubCategories[0] !== null) {
          setSubCategories(removeDuplicates(serverSubCategories));
        }
        if (mainCategory) {
          setViewMainCategory(new Set([mainCategory]));
        }
        break;
    
      case "edit":

        const editSubCat: SubCategory = note.subCategory

        const editMainCat: NoteCategory = note.mainCategory
        

        setSubCategories([editSubCat]);
        setContent({mainCategory: editMainCat})
        setContent({subCategory: editSubCat})
        setContent({noteId: note.noteId})

        setViewSubCategory(editSubCat)
        setViewMainCategory(new Set([editMainCat]))
        break;

        case "read":

        setSubCategories([editSubCat]);
        setContent({mainCategory: editMainCat})
        setContent({subCategory: editSubCat})
        setContent({noteId: note.noteId})

        setViewSubCategory(editSubCat)
        setViewMainCategory(new Set([editMainCat]))


          break
    
      default:
        // 기본 동작 (필요한 경우)
        console.log("Unknown edit type");
        break;
    }
  },[])

  useEffect(() => {
    if (subCategory && subCategories.length !== 0) {
      console.log("sub", subCategories);
      setViewSubCategory(subCategory);
    }
  }, [subCategories]);

  
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    console.log("카테고리", selectedValue);

    const existingCategory = subCategories.find(
      (cat) => cat.name === selectedValue
    );

    if (existingCategory) {
      setViewSubCategory(existingCategory);
      setContent({ subCategory: existingCategory });

      console.log("실행됨");
    }
  };

  const [newCategoryName, setNewCategoryName] = useState("");

  const addSubCategory = () => {
    const selectedValue = newCategoryName;

    // 선택된 값이 기존 카테고리에 있는지 확인
    const existingCategory = subCategories.find(
      (cat) => cat.name === selectedValue
    );

    let newCategory: SubCategory;

    if (existingCategory) {
      // 기존 카테고리가 있으면 그대로 사용
      newCategory = existingCategory;
    } else {
      // 기존 카테고리가 없으면 새로 생성
      const lastId =
        subCategories.length > 0
          ? Math.max(...subCategories.map((cat) => cat.id))
          : 0;
      const newId = lastId + 1;

      newCategory = {
        id: newId,
        name: selectedValue,
      };

      // 새 카테고리를 배열에 추가
      setSubCategories([...subCategories, newCategory]);
    }

    // Note의 subCategory 업데이트
    setContent({ subCategory: newCategory });

    setNewCategoryName("");
  };

  const notifySuccessEvent = (msg: string) => toast.success(msg);


  const TextEditMode = () => (
    <>
    {
    editType === "add" ? <Chip  variant="shadow"
    classNames={{
      base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
      content: "drop-shadow shadow-black text-white",
    }}>
      ADD MODE
      </Chip
      >  
      : <Chip 
      color="warning"
      classNames={{
        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
        content: "drop-shadow shadow-black text-white",
      }}
      >
        EDIT MODE
        </Chip>
    }
    </>
    )



    const handleSaveToServer = async () => {
      try {
        const result = await saveToServer();
        console.log("saveServer", result);

        if(result) {
          notifySuccessEvent("서버에 저장되었습니다.");

          router.push('/')
          router.refresh()
        }

      } catch (error) {
        console.log(error);
      }
    }

    const handleUpdateToServer = async () => {
      try {

        const result = await updateToServer();
        console.log("updateServer", result);

        if(result) {
          notifySuccessEvent("문서가 수정되었습니다.");

          router.push('/')
          router.refresh()
        }

      } catch (error) {
        console.log(error);
      }
    }



  return (
    <div className="flex flex-col items-center w-full py-2 pl-6 pr-3 gap-3 border-b border-neutral-200">
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-row items-center">
          <div className="flex items-center gap-x-1.5">
            <Toolbar.Button
              tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              onClick={toggleSidebar}
              active={isSidebarOpen}
              className={isSidebarOpen ? "bg-transparent" : ""}
            >
              <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
            </Toolbar.Button>
          </div>
        </div>

        <div className="flex flex-1 max-w-[200px] ">
          <Select
            label="메인 카테고리"
            className="max-w-xs"
            selectedKeys={viewMainCategory}
            onSelectionChange={handleSelectionChange}
          >
            {noteCategories.map((category) => (
              <SelectItem key={category}>{category}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-1 max-w-[200px] ">
          <Select
            label="서브 카테고리"
            className="max-w-xs"
            selectedKeys={viewSubCategory ? [viewSubCategory.name] : []}
            onChange={handleSubCategoryChange}
          >
            {subCategories.map((category) => (
              <SelectItem key={category.name}>{category.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex space-x-2 items-center">
          <Input
            placeholder="새 카테고리 이름"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            disabled={newCategoryName === ""}
            className={`
    ${
      newCategoryName === ""
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-blue-500"
    }
  `}
            onClick={addSubCategory}
          >
            추가
          </Button>
        </div>
        

        <div className="flex flex-1 justify-end items-center">
        <div className="flex justify-end items-center mr-3">
        <TextEditMode/>
        </div>
          <EditorInfo characters={characters} words={words} />
          <Button
            className="hover:bg-blue-500"
            onClick={ async ()=>{
              switch(editType) {
                case "add" : await handleSaveToServer()

                break

                case "edit" : await handleUpdateToServer()
                break
              }
            }

              

            }
          >{
            editType === "add" ? "배포" : "수정"
          }
            
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div key="underlined" className="flex flex-1 gap-4">
          <Input
            type="제목"
            className="no-underline"
            label="제목"
            value={title}
            onChange={(e) => {
              // setTitle(e.target.value);

              setContent({ title: e.target.value });

              console.log("인풋", e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
