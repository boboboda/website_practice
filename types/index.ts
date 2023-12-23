import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export type Post = {
  id: string;
  listNumber: String;
  writer: string;
  passward: string;
  title: string;
  contents: string;
  created_at: Date;
  updated_at: Date;
}

export type CustomModalType = 'detail' | 'edit' | 'delete'

export type FocusedPostType = {
  focusedPost: Post | null,
  modalType: CustomModalType,
}