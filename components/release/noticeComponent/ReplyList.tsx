"use client"

import { Textarea } from "@nextui-org/react";

// 답글 컴포넌트
const ReplyList = ({ 
  reply, 
  commentId, 
  noticeId, 
  onDeleteReply, 
  replyAddToggle 
}) => {
  return (
    <div className="flex flex-col w-full space-y-1">
      <div className="flex flex-row w-full items-start space-x-1">
        <p className="text-blue-500">{reply.personId !== "" ? `@${reply.personId}` : ""}</p>
        <p>@{reply.writer}</p>
      </div>
      <Textarea
        isReadOnly
        variant="bordered"
        placeholder="Enter your description"
        defaultValue={reply.content}
        className="w-full h-auto text-[1rem]" 
      />
      <div className="flex w-full flex-row space-x-3 pt-1 justify-end items-end">
        <h1 
          className="flex flex-row space-x-2 pr-1 text-white cursor-pointer" 
          onClick={() => {
            replyAddToggle({
              commentId: commentId,
              replyId: reply.writer
            });
          }}
        >
          답글쓰기
        </h1>
        <h1 
          className="flex flex-row space-x-2 pr-1 text-white cursor-pointer" 
          onClick={() => {
            onDeleteReply?.({
              noticeId: noticeId,
              commentId: commentId,
              replyId: reply.id,
              replyPassword: reply.password
            });
          }}
        >
          답글삭제
        </h1>
      </div>
    </div>
  );
};

export default ReplyList;