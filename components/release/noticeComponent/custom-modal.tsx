"use client"

import { useState, useEffect } from "react";
import {
  ModalHeader, ModalBody, ModalFooter, Button, Input, 
  CircularProgress, Textarea
} from "@nextui-org/react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../../icons";
import { toast } from 'react-toastify';
import CommentSection from "./CommnetSection";
import { CustomModalType, Post } from "@/types";
import { User } from "next-auth";


const NoticeCustomModal = ({
    user,
    focusedNotice,
    modalType,
    appName,
    onDeleteAuth,
    onAddComment,
    ondeleteComment,
    onEditAuth,
    onClose,
    onEdit,
    onDelete,
    onAddReply,
    onDeleteReply,
    onAdd,
    onEditComment, }: {
      user: User,
        focusedNotice?: Post,
        appName?: string,
        modalType: CustomModalType,
        onDeleteAuth?: (notice: Post) => void,
        onEditAuth?: (notice: Post) => void,
        onClose: () => void,
        onEdit?: (id: string, title: string, content: string) => void
        onDelete?: (id: string) => void
        onAddComment?: (
            values: {
                noticeId: string;
                writer: string;
                content: string;
                password: string;
            }
        ) => void
        onEditComment?: (
          values:{
            noticeId: string;
            commentId: string;
            email: string;
            content: string;}
           ) => void
        ondeleteComment?: (
            values: {
                noticeId: string;
                commentId: string;
                commentEmail: string;
            }
        ) => void
        onAdd?: (values: {
            writer: string;
            title: string;
            content: string;
        }) => void
        onAddReply?: (
            values: {
                noticeId: string;
                personId: string;
                commentId: string;
                writer: string;
                content: string;
                password: string;
            }
        ) => void
        onDeleteReply?: (
            values: {
                noticeId: string,
                commentId: string,
                replyId: string,
                replyPassword: string
            }
        ) => void
    }) => {
  const [localNoticeData, setLocalNoticeData] = useState(focusedNotice);
  const [isLoading, setIsLoading] = useState(false);

  // 공지사항 수정 관련 상태
  const [editedNoticeTitleInput, setEditedNoticeTitleInput] = useState(localNoticeData?.title ?? "");
  const [editedNoticeContentInput, setEditedNoticeContentInput] = useState(localNoticeData?.content ?? "");
  const [editedIsVisible, setEditedIsVisible] = useState(false);

  // 공지사항 추가 관련 상태
  const [addedNoticeWriterInput, setAddedNoticeWriterInput] = useState("운영자");
  const [addedNoticePasswordInput, setAddedNoticePasswordInput] = useState("");
  const [addedNoticeTitleInput, setAddedNoticeTitleInput] = useState("");
  const [addedNoticeContentInput, setAddedNoticeContentInput] = useState("");
  const [addedIsVisible, setAddedIsVisible] = useState(false);

  // 댓글 관련 상태
  const [selectedComment, setSelectedComment] = useState("");
  const [hiddenReplies, setHiddenReplies] = useState({});
  const [hiddenAddReply, setHiddenAddReply] = useState(false);
  const [replyId, setReplyId] = useState("");

  // 포커스된 공지사항이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalNoticeData(focusedNotice);
  }, [focusedNotice]);

  // 토글 함수들
  const editedToggleVisibility = () => setEditedIsVisible(!editedIsVisible);
  const addedToggleVisibility = () => setAddedIsVisible(!addedIsVisible);

  const [hiddenComment, setHiddenComment] = useState(false);
  const commentToggleOpen = () => setHiddenComment(!hiddenComment);

  const replyAddToggle = ({ commentId, replyId }) => {
    setHiddenAddReply(!hiddenAddReply);
    replyId ? setReplyId(replyId) : setReplyId("");
    // setSelectedComment(commentId);
  };

  const replyToggleOpen = (commentId) => {
    setHiddenReplies(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  const notifySuccessEvent = (msg) => toast.success(msg);

  // 모달 컨텐츠 - 상세보기
  const DetailModal = () => (
    <>
      <ModalHeader className="flex flex-col gap-1">게시글 상세보기</ModalHeader>
      <ModalBody>
        <p><span className="font-bold">글쓴이 : </span>{localNoticeData?.writer ?? ""}</p>
        <p className="font-bold text-[1rem]"><span className="font-bold text-[1rem]">제목 : </span>{localNoticeData?.title ?? ""}</p>
        <p>내용</p>
        <Textarea
          isReadOnly
          variant="bordered"
          placeholder="Enter your description"
          defaultValue={localNoticeData?.content ?? ""}
          className="w-full text-[1rem]"
        />
        <div className="flex py-1 space-x-4">
          <span className="font-bold">작성일 : </span>
          <p>{`${localNoticeData?.created_at ?? ""}`}</p>
        </div>

        {/* 댓글 섹션 */}
        <CommentSection
          user={user}
          localNoticeData={localNoticeData}
          onEditComment={onEditComment}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onAddComment={onAddComment}
          ondeleteComment={ondeleteComment}
          onAddReply={onAddReply}
          onDeleteReply={onDeleteReply}
          hiddenReplies={hiddenReplies}
          replyToggleOpen={replyToggleOpen}
          hiddenAddReply={hiddenAddReply}
          replyId={replyId}
          replyAddToggle={replyAddToggle}
          notifySuccessEvent={notifySuccessEvent}
          hiddenComment={hiddenComment}
          commentToggleOpen={commentToggleOpen}
        //   hiddenAddComment={hiddenAddComment}
        //   addCommentToggle={addCommentToggle}
        />
      </ModalBody>

      <ModalFooter>
        <Button color="default" onPress={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </>
  );

  // 모달 컨텐츠 - 관리자 확인
  const CheckAdminHandler = (modalType) => {
    // 관리자인 경우 바로 작업 수행
    if (user?.role === "admin") {
      switch (modalType) {
        case 'deleteAuth':
          onDeleteAuth?.(localNoticeData);
          break;
        case 'editAuth':
          onEditAuth?.(localNoticeData);
          break;
        default:
          break;
      }
      return null; // 모달을 표시하지 않음
    } 
    
    // 관리자가 아닌 경우 알림 모달 표시
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">권한 오류</ModalHeader>
        <ModalBody>
          <div className="space-y-4 py-2 text-center">
            <div className="text-danger text-xl">
              <p>관리자 권한이 필요합니다</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              이 작업은 관리자만 수행할 수 있습니다.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            확인
          </Button>
        </ModalFooter>
      </>
    );
  };

  // 모달 컨텐츠 - 수정
  const EditModal = () => (
    <>
      <ModalHeader className="flex flex-col gap-1">공지사항 수정</ModalHeader>
      <ModalBody>
        <p className="ps-1"><span className="font-bold">글쓴이 : </span>{localNoticeData?.writer}</p>
        <Input
          isRequired
          type="text"
          label="제목"
          placeholder="제목을 입력해주세요"
          variant="bordered"
          defaultValue={localNoticeData?.title}
          value={editedNoticeTitleInput}
          onValueChange={setEditedNoticeTitleInput}
        />

        <Textarea
          label="내용"
          type="text"
          placeholder="내용을 입력해주세요"
          className=""
          variant="bordered"
          value={editedNoticeContentInput}
          onValueChange={setEditedNoticeContentInput}
        />

        <div className="flex py-1 space-x-4">
          <span className="font-bold">작성일 : </span>
          <p>{`${localNoticeData?.created_at}`}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="warning" variant="flat" onPress={() => {
          setIsLoading(true);
          onEdit?.(
            localNoticeData?.id ?? "",
            editedNoticeTitleInput,
            editedNoticeContentInput
          );
        }}>
          {isLoading ? <CircularProgress
            size="sm"
            color="warning"
            aria-label="Loading..." /> : '수정'}
        </Button>
        <Button color="default" onPress={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </>
  );

  // 모달 컨텐츠 - 삭제
  const DeleteModal = () => (
    <>
      <ModalHeader className="flex flex-col gap-1">공지사항을 삭제하시겠습니까?</ModalHeader>
      <ModalBody>
        <p><span className="font-bold">글쓴이 : </span>{localNoticeData?.writer}</p>
        <p className="font-bold text-[1rem]"><span className="font-bold text-[1rem]">제목 : </span>{localNoticeData?.title}</p>
        <Textarea
          isReadOnly
          label="내용"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Enter your description"
          defaultValue={localNoticeData?.content}
          className="max-w-xs text-[1rem]"
        />
        <div className="flex py-1 space-x-4">
          <span className="font-bold">작성일 : </span>
          <p>{`${localNoticeData?.created_at}`}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={() => {
          setIsLoading(true);
          onDelete?.(localNoticeData?.id ?? "");
        }}>
          {isLoading ? <CircularProgress
            size="sm"
            color="danger"
            aria-label="Loading..." /> : '삭제'}
        </Button>
        <Button color="default" onPress={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </>
  );

  // 모달 컨텐츠 - 추가
  const AddModal = () => (
    <>
      <ModalHeader className="flex flex-col gap-1">공지사항 작성</ModalHeader>
      <ModalBody>
        <Input className="pt-5 max-w-full"
          isRequired
          type="text"
          label="제목"
          placeholder="제목을 입력해주세요"
          variant="bordered"
          value={addedNoticeTitleInput}
          onValueChange={setAddedNoticeTitleInput}
        />

        <Textarea
          label="내용"
          type="text"
          placeholder="내용을 입력해주세요"
          className=""
          variant="bordered"
          value={addedNoticeContentInput}
          onValueChange={setAddedNoticeContentInput}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="warning" variant="flat" onPress={() => {
          setIsLoading(true);
          onAdd?.({
            writer: "운영자",
            title: addedNoticeTitleInput,
            content: addedNoticeContentInput,
          });
        }}>
          {isLoading ? <CircularProgress
            size="sm"
            color="warning"
            aria-label="Loading..." /> : '완료'}
        </Button>

        <Button color="default" onPress={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </>
  );

  // 모달 타입에 따라 적절한 컨텐츠 반환
  const getModal = (type) => {
    switch (type) {
      case 'add': return AddModal();
      case 'detail': return DetailModal();
      case 'delete': return DeleteModal();
      case 'edit': return EditModal();
      case 'deleteAuth': return CheckAdminHandler(type);
      case 'editAuth': return  CheckAdminHandler(type);
      case 'passwordModal': return  CheckAdminHandler(type);
      default: break;
    }
  };

  return <>{getModal(modalType)}</>;
};

export default NoticeCustomModal;