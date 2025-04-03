
"use client"

import { useState } from "react";
import { 
  Card, CardBody, CardFooter, Button, Input, Textarea, 
  CircularProgress, Divider, ScrollShadow 
} from "@nextui-org/react";
import { AngleDownIcon, AngleUpIcon } from "@/components/icons";
import ModalInput from "../postComponent-dummy/modal-Input";
import { set } from "lodash";


const ReplySection = ({
  user,
  comment,
  postId,
  isLoading, setIsLoading,
  onAddReply, onDeleteReply, onEditReply,
  hiddenReplies, replyToggleOpen,
}) => {
  return (
    <div className="flex w-full flex-col py-1 space-y-3 items-center justify-center">
      {/* 댓글 토글 버튼 - 댓글쓰기 버튼 제거, 댓글 보기만 유지 */}
      <div className="flex w-full flex-row justify-end items-end">
        <h1 
          className="flex flex-row space-x-2 text-blue-500 cursor-pointer" 
          onClick={replyToggleOpen}
        >
          <p>답글</p>
          {hiddenReplies ? <AngleDownIcon size={15} /> : <AngleUpIcon size={15} />}
        </h1>
      </div>

      {/* 댓글 목록 및 입력 영역 */}
      <div className={`flex w-full flex-col justify-end items-end ${hiddenReplies ? 'block' : 'hidden'}`}>
        <Divider className="my-4" />

        {/* 댓글 입력 영역 - 리스트 최상단에 배치 */}
        <ReplyAdd
          user={user}
          comment={comment}
           postId={postId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onAddReply={onAddReply}/>

        {/* 댓글 리스트 */}
        <div className="w-full">
          <div className="flex flex-col w-full max-h-[600px] items-center overflow-auto">
            <div className="flex flex-col space-y-1 w-[95%] mr-3">
              <div className="space-y-3 w-full mb-3">
                {comment?.replys && comment.replys.length > 0 ? (
                  comment.replys.map((reply) => (
                    <ReplyList
                      key={reply.id}
                      reply={reply}
                      postId={postId}
                      commentId={comment.id}
                      onDeleteReply={onDeleteReply}
                      onEditReply={onEditReply} // 수정 기능 추가
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
  onAddReply, postId, comment, isLoading, setIsLoading
  }) => {

    const [addReplyContentInput, setAddReplyContentInput] = useState("");

    const handleSubmit = () => {
      setIsLoading(true);
      

      onAddReply?.({
        commentId: comment?.id ?? "",
        postId: postId,
        writer: user.name,
        email: user.email,
        content: addReplyContentInput,
      });
      
      // 입력 필드 초기화
      new Promise(f => setTimeout(f, 1000)); // 약간의 지연
      setAddReplyContentInput("");
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
              placeholder="답글을 입력해주세요"
              variant="bordered"
              className="w-full"
              value={addReplyContentInput}
              onValueChange={setAddReplyContentInput}
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
const ReplyEdit = ({ 
  editReplyContent, setEditReplyContent,
  onCancelEdit, onSaveEdit 
}) => (
  <div className="flex flex-col w-full space-y-3">
    <Textarea
      label="댓글 내용"
      value={editReplyContent}
      onValueChange={setEditReplyContent}
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


  // 답글 컴포넌트

const ReplyList = ({
  reply, 
  postId,
  commentId,
  onDeleteReply,
  onEditReply,
}) => {
const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  const isEditing = editingReplyId === reply.id;

  // 수정 모드 토글
  const toggleEditMode = () => {
    if (isEditing) {
      setEditingReplyId(null);
    } else {
      setEditingReplyId(reply.id);
      setEditReplyContent(reply.content);
      
    }
  };

  return (
    <>
      <Card key={reply.id} className="custom-shadow">
        <CardBody className="flex flex-col w-full overflow-auto items-center space-x-3">
          <div className="flex h-auto w-full items-center space-x-4 text-small">
            <div className="w-1/5 items-start">{reply.writer}</div>
            <div className="w-3/5 h-auto text-center">{reply.created_at}</div>
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
                      onDeleteReply?.({
                        postId: postId,
                        commentId: commentId,
                        replyId: reply.id,
                        replyEmail: reply.email})

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
            <ReplyEdit
              editReplyContent={editReplyContent}
              setEditReplyContent={setEditReplyContent}
              onCancelEdit={() => setEditingReplyId(null)}
              onSaveEdit={() => {
                onEditReply?.({
                  postId,
                  replyId: reply.id,
                  content: editReplyContent,
                  email: reply.email});



                
                // 수정 모드 종료
                setEditingReplyId(null);
              }}
            />
          ) : (
            <div className="flex w-full h-auto">{reply.content}</div>
          )}

        </CardFooter>
      </Card>
    </>
  );
};


export default ReplySection;