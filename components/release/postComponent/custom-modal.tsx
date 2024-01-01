"use client"

import {
    ModalHeader, ModalBody, Modal, ModalContent,
    ModalFooter, Button, Input, checkbox, Switch, CircularProgress, Textarea, useDisclosure, Accordion, AccordionItem, Divider, Card, CardHeader, CardBody, CardFooter
} from "@nextui-org/react";
import React from 'react';
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../../icons";
import { deleteAComment, fetchAPost } from "@/data/firestore";
import { useRouter, usePathname } from "next/navigation"
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from "react";


const CustomModal = ({ focusedPost, modalType, appName, onDeleteAuth, onAddComment, ondeleteComment, onEditAuth, onClose, onEdit, onDelete, onAdd }: {
    focusedPost?: Post,
    appName?: string,
    modalType: CustomModalType,
    onDeleteAuth?: (post: Post) => void,
    onEditAuth?: (post: Post) => void,
    onClose: () => void,
    onEdit?: (id: string, title: string, password: string, content: string) => void
    onDelete?: (id: string) => void
    onAddComment?: (
        values: {
            postId: string;
            writer: string;
            content: string;
            password: string;
        }
    ) => void
    ondeleteComment?: (
        values: {
            postId: string;
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
}) => {

    const [url, setUrl] = useState("");

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${appName}`;
        setUrl(url);
    }, []);


    const router = useRouter();

    const path = usePathname();

    const notifySuccessEvent = (msg: string) => toast.success(msg);

    //로딩 상태
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    //true-> 삭제, 수정, 상세정보 - 데이터가 있는 경우
    //false-> 생성 - 데이터가 없는경우

    const [editedPostPasswordInput, setEditedPostPasswordInput] = useState<string>(focusedPost?.password ?? "");

    const [editedPostTitleInput, setEditedPostTitleInput] = useState<string>(focusedPost?.title ?? "");

    const [editedPostContentInput, setEditedPostContentInput] = useState<string>(focusedPost?.content ?? "");

    const [editedIsVisible, setEditedIsVisible] = React.useState(false);

    const editedToggleVisibility = () => setEditedIsVisible(!editedIsVisible);



    const [addedCommentPasswordInput, setAddedCommentPasswordInput] = useState<string>("");

    const [addedCommentWriterInput, setAddedCommentWriterInput] = useState<string>("");

    const [addedCommentContentInput, setAddedCommentContentInput] = useState<string>("");



    const CommentAdd = () => {

        return (<>
            <div className="flex flex-row items-center space-x-4">
                <div className="flex flex-col w-96">
                    <Input
                        isRequired
                        autoFocus
                        label="비밀번호"
                        placeholder="비밀번호을 입력해주세요"
                        variant="bordered"
                        type="password"
                        value={addedCommentPasswordInput}
                        onValueChange={setAddedCommentPasswordInput}
                    />
                    <Input className="max-w-md"
                        isRequired
                        autoFocus
                        type="text"
                        label="닉네임"
                        placeholder="닉네임을 입력해주세요"
                        variant="bordered"
                        defaultValue=""
                        value={addedCommentWriterInput}
                        onValueChange={setAddedCommentWriterInput}
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
                                postId: focusedPost?.id ?? "",
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

    const CommentsList = ({ comment, postId }: { comment: any, postId: any }) => {

        const date = new Date(comment.created_at.seconds * 1000 + comment.created_at.nanoseconds / 1000000);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return (
            <Card key={comment.id} className="">
                <CardBody className="flex flex-row w-full items-center space-x-3">
                    <div className="flex h-5 w-full items-center space-x-4 text-small">
                        <div className=" w-2/12 items-start">{comment.writer}</div>
                        <Divider className="" orientation="vertical" />
                        <div className="w-7/12">{comment.content}</div>
                        <Divider orientation="vertical" />
                        <div className="w-2/12 text-center">{formattedDate}</div>
                        <Divider orientation="vertical" />
                        <div className=" w-1/12 cursor-pointer" onClick={() => {
                            ondeleteComment?.(
                                {
                                    postId,
                                    commentId: comment.id,
                                    commentPassword: comment.password
                                }
                            )
                        }}>삭제</div>
                    </div>

                </CardBody>
            </Card>
        )
    }


    const DetailModal = () => {

        const comments = focusedPost?.comments;

        return <>
            <ModalHeader className="flex flex-col gap-1">게시글 상세보기</ModalHeader>
            <ModalBody>
                <p><span className="font-bold">글쓴이 : </span>{focusedPost?.writer ?? ""}</p>
                <p className="font-bold text-[1rem]"><span className="font-bold text-[1rem]">제목 : </span>{focusedPost?.title ?? ""}</p>
                <p>내용</p>
                <Textarea
                    isReadOnly
                    variant="bordered"
                    placeholder="Enter your description"
                    defaultValue={focusedPost?.content ?? ""}
                    className="w-full text-[1rem]"
                />
                <div className="flex py-1 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedPost?.created_at ?? ""}`}</p>
                </div>
                <div className="flex py-1 space-x-4">
                    <Accordion variant="splitted">
                        <AccordionItem className="" key="1" aria-label="댓글" title="댓글">
                            <div className=" space-y-3">
                                <Divider className="my-4" />

                                {
                                    focusedPost?.comments.map((comment) => (
                                        <CommentsList key={comment.id} comment={comment} postId={focusedPost.id} />
                                    ))
                                }

                            </div>

                            <Divider className="my-4" />
                            {CommentAdd()}
                        </AccordionItem>
                    </Accordion>
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

            if (password === focusedPost?.password) {
                switch (modalType) {
                    case 'deleteAuth':
                        return onDeleteAuth?.(focusedPost)
                    case 'editAuth':
                        return onEditAuth?.(focusedPost)
                    case 'passwordModal':
                        return deleteAComment?.(focusedPost)
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
            <ModalHeader className="flex flex-col gap-1">게시글 수정</ModalHeader>
            <ModalBody>
                <p className=" ps-1"><span className="font-bold">글쓴이 : </span>{focusedPost?.writer}</p>

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
                    defaultValue={focusedPost?.password}
                    value={editedPostPasswordInput}
                    onValueChange={setEditedPostPasswordInput}
                />

                <Input
                    isRequired
                    type="text"
                    label="제목"
                    placeholder="제목을 입력해주세요"
                    variant="bordered"
                    defaultValue={focusedPost?.title}
                    value={editedPostTitleInput}
                    onValueChange={setEditedPostTitleInput}
                />

                <Textarea
                    label="내용"
                    type="text"
                    placeholder="내용을 입력해주세요"
                    className=""
                    variant="bordered"
                    value={editedPostContentInput}
                    onValueChange={setEditedPostContentInput}

                />

                <div className="flex py-1 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedPost?.created_at}`}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="warning" variant="flat" onPress={() => {
                    setIsLoading(true);
                    onEdit?.(
                        focusedPost?.id ?? "",
                        editedPostTitleInput,
                        editedPostPasswordInput,
                        editedPostContentInput);
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
                <ModalHeader className="flex flex-col gap-1">게시글을 삭제하시겠습니까?</ModalHeader>
                <ModalBody>
                    <p><span className="font-bold">글쓴이 : </span>{focusedPost?.writer}</p>
                    <p className="font-bold text-[1rem]"><span className="font-bold text-[1rem]">제목 : </span>{focusedPost?.title}</p>
                    <Textarea
                        isReadOnly
                        label="내용"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        defaultValue={focusedPost?.content}
                        className="max-w-xs text-[1rem]"
                    />
                    <div className="flex py-1 space-x-4">
                        <span className="font-bold">작성일 : </span>
                        <p>{`${focusedPost?.created_at}`}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={() => {
                        setIsLoading(true);
                        onDelete?.(focusedPost?.id ?? "");
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

    const [addedPostWriterInput, setAddedPostWriterInput] = useState<string>("");

    const [addedPostPasswordInput, setAddedPostPasswordInput] = useState<string>("");

    const [addedPostTitleInput, setAddedPostTitleInput] = useState<string>("");

    const [addedPostContentInput, setAddedPostContentInput] = useState<string>("");

    const [addedIsVisible, setAddedIsVisible] = React.useState(false);

    const addedToggleVisibility = () => setAddedIsVisible(!addedIsVisible);


    const AddModal = () => {
        return <>
            <ModalHeader className="flex flex-col gap-1">게시글 작성</ModalHeader>
            <ModalBody>
                <div className="flex flex-row space-x-4">
                    <Input
                        isRequired
                        autoFocus
                        type="text"
                        label="닉네임"
                        placeholder="닉네임을 입력해주세요"
                        variant="bordered"
                        defaultValue=""
                        value={addedPostWriterInput}
                        onValueChange={setAddedPostWriterInput}
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
                        value={addedPostPasswordInput}
                        onValueChange={setAddedPostPasswordInput}
                    />
                </div>

                <Input className="pt-5 max-w-sm"
                    isRequired
                    type="text"
                    label="제목"
                    placeholder="제목을 입력해주세요"
                    variant="bordered"
                    value={addedPostTitleInput}
                    onValueChange={setAddedPostTitleInput}
                />

                <Textarea
                    label="내용"
                    type="text"
                    placeholder="내용을 입력해주세요"
                    className=""
                    variant="bordered"
                    value={addedPostContentInput}
                    onValueChange={setAddedPostContentInput}

                />
            </ModalBody>
            <ModalFooter>
                <Button color="warning" variant="flat" onPress={() => {
                    setIsLoading(true);
                    onAdd?.({
                        writer: addedPostWriterInput,
                        title: addedPostTitleInput,
                        content: addedPostContentInput,
                        password: addedPostPasswordInput
                    })
                    if (onAdd) {
                        console.log(addedPostWriterInput)
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



export default CustomModal;

