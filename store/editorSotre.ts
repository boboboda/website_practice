
import { createStore } from 'zustand/vanilla'
import { JSONContent } from '@tiptap/react';
import { addEdtiorServer } from '@/lib/serverActions/edtorServerAction';
import { allFetchEdtiorServer } from '@/lib/serverActions/edtorServerAction';
import { NoteCategory } from './../types/index';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Note extends JSONContent {
    noteId?: number | null;
    title?: string | null;
    mainCategory?: NoteCategory | null;
    subCategory?: SubCategory | null;
    content?: JSONContent[] | null;
}

export interface SubCategory {
    id: number;
    name: string;
  }

export interface EditorActions {
    setContent: (note: Note) => void;
    saveToLocal: () => void;
    saveToServer: () => Promise<boolean>;
    loadFromLocal: () => Note | null;
    deleteLocal: ()=> Promise<boolean>;
    setHasLocalChanges: (value: boolean) => void;
    deleteSubCategory: (id: number) => void;
    setSubCategories: (subCategories: SubCategory[]) => void;
    setEditorState: (state: EditorState) => void
}

export const defaultInitContent: Note = {
    noteId: null,
    title: '',
    mainCategory: "Android",
    subCategory: null,
    content: [
        {
            type: 'heading',
            attrs: {
              textAlign: 'left',
              level: 3,
            },
            content: [
              {
                type: 'emoji',
                attrs: {
                  name: 'fire',
                },
              },
              {
                type: 'text',
                text: '내용을 작성해주세요',
              },
            ],
          },
    ],
}

export interface EditorState {
    subCategories: SubCategory[];
    hasLocalChanges: boolean
}

export type EditorStore = Note & EditorActions & EditorState



export const createEditorStore = (initState: Note = defaultInitContent) => {
    return createStore<EditorStore>()(
        subscribeWithSelector((set, get) => ({
            ...initState,
            subCategories: [],
            hasLocalChanges: false,
            setEditorState: (values) => set((state) => ({...state, ...values})),
            setContent: (note) => set((state) => ({ ...state, ...note })),
            saveToLocal: () => {

                const newData = get()
                const newNote: Note = {
                    noteId: newData.noteId,
                    title: newData.title,
                    subCategory: newData.subCategory,
                    mainCategory: newData.mainCategory,
                    content: newData.content
                }

                if (newData) {
                    localStorage.setItem('editorAutoSave', JSON.stringify(newNote));
                    set({ hasLocalChanges: true });
                }

                console.log("local저장", newNote)
            },
            deleteLocal: async () => {
                try {
                    localStorage.removeItem('editorAutoSave');
                              
                  return true; // 성공적으로 삭제됨
                } catch (error) {
                  console.error("Error deleting local data:", error);
                  return false; // 삭제 실패
                }
              },
            saveToServer: async () => {
                try {
                    console.log('실행됨 2')
                let note = get();

                const jsonData = await allFetchEdtiorServer()

                const allFetchData: Note[] = JSON.parse(jsonData)

                if (allFetchData && allFetchData.length > 0) {
                    const lastData = allFetchData[allFetchData.length - 1];
                    note.noteId = lastData.noteId + 1;
                    console.log('널이 아니고 데이터가 있습니다.');
                } else {
                    // 배열이 비어있거나 null인 경우
                    console.log('데이터가 없습니다.');
                    note.noteId += 1; // note.noteId를 안전하게 증가시키려면 초기값 확인 필요
                }

                const newData = {
                    noteId: note.noteId,
                    title: note.title,
                    mainCategory: note.mainCategory,
                    subCategory: note.subCategory,
                    content: note.content
                }

                if(newData) {
                    console.log('에디터 서버 실행')
                    const noteData = await addEdtiorServer(JSON.stringify(newData))
                    
                    if(noteData.success) {

                        localStorage.removeItem('editorAutoSave');

                        set({defaultInitContent})

                        return true
                    }
                    
                }
                    
                } catch (error) {
                 console.log(error)
                    return false
                }
                
            },
            loadFromLocal: () => {
                const saved = localStorage.getItem('editorAutoSave');
                const subCatSaved = localStorage.getItem('subCategories')

                if (saved) {
                    const loadedNote: Note = JSON.parse(saved);

                    set({ ...loadedNote, hasLocalChanges: true });
                    return loadedNote;
                }

                if(subCatSaved) {

                    const loadedSubCate: SubCategory[] = JSON.parse(subCatSaved);

                    set({subCategories: loadedSubCate})
                }
            },
            setHasLocalChanges: (value) => set({ hasLocalChanges: value }),
            deleteSubCategory: (id) => set((state) => ({
                subCategories: state.subCategories.filter(cat => cat.id !== id)
            })),
            setSubCategories: (subCategories) => {

                set({ subCategories })

                localStorage.setItem('subCategories', JSON.stringify(subCategories));
            },    
        }))
    )
}


