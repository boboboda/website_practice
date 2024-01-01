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
  comments: any[];
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


export default columns