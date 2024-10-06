import { Timestamp } from "firebase/firestore";
import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export type Post = {
  id: string;
  listNumber: string;
  writer: string;
  password: string;
  title: string;
  content: string;
  created_at: string;
  comments: Comment[];
}

export type Comment = {
  id: string;
  writer: string;
  content: string;
  password: string;
  created_at: Timestamp;
  replys: Reply[];
}

export type Reply = {
  id: string;
  writer: string;
  personId: string;
  content: string;
  password: string;
  created_at: string
}

export type Notice = {
  id: string;
  listNumber: string;
  writer: string;
  password: string;
  title: string;
  content: string;
  created_at: string;
  comments: any[];
}


const columns = [
  {name: "번호", uid: "listNumber", sortable: true},
  {name: "글쓴이", uid: "writer"},
  {name: "제목", uid: "title"},
  {name: "내용", uid: "content"},
  {name: "생성일자", uid: "created_at", sortable: true},
  {name: "액션", uid: "actions"}
];

export type CustomModalType = 'detail' | 'edit' | 'delete' | 'add' | 'deleteAuth' | 'editAuth' | 'passwordModal'

export type FocusedPostType = {
  focusedPost: Post | null,
  modalType: CustomModalType,
  appName?: string
}

export type FocusedNoticeType = {
  focusedNotice: Notice | null,
  modalType: CustomModalType,
  appName?: string
}

export type NoteCategory = 'Android' | 'Ios' | 'react' | 'python';

export const noteCategories: NoteCategory[] = ['Android', 'Ios', 'react', 'python'];




export default columns