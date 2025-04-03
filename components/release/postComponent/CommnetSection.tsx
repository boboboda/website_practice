"use client"

import { useState } from "react";
import { 
  Card, CardBody, CardFooter, Button, Input, Textarea, 
  CircularProgress, Divider, ScrollShadow 
} from "@nextui-org/react";
import { AngleDownIcon, AngleUpIcon } from "@/components/icons";
import ModalInput from "../postComponent-dummy/modal-Input";
import { Reply } from "lucide-react";
import ReplySection from "./ReplySection";

// 댓글 섹션 컴포넌트
const CommentSection = ({
  user,
  localPostData,
  onEditComment,
  isLoading, 
  setIsLoading,
  onAddComment, 
  ondeleteComment, 
  onAddReply, 
  onDeleteReply,
  onEditReply,
  notifySuccessEvent,
  hiddenComment, commentToggleOpen
}) => {

  console.log("댓글 섹션", localPostData?.comments);

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
          user={user}
          onAddComment={onAddComment}
          localPostData={localPostData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* 댓글 리스트 */}
        <div className="w-full">
          <div className="flex flex-col w-full max-h-[600px] items-center overflow-auto">
            <div className="flex flex-col space-y-1 w-[95%] mr-3">
              <div className="space-y-3 w-full mb-2">              
                {
                localPostData?.comments && localPostData.comments.length > 0 ? (
                  localPostData.comments.map((comment) => (
                    <CommentsList
                      key={comment.id}
                      user={user}
                      comment={comment}
                      PostId={localPostData.id}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      onEditComment={onEditComment}
                      ondeleteComment={ondeleteComment}
                      onAddReply={onAddReply}
                      onDeleteReply={onDeleteReply}
                      onEditReply={onEditReply} 
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


// 댓글 작성 컴포넌트
const CommentAdd = ({
  user,
  onAddComment, localPostData, isLoading, setIsLoading
}) => {

  const [addedCommentContentInput, setAddedCommentContentInput] = useState("");

  const handleSubmit = () => {
    setIsLoading(true);

    // 댓글 추가 처리
    onAddComment?.({
      postId: localPostData?.id ?? "",
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
        {/* <h3 className="text-lg font-semibold mb-2">댓글 작성</h3> */}
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

// 댓글 수정 컴포넌트
const CommentEdit = ({ 
  editCommentContent, setEditCommentContent,
  onCancelEdit, onSaveEdit 
}) => (
  <div className="flex flex-col w-full space-y-3">
    <Textarea
      label="댓글 내용"
      value={editCommentContent}
      onValueChange={setEditCommentContent}
      variant="bordered"
    />
    <div className="flex space-x-3 items-center justify-end">
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



// 댓글 컴포넌트
const CommentsList = ({
  user,
  comment,
  PostId,
  onEditComment,
  ondeleteComment,
  onAddReply,
  onDeleteReply,
  onEditReply,
  isLoading, setIsLoading,
}) => {
const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const [hiddenReplies, setHiddenReplies] = useState(false);
  const replyToggleOpen = () => setHiddenReplies(!hiddenReplies);

  const isEditing = editingCommentId === comment.id;

  // 수정 모드 토글
  const toggleEditMode = () => {
    if (isEditing) {
      setEditingCommentId(null);
    } else {
      setEditingCommentId(comment.id);
      setEditCommentContent(comment.content);
      
    }
  };

  return (
    <>
      <Card key={comment.id} className="custom-shadow">
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

                      console.log("삭제 클릭", comment.id, PostId, comment.email);

                      ondeleteComment?.({
                        userId: user.id,
                        PostId,
                        commentId: comment.id,
                        commentEmail: comment.email,
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
        <CardFooter className="flex flex-col items-start w-full">
          {isEditing ? (
            <CommentEdit 
              editCommentContent={editCommentContent}
              setEditCommentContent={setEditCommentContent}
              onCancelEdit={() => setEditingCommentId(null)}
              onSaveEdit={() => {
                onEditComment?.({
                  PostId,
                  commentId: comment.id,
                  content: editCommentContent,
                  email: comment.email});
                
                // 수정 모드 종료
                setEditingCommentId(null);
              }}
            />
          ) : (
            <div className="flex w-full h-auto mb-3">{comment.content}</div>
          )}

          {/*답글 섹션*/}
          <div className="w-full mt-2">
            <ReplySection
              user={user}
              postId={PostId}
              comment={comment}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onAddReply={onAddReply}
              onDeleteReply={onDeleteReply}
              onEditReply={onEditReply}
              hiddenReplies={hiddenReplies}
              replyToggleOpen={replyToggleOpen}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default CommentSection;