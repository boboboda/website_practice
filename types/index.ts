import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export type Post = {
  id: string;
  listNumber: String;
  writer: string;
  password: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}


const columns = [
  {name: "번호", uid: "listNumber", sortable: true},
  {name: "글쓴이", uid: "writer"},
  {name: "제목", uid: "title"},
  {name: "내용", uid: "content"},
  {name: "생성일자", uid: "created_at", sortable: true},
  {name: "액션", uid: "actions"},
];

export type CustomModalType = 'detail' | 'edit' | 'delete' | 'add'

export type FocusedPostType = {
  focusedPost: Post | null,
  modalType: CustomModalType,
}


export default columns