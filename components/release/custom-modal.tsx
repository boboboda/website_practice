"use client"

import {
    ModalHeader, ModalBody, Modal, ModalContent,
    ModalFooter, Button, Input, checkbox, Switch, CircularProgress, Textarea, useDisclosure
} from "@nextui-org/react";
import React from 'react';
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useState, useRef } from "react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../icons";


const CustomModal = ({ focusedPost, modalType, onDeleteAuth, onClose, onEdit, onDelete, onAdd }: {
    focusedPost?: Post,
    modalType: CustomModalType,
    onDeleteAuth?: (post: Post) => void,
    onEditAuth?: (post: Post) => void,
    onClose: () => void,
    onEdit?: (id: string, title: string) => void
    onDelete?: (id: string) => void
    onAdd?: (values: {
        writer: string;
        title: string;
        content: string;
        password: string;
    }) => void
}) => {

    //로딩 상태
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    //true-> 삭제, 수정, 상세정보 - 데이터가 있는 경우
    //false-> 생성 - 데이터가 없는경우

    if (focusedPost) {
        const [editedPostPasswordInput, setEditedPostPasswordInput] = useState<string>(focusedPost.password);

        const [editedPostTitleInput, setEditedPostTitleInput] = useState<string>(focusedPost.title);

        const [editedPostContentInput, setEditedPostContentInput] = useState<string>(focusedPost.content);

        const [isVisible, setIsVisible] = React.useState(false);

        const toggleVisibility = () => setIsVisible(!isVisible);

        const DetailModal = () => {
            return <>
                <ModalHeader className="flex flex-col gap-1">게시글 상세보기</ModalHeader>
                <ModalBody>
                    <p><span className="font-bold">글쓴이 : </span>{focusedPost.writer}</p>
                    <p className="font-bold text-[1rem]"><span className="font-bold text-[1rem]">제목 : </span>{focusedPost.title}</p>
                    <Textarea
                        isReadOnly
                        label="내용"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        defaultValue={focusedPost.content}
                        className="max-w-xs text-[1rem]"
                    />
                    <div className="flex py-1 space-x-4">
                        <span className="font-bold">작성일 : </span>
                        <p>{`${focusedPost.created_at}`}</p>
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

                if (password === focusedPost.password) {
                    onDeleteAuth?.(focusedPost)
                } else {
                    alert(`비밀번호가 틀렸습니다. 입력패스워드 ${password} 기존 패스워드${focusedPost.password}`);
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
                <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
                <ModalBody>
                    <div className="flex flex-row space-x-4">
                        <p><span className="font-bold">글쓴이 : </span>{focusedPost.writer}</p>
                        <Input
                            isRequired
                            autoFocus
                            label="비밀번호"
                            placeholder="비밀번호을 입력해주세요"
                            variant="bordered"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            defaultValue={focusedPost.password}
                            value={editedPostPasswordInput}
                            onValueChange={setEditedPostPasswordInput}
                        />
                    </div>

                    <Input className="pt-5 max-w-sm"
                        isRequired
                        type="text"
                        label="제목"
                        placeholder="제목을 입력해주세요"
                        variant="bordered"
                        defaultValue={focusedPost.title}
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
                        <p>{`${focusedPost.created_at}`}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" variant="flat" onPress={() => {
                        setIsLoading(true);
                        onEdit?.(focusedPost.id, editedPostTitleInput);
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
                        <p><span className="font-bold">글쓴이 : </span>{focusedPost.writer}</p>
                        <p className="font-bold text-[1rem]"><span className="font-bold text-[1rem]">제목 : </span>{focusedPost.title}</p>
                        <Textarea
                            isReadOnly
                            label="내용"
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Enter your description"
                            defaultValue={focusedPost.content}
                            className="max-w-xs text-[1rem]"
                        />
                        <div className="flex py-1 space-x-4">
                            <span className="font-bold">작성일 : </span>
                            <p>{`${focusedPost.created_at}`}</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={() => {
                            setIsLoading(true);
                            onDelete?.(focusedPost.id);
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

        const handle = () => {
            return DeleteModal()
        }

        const getModal = (type: CustomModalType) => {

            switch (type) {
                case 'detail':
                    return DetailModal();
                case 'delete':
                    return DeleteModal();
                case 'deleteAuth':
                    return PasswordModal(type);
                default: break;

            }
        }

        return (
            <>
                {getModal(modalType)}
            </>
        )

    } else {

        const [addedPostWriterInput, setAddedPostWriterInput] = useState<string>("");

        const [addedPostPasswordInput, setAddedPostPasswordInput] = useState<string>("");

        const [addedPostTitleInput, setAddedPostTitleInput] = useState<string>("");

        const [addedPostContentInput, setAddedPostContentInput] = useState<string>("");

        const [isVisible, setIsVisible] = React.useState(false);

        const toggleVisibility = () => setIsVisible(!isVisible);


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
                            autoFocus
                            label="비밀번호"
                            placeholder="비밀번호을 입력해주세요"
                            variant="bordered"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
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
            }
        }

        return (
            <>
                {getModal(modalType)}
            </>
        )

    }


}



export default CustomModal;

