"use client"

import {
    ModalHeader, ModalBody, Modal, ModalContent,
    ModalFooter, Button, Input, checkbox, Switch, CircularProgress, ScrollShadow, Textarea, useDisclosure, Accordion, AccordionItem, Divider, Card, CardHeader, CardBody, CardFooter
} from "@nextui-org/react";
import React from 'react';
import { Post, FocusedPostType, CustomModalType, Notice, Comment, Reply } from "@/types";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../../icons";
import { deleteAComment, fetchAPost } from "@/lib/data/firebase";
import { useRouter, usePathname } from "next/navigation"
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { AngleDownIcon, AngleUpIcon } from "@/components/icons";
import ModalInput from "../postComponent/modal-Input";


const NoticeCustomModal = ({
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
    onAdd }: {
        focusedNotice?: Notice,
        appName?: string,
        modalType: CustomModalType,
        onDeleteAuth?: (notice: Post) => void,
        onEditAuth?: (notice: Post) => void,
        onClose: () => void,
        onEdit?: (id: string, title: string, password: string, content: string) => void
        onDelete?: (id: string) => void
        onAddComment?: (
            values: {
                noticeId: string;
                writer: string;
                content: string;
                password: string;
            }
        ) => void
        ondeleteComment?: (
            values: {
                noticeId: string;
                commentId: string;
                commentPassword: string
            }
        ) => void
        onAdd?: (values: {
            writer: string;
            title: string;
            content: string;
            password: string;
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

    useEffect(() => {
        setLocalNoticeData(focusedNotice);
    }, [focusedNotice]);

    const router = useRouter();

    const path = usePathname();

    const notifySuccessEvent = (msg: string) => toast.success(msg);

    //로딩 상태
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    //true-> 삭제, 수정, 상세정보 - 데이터가 있는 경우
    //false-> 생성 - 데이터가 없는경우

    const [editedNoticePasswordInput, setEditedNoticePasswordInput] = useState<string>(localNoticeData?.password ?? "");

    const [editedNoticeTitleInput, setEditedNoticeTitleInput] = useState<string>(localNoticeData?.title ?? "");

    const [editedNoticeContentInput, setEditedNoticeContentInput] = useState<string>(localNoticeData?.content ?? "");

    const [editedIsVisible, setEditedIsVisible] = React.useState(false);

    const editedToggleVisibility = () => setEditedIsVisible(!editedIsVisible);



    const [addedCommentPasswordInput, setAddedCommentPasswordInput] = useState<string>("");

    const [addedCommentWriterInput, setAddedCommentWriterInput] = useState<string>("");

    const [addedCommentContentInput, setAddedCommentContentInput] = useState<string>("");


    const [hiddenComment, setHiddenComment] = useState<Boolean>(false);

    const [hiddenAddComment, setHiddenAddComment] = useState<Boolean>(false);

    const [selectedComment, setSelectedComment] = useState<string>("")


    const addCommentToggle = () => {
        setHiddenAddComment(!hiddenAddComment);
    }

    const commentToggleOpen = () => {
        setHiddenComment(!hiddenComment);
    };

    const [hiddenReplies, setHiddenReplies] = useState<{ [commentId: string]: boolean }>({});

    const [hiddenAddReply, setHiddenAddReply] = useState<Boolean>(false);

    const [replyId, setReplyId] = useState<string>("");

    const replyAddToggle = ({ commentId, replyId }: { commentId: string, replyId?: string }) => {
        setHiddenAddReply(!hiddenAddReply)
        replyId ? setReplyId(replyId) : setReplyId("")
        setSelectedComment(commentId)
    }


    const replyToggleOpen = (commentId: string) => {
        setHiddenReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };


    const CommentAdd = () => {

        return (<>
            <div className="flex flex-row items-center space-x-4">
                <div className="flex flex-col w-full space-x-1">
                    <Input
                        isRequired
                        type="text"
                        label="닉네임"
                        placeholder="닉네임을 입력해주세요"
                        variant="bordered"
                        defaultValue=""
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
            <div className="flex w-full justify-end">
                <Button color="warning" variant="flat" onPress={() => {
                    setIsLoading(true);
                    if (addedCommentContentInput === "" && addedCommentPasswordInput === "" && addedCommentWriterInput === "") {
                        notifySuccessEvent("빈칸이 존재합니다. 입력후 작성해주세요")
                        setIsLoading(false);
                    } else {

                        onAddComment?.(
                            {
                                noticeId: localNoticeData?.id ?? "",
                                writer: addedCommentWriterInput,
                                content: addedCommentContentInput,
                                password: addedCommentPasswordInput
                            }
                        )
                        new Promise(f => setTimeout(f, 1000));
                        setAddedCommentContentInput("")
                        setAddedCommentPasswordInput("")
                        setAddedCommentWriterInput("")
                        setIsLoading(false);

                    }


                }}>
                    {isLoading ? <CircularProgress
                        size="sm"
                        color="warning"
                        aria-label="Loading..." /> : '작성'}
                </Button>
            </div>

        </>

        )
    }

    const CommentsList = ({ comment, noticeId }: { comment: Comment, noticeId: any }) => {

        const date = new Date(comment.created_at.seconds * 1000 + comment.created_at.nanoseconds / 1000000);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return (
            <>
                <Card key={comment.id} className="">
                    <CardBody className="flex flex-col w-full overflow-auto items-center space-x-3">
                        <div className="flex h-auto w-full items-center space-x-4 text-small">
                            <div className=" w-1/5 items-start">{comment.writer}</div>

                            <div className="w-3/5 h-auto text-center">{formattedDate}</div>

                            <Button variant="faded" className=" w-1/5 cursor-pointer" onClick={() => {
                                ondeleteComment?.(
                                    {
                                        noticeId,
                                        commentId: comment.id,
                                        commentPassword: comment.password
                                    }
                                )
                            }}>삭제</Button>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <div className="flex w-full h-auto">{comment.content}</div>
                    </CardFooter>
                </Card>

                <div className="flex w-full flex-row space-x-5 justify-end items-end">

                    <h1 className="flex flex-row space-x-2 text-white cursor-pointer" onClick={() => {
                        replyAddToggle({
                            commentId: comment.id
                        })
                    }}>
                        답글쓰기
                    </h1>

                    <h1 className="flex flex-row space-x-2 text-blue-500 cursor-pointer" onClick={() => {
                        replyToggleOpen(comment.id)
                    }}>
                        <p>
                            답글
                        </p>
                        {hiddenReplies[comment.id] ? (<AngleDownIcon size={15} />
                        ) : (
                            <AngleUpIcon size={15} />
                        )}</h1>
                </div>

                <div className="flex w-full flex-col space-y-3 justify-end items-end">

                    <div className={`flex w-full flex-col space-y-5 justify-center items-center content ${hiddenReplies[comment.id] ? 'open' : ''}`}>
                        <ScrollShadow className="flex flex-col pl-8 w-full max-h-[400px] min-h-[120px] items-center"
                            isEnabled={false}
                        >
                            {
                                comment?.replys?.map((reply) => (
                                    <ReplyList key={reply.id} reply={reply} commentId={comment.id} noticeId={noticeId} />
                                ))
                            }
                        </ScrollShadow>

                        <Divider className="my-4" />
                    </div>



                    <div className={`flex w-full flex-col space-y-5 justify-center items-center content ${hiddenAddReply ? 'open' : ''}`}>

                        <div className="flex flex-col w-full pt-3">
                            <ModalInput
                                personId={replyId}
                                writed={async (values) => {
                                    onAddReply?.(
                                        {
                                            noticeId: localNoticeData?.id ?? "",
                                            personId: replyId ?? "",
                                            commentId: selectedComment,
                                            writer: values.replyWirter,
                                            content: values.replyContent,
                                            password: values.replyPassword
                                        }
                                    )
                                }}
                            />
                        </div>
                    </div>

                </div>
            </>

        )
    }

    const ReplyList = ({ reply, commentId, noticeId }: { reply: Reply, commentId: string, noticeId: string }) => {

        return (
            <div className="flex flex-col w-full space-y-1">
                <div className="flex flex-row w-full items-start space-x-1">
                    <p className=" text-blue-500">{reply.personId !== "" ? `@${reply.personId}` : ""}</p>
                    <p>@{reply.writer}</p>
                </div>
                <Textarea
                    isReadOnly
                    variant="bordered"
                    placeholder="Enter your description"
                    defaultValue={reply.content}
                    className="w-full h-auto text-[1rem]" />

                <div className="flex w-full flex-row space-x-3 pt-1 justify-end items-end">

                    <h1 className="flex flex-row space-x-2 pr-1 text-white cursor-pointer" onClick={() => {
                        replyAddToggle({
                            commentId: commentId,
                            replyId: reply.writer
                        })
                    }}>
                        답글쓰기
                    </h1>


                    <h1 className="flex flex-row space-x-2 pr-1 text-white cursor-pointer" onClick={() => {
                        onDeleteReply?.({
                            noticeId: noticeId,
                            commentId: commentId,
                            replyId: reply.id,
                            replyPassword: reply.password
                        })
                    }}>
                        답글삭제
                    </h1>



                </div>
            </div>
        )
    }


    const DetailModal = () => {

        return <>
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

                <div className="flex w-full flex-col py-1 space-x-4 space-y-3 items-center justify-center">
                    <div className="flex w-full flex-row space-x-5 justify-end items-end">

                        <h1 className="flex flex-row space-x-2 text-black dark:text-white cursor-pointer" onClick={() => {
                            addCommentToggle()
                        }}>
                            댓글쓰기
                        </h1>

                        <h1 className="flex flex-row space-x-2 text-blue-500 cursor-pointer" onClick={() => {
                            commentToggleOpen()
                        }}>
                            <p>
                                댓글
                            </p>
                            {hiddenComment ? (<AngleDownIcon size={15} />
                            ) : (
                                <AngleUpIcon size={15} />
                            )}</h1>
                    </div>
                    <div className={`flex w-full flex-col space-y-5 justify-center items-center content ${hiddenAddComment ? 'open' : ''}`}>

                        <div className="flex flex-col w-full pr-3 justify-center">
                            {CommentAdd()}
                        </div>
                    </div>

                    <div className="flex w-full flex-col justify-end items-end">
                        <Divider className="my-4" />

                        <div className={`flex w-full flex-col space-y-5 justify-center items-center content ${hiddenComment ? 'open' : ''}`}>
                            <ScrollShadow
                                className="flex flex-col w-full max-h-[400px] min-h-[120px] items-center"
                                isEnabled={false}
                            >
                                <div className="flex flex-col w-full space-y-1">
                                    <div className=" space-y-3">
                                        {
                                            localNoticeData?.comments.map((comment) => (
                                                <CommentsList key={comment.id} comment={comment} noticeId={localNoticeData.id} />
                                            ))
                                        }
                                    </div>
                                </div>


                            </ScrollShadow>
                            <Divider className="my-4" />


                        </div>

                    </div>

                </div>
            </ModalBody>


            <ModalFooter>
                <Button color="default" onPress={onClose}>
                    닫기
                </Button>
            </ModalFooter>
        </>
    }


    const PasswordModal = (modalType: string) => {
        const [password, setPassword] = useState("");

        const handlePasswordSubmit = async () => {

            if (password === localNoticeData?.password) {
                switch (modalType) {
                    case 'deleteAuth':
                        return onDeleteAuth?.(localNoticeData)
                    case 'editAuth':
                        return onEditAuth?.(localNoticeData)
                    case 'passwordModal':
                        return deleteAComment?.(localNoticeData)
                }
            } else {
                alert(`비밀번호가 틀렸습니다.`);
            }
        };

        return (
            <>
                <ModalHeader className="flex flex-col gap-1">비밀번호를 입력하세요</ModalHeader>
                <ModalBody>
                    <Input
                        isRequired
                        autoFocus
                        label="비밀번호"
                        placeholder="비밀번호을 입력해주세요"
                        variant="bordered"
                        type="password"
                        value={password}
                        onValueChange={setPassword}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={
                        handlePasswordSubmit}>
                        확인
                    </Button>
                    <Button color="default" onPress={onClose}>
                        닫기
                    </Button>
                </ModalFooter>
            </>
        );
    };

    const EditModal = () => {
        return <>
            <ModalHeader className="flex flex-col gap-1">공지사항 수정</ModalHeader>
            <ModalBody>
                <p className=" ps-1"><span className="font-bold">글쓴이 : </span>{localNoticeData?.writer}</p>

                <Input className="max-w-xs"
                    isRequired
                    autoFocus
                    label="비밀번호"
                    placeholder="비밀번호을 입력해주세요"
                    variant="bordered"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={editedToggleVisibility}>
                            {editedIsVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={editedIsVisible ? "text" : "password"}
                    defaultValue={localNoticeData?.password}
                    value={editedNoticePasswordInput}
                    onValueChange={setEditedNoticePasswordInput}
                />

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
                        editedNoticePasswordInput,
                        editedNoticeContentInput);
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
    }

    const DeleteModal = () => {
        return (
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
                </ModalFooter></>
        );

    }

    const [addedNoticeWriterInput, setAddedNoticeWriterInput] = useState<string>("");

    const [addedNoticePasswordInput, setAddedNoticePasswordInput] = useState<string>("");

    const [addedNoticeTitleInput, setAddedNoticeTitleInput] = useState<string>("");

    const [addedNoticeContentInput, setAddedNoticeContentInput] = useState<string>("");

    const [addedIsVisible, setAddedIsVisible] = React.useState(false);

    const addedToggleVisibility = () => setAddedIsVisible(!addedIsVisible);


    const AddModal = () => {
        return <>
            <ModalHeader className="flex flex-col gap-1">공지사항 작성</ModalHeader>
            <ModalBody>
                <div className="flex flex-row space-x-4">
                    <Input
                        isRequired
                        type="text"
                        label="닉네임"
                        placeholder="닉네임을 입력해주세요"
                        variant="bordered"
                        defaultValue=""
                        value={addedNoticeWriterInput}
                        onValueChange={setAddedNoticeWriterInput}
                    />
                    <Input
                        isRequired
                        label="비밀번호"
                        placeholder="비밀번호을 입력해주세요"
                        variant="bordered"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={addedToggleVisibility}>
                                {addedIsVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={addedIsVisible ? "text" : "password"}
                        value={addedNoticePasswordInput}
                        onValueChange={setAddedNoticePasswordInput}
                    />
                </div>

                <Input className="pt-5 max-w-sm"
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
                        writer: addedNoticeWriterInput,
                        title: addedNoticeTitleInput,
                        content: addedNoticeContentInput,
                        password: addedNoticePasswordInput
                    })
                    if (onAdd) {
                        console.log(addedNoticeWriterInput)
                    }
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
    }

    const getModal = (type: CustomModalType) => {

        switch (type) {
            case 'add':
                return AddModal();
            case 'detail':
                return DetailModal();
            case 'delete':
                return DeleteModal();
            case 'edit':
                return EditModal();
            case 'deleteAuth':
                return PasswordModal(type);
            case 'editAuth':
                return PasswordModal(type);
            case 'passwordModal':
                return PasswordModal(type)
            default: break;

        }
    }

    return (
        <>
            {getModal(modalType)}
        </>
    )




}



export default NoticeCustomModal;

