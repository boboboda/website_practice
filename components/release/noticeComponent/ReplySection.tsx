
"use client"

import { useState } from "react";
import { 
  Card, CardBody, CardFooter, Button, Input, Textarea, 
  CircularProgress, Divider, ScrollShadow 
} from "@nextui-org/react";
import { AngleDownIcon, AngleUpIcon } from "@/components/icons";
import ModalInput from "../postComponent/modal-Input";
import ReplyList from "./ReplyList";


const ReplySection = ({
  user,
  localNoticeData,
  isLoading, setIsLoading,
  onAddReply, onDeleteReply,
  hiddenReplies, replyToggleOpen, hiddenAddReply, selectedComment, replyId, replyAddToggle,
  notifySuccessEvent,
}) => {
  return (
    <div className="flex w-full flex-col py-1 space-y-3 items-center justify-center">
      {/* 댓글 토글 버튼 - 댓글쓰기 버튼 제거, 댓글 보기만 유지 */}
      <div className="flex w-full flex-row justify-end items-end">
        <h1 
          className="flex flex-row space-x-2 text-blue-500 cursor-pointer" 
          onClick={hiddenReplies}
        >
          <p>답글</p>
          {hiddenComment ? <AngleDownIcon size={15} /> : <AngleUpIcon size={15} />}
        </h1>
      </div>

      {/* 댓글 목록 및 입력 영역 */}
      <div className={`flex w-full flex-col justify-end items-end ${hiddenComment ? 'block' : 'hidden'}`}>
        <Divider className="my-4" />

        {/* 댓글 입력 영역 - 리스트 최상단에 배치 */}
        <CommentAdd
          user={user}
          addedCommentContentInput={addedCommentContentInput}
          setAddedCommentContentInput={setAddedCommentContentInput}
          onAddComment={onAddComment}
          localNoticeData={localNoticeData}
          notifySuccessEvent={notifySuccessEvent}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* 댓글 리스트 */}
        <div className="w-full">
          <div className="flex flex-col w-full max-h-[600px] items-center overflow-auto">
            <div className="flex flex-col space-y-1 w-[95%] mr-3">
              <div className="space-y-3 w-full">
                {localNoticeData?.comments && localNoticeData.comments.length > 0 ? (
                  localNoticeData.comments.map((comment) => (
                    <CommentsList
                      key={comment.id}
                      user={user}
                      comment={comment}
                      noticeId={localNoticeData.id}
                      editingCommentId={editingCommentId}
                      setEditingCommentId={setEditingCommentId}
                      editCommentContent={editCommentContent}
                      setEditCommentContent={setEditCommentContent}
                      onEditComment={onEditComment}
                      ondeleteComment={ondeleteComment}
                      onAddReply={onAddReply}
                      onDeleteReply={onDeleteReply}
                      hiddenReplies={hiddenReplies}
                      replyToggleOpen={replyToggleOpen}
                      hiddenAddReply={hiddenAddReply}
                      selectedComment={selectedComment}
                      replyId={replyId}
                      replyAddToggle={replyAddToggle}
                      notifySuccessEvent={notifySuccessEvent}
                      localNoticeData={localNoticeData}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 my-4">등록된 댓글이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ReplyAdd = ({
    user,

  }) => {
    const handleSubmit = () => {
      setIsLoading(true);
      
      
      // 댓글 추가 처리
      onAddComment?.({
        noticeId: localNoticeData?.id ?? "",
        writer: user.name,
        email: user.email,
        content: addedCommentContentInput,
      });
      
      // 입력 필드 초기화
      new Promise(f => setTimeout(f, 1000)); // 약간의 지연
      setAddedCommentContentInput("");
      setIsLoading(false);
    };
  
    // 로그인 여부에 따라 다른 UI 표시
    if (!user.email) {
      return (
        <Card className="w-full mb-4">
          <CardBody>
            <div className="flex items-center justify-center py-4">
              <p className="text-center text-gray-500">로그인 후 사용할 수 있습니다.</p>
            </div>
          </CardBody>
        </Card>
      );
    }
  
    return (
      <Card className="w-full mb-4">
        <CardBody>
          <h3 className="text-lg font-semibold mb-2">댓글 작성</h3>
          <div className="flex flex-row items-center space-x-2">
            <Input
              type="text"
              placeholder="댓글을 입력해주세요"
              variant="bordered"
              className="w-full"
              value={addedCommentContentInput}
              onValueChange={setAddedCommentContentInput}
            />
            <Button 
              color="warning" 
              variant="flat" 
              onPress={handleSubmit}
              className="ml-2"
            >
              {isLoading ? 
                <CircularProgress size="sm" color="warning" aria-label="Loading..." /> : 
                '작성'
              }
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };