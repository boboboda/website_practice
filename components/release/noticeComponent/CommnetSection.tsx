"use client"

import { useState } from "react";
import { 
  Card, CardBody, CardFooter, Button, Input, Textarea, 
  CircularProgress, Divider, ScrollShadow 
} from "@nextui-org/react";
import { AngleDownIcon, AngleUpIcon } from "@/components/icons";
import ModalInput from "../postComponent/modal-Input";
import ReplyList from "./ReplyList";

// 댓글 작성 컴포넌트
const CommentAdd = ({
  addedCommentWriterInput, setAddedCommentWriterInput,
  addedCommentPasswordInput, setAddedCommentPasswordInput,
  addedCommentContentInput, setAddedCommentContentInput,
  onAddComment, localNoticeData, notifySuccessEvent, isLoading, setIsLoading
}) => {
  const handleSubmit = () => {
    setIsLoading(true);
    
    // 입력값 검증
    if (!addedCommentWriterInput || !addedCommentPasswordInput || !addedCommentContentInput) {
      notifySuccessEvent("빈칸이 존재합니다. 입력후 작성해주세요");
      setIsLoading(false);
      return;
    }

    // 댓글 추가 처리
    onAddComment?.({
      noticeId: localNoticeData?.id ?? "",
      writer: addedCommentWriterInput,
      content: addedCommentContentInput,
      password: addedCommentPasswordInput
    });
    
    // 입력 필드 초기화
    new Promise(f => setTimeout(f, 1000)); // 약간의 지연
    setAddedCommentContentInput("");
    setAddedCommentPasswordInput("");
    setAddedCommentWriterInput("");
    setIsLoading(false);
  };

  return (
    <Card className="w-full mb-4">
      <CardBody>
        <h3 className="text-lg font-semibold mb-2">댓글 작성</h3>
        <div className="flex flex-row items-center space-x-4">
          <div className="flex flex-col w-full space-x-1">
            <Input
              isRequired
              type="text"
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              variant="bordered"
              value={addedCommentWriterInput}
              onValueChange={setAddedCommentWriterInput}
            />
            <Input
              isRequired
              label="비밀번호"
              placeholder="비밀번호을 입력해주세요"
              variant="bordered"
              type="password"
              value={addedCommentPasswordInput}
              onValueChange={setAddedCommentPasswordInput}
            />
          </div>

          <div className="flex w-full">
            <Textarea
              label="댓글"
              type="text"
              placeholder="댓글을 입력해주세요"
              variant="bordered"
              value={addedCommentContentInput}
              onValueChange={setAddedCommentContentInput}
            />
          </div>
        </div>
        <div className="flex w-full justify-end mt-2">
          <Button 
            color="warning" 
            variant="flat" 
            onPress={handleSubmit}
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

// 댓글 수정 컴포넌트
const CommentEdit = ({ 
  editCommentContent, setEditCommentContent, 
  editCommentPassword, setEditCommentPassword, 
  onCancelEdit, onSaveEdit 
}) => (
  <div className="flex flex-col w-full space-y-3">
    <Textarea
      label="댓글 내용"
      value={editCommentContent}
      onValueChange={setEditCommentContent}
      variant="bordered"
    />
    <div className="flex space-x-3 items-center">
      <Input
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 입력해주세요"
        value={editCommentPassword}
        onValueChange={setEditCommentPassword}
        variant="bordered"
        className="w-1/2"
      />
      <div className="flex space-x-2">
        <Button 
          color="primary" 
          size="sm"
          onClick={onSaveEdit}
        >
          저장
        </Button>
        <Button 
          variant="flat" 
          size="sm"
          onClick={onCancelEdit}
        >
          취소
        </Button>
      </div>
    </div>
  </div>
);

// 댓글 섹션 컴포넌트
const CommentSection = ({
  localNoticeData,
  addedCommentWriterInput, setAddedCommentWriterInput,
  addedCommentPasswordInput, setAddedCommentPasswordInput,
  addedCommentContentInput, setAddedCommentContentInput,
  editingCommentId, setEditingCommentId,
  editCommentContent, setEditCommentContent,
  editCommentPassword, setEditCommentPassword,
  isLoading, setIsLoading,
  onAddComment, ondeleteComment, onAddReply, onDeleteReply,
  hiddenReplies, replyToggleOpen, hiddenAddReply, selectedComment, replyId, replyAddToggle,
  notifySuccessEvent,
  hiddenComment, commentToggleOpen
}) => {
  return (
    <div className="flex w-full flex-col py-1 space-y-3 items-center justify-center">
      {/* 댓글 토글 버튼 - 댓글쓰기 버튼 제거, 댓글 보기만 유지 */}
      <div className="flex w-full flex-row justify-end items-end">
        <h1 
          className="flex flex-row space-x-2 text-blue-500 cursor-pointer" 
          onClick={commentToggleOpen}
        >
          <p>댓글</p>
          {hiddenComment ? <AngleDownIcon size={15} /> : <AngleUpIcon size={15} />}
        </h1>
      </div>

      {/* 댓글 목록 및 입력 영역 */}
      <div className={`flex w-full flex-col justify-end items-end ${hiddenComment ? 'block' : 'hidden'}`}>
        <Divider className="my-4" />

        {/* 댓글 입력 영역 - 리스트 최상단에 배치 */}
        <CommentAdd
          addedCommentWriterInput={addedCommentWriterInput}
          setAddedCommentWriterInput={setAddedCommentWriterInput}
          addedCommentPasswordInput={addedCommentPasswordInput}
          setAddedCommentPasswordInput={setAddedCommentPasswordInput}
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
          <div
            className="flex flex-col w-full max-h-[600px] items-center overflow-auto"
          >
            <div className="flex flex-col w-full space-y-1">
              <div className="space-y-3">
                {localNoticeData?.comments && localNoticeData.comments.length > 0 ? (
                  localNoticeData.comments.map((comment) => (
                    <CommentsList
                      key={comment.id}
                      comment={comment}
                      noticeId={localNoticeData.id}
                      editingCommentId={editingCommentId}
                      setEditingCommentId={setEditingCommentId}
                      editCommentContent={editCommentContent}
                      setEditCommentContent={setEditCommentContent}
                      editCommentPassword={editCommentPassword}
                      setEditCommentPassword={setEditCommentPassword}
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

// 댓글 컴포넌트
const CommentsList = ({
  comment,
  noticeId,
  editingCommentId,
  setEditingCommentId,
  editCommentContent,
  setEditCommentContent,
  editCommentPassword,
  setEditCommentPassword,
  ondeleteComment,
  hiddenReplies,
  replyToggleOpen,
  hiddenAddReply,
  selectedComment,
  replyId,
  replyAddToggle,
  notifySuccessEvent,
  onAddReply,
  localNoticeData,
  onDeleteReply
}) => {
  const isEditing = editingCommentId === comment.id;
  
  // 수정 모드 토글
  const toggleEditMode = () => {
    if (isEditing) {
      setEditingCommentId(null);
    } else {
      setEditingCommentId(comment.id);
      setEditCommentContent(comment.content);
      setEditCommentPassword("");
    }
  };
  
  // 댓글 수정 제출
  const handleEditSubmit = () => {
    if (editCommentPassword === "") {
      notifySuccessEvent("비밀번호를 입력해주세요");
      return;
    }
    
    // 댓글 수정 함수 호출 (추후 구현)
    // onEditComment?.({
    //   noticeId,
    //   commentId: comment.id,
    //   content: editCommentContent,
    //   password: editCommentPassword
    // });
    
    // 수정 모드 종료
    setEditingCommentId(null);
  };

  return (
    <>
      <Card key={comment.id}>
        <CardBody className="flex flex-col w-full overflow-auto items-center space-x-3">
          <div className="flex h-auto w-full items-center space-x-4 text-small">
            <div className="w-1/5 items-start">{comment.writer}</div>
            <div className="w-3/5 h-auto text-center">{comment.created_at}</div>
            <div className="w-1/5 flex justify-end space-x-2">
              {!isEditing && (
                <>
                  <Button 
                    variant="faded" 
                    size="sm"
                    onClick={toggleEditMode}
                  >
                    수정
                  </Button>
                  <Button 
                    variant="faded" 
                    size="sm" 
                    onClick={() => {
                      ondeleteComment?.({
                        noticeId,
                        commentId: comment.id,
                        commentPassword: comment.password
                      });
                    }}
                  >
                    삭제
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          {isEditing ? (
            <CommentEdit 
              editCommentContent={editCommentContent}
              setEditCommentContent={setEditCommentContent}
              editCommentPassword={editCommentPassword}
              setEditCommentPassword={setEditCommentPassword}
              onCancelEdit={() => setEditingCommentId(null)}
              onSaveEdit={handleEditSubmit}
            />
          ) : (
            <div className="flex w-full h-auto">{comment.content}</div>
          )}
        </CardFooter>
      </Card>

      {/* 답글 관련 UI */}
      <div className="flex w-full flex-row space-x-5 justify-end items-end">
        <h1 
          className="flex flex-row space-x-2 text-white cursor-pointer" 
          onClick={() => replyAddToggle({ commentId: comment.id })}
        >
          답글쓰기
        </h1>

        <h1 
          className="flex flex-row space-x-2 text-blue-500 cursor-pointer" 
          onClick={() => replyToggleOpen(comment.id)}
        >
          <p>답글</p>
          {hiddenReplies[comment.id] ? <AngleDownIcon size={15} /> : <AngleUpIcon size={15} />}
        </h1>
      </div>

      {/* 답글 목록 및 입력 */}
      <div className="flex w-full flex-col space-y-3 justify-end items-end">
        <div className={`flex w-full flex-col space-y-5 justify-center items-center content ${hiddenReplies[comment.id] ? 'open' : ''}`}>
          <ScrollShadow 
            className="flex flex-col pl-8 w-full max-h-[400px] min-h-[120px] items-center"
            isEnabled={false}
          >
            {comment?.replys?.map((reply) => (
              <ReplyList 
                key={reply.id} 
                reply={reply} 
                commentId={comment.id} 
                noticeId={noticeId}
                onDeleteReply={onDeleteReply}
                replyAddToggle={replyAddToggle}
              />
            ))}
          </ScrollShadow>
          <Divider className="my-4" />
        </div>

        <div className={`flex w-full flex-col space-y-5 justify-center items-center content ${hiddenAddReply ? 'open' : ''}`}>
          <div className="flex flex-col w-full pt-3">
            <ModalInput
              personId={replyId}
              writed={async (values) => {
                onAddReply?.({
                  noticeId: localNoticeData?.id ?? "",
                  personId: replyId ?? "",
                  commentId: selectedComment,
                  writer: values.replyWirter,
                  content: values.replyContent,
                  password: values.replyPassword
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentSection;