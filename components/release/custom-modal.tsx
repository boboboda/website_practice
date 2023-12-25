"use client"

import {
    ModalHeader, ModalBody,
    ModalFooter, Button, Input, checkbox, Switch, CircularProgress, Textarea
} from "@nextui-org/react";
import React from 'react';
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useState } from "react";
import { create } from "domain";



const CustomModal = ({ focusedPost, modalType, onClose, onEdit, onDelete, onAdd }: {
    focusedPost?: Post,
    modalType: CustomModalType,
    onClose: () => void,
    onEdit?: (id: string, title: string) => void
    onDelete?: (id: string) => void
    onAdd?: (writer: string, passward: string, title: string, content: string) => void
}) => {

    //로딩 상태
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    //true-> 삭제, 수정, 상세정보 - 데이터가 있는 경우
    //false-> 생성 - 데이터가 없는경우

    if (focusedPost) {
        const [editedPostTitleInput, setEditedPostTitleInput] = useState<string>(focusedPost.title);

        const DetailModal = () => {
            return <>
                <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
                <ModalBody>
                    <p><span className="font-bold">id : </span>{focusedPost.id}</p>
                    <p><span className="font-bold">할일 내용 : </span>{focusedPost.title}</p>

                    <div className="flex py-1 space-x-4">
                        {/* <span className="font-bold">완료 여부 : </span> {focusedPost.is_done ? '완료' : '미완료'} */}
                    </div>
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

        const EditModal = () => {
            return <>
                <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
                <ModalBody>
                    <p><span className="font-bold">id : </span>{focusedPost.id}</p>
                    <Input
                        isRequired
                        autoFocus
                        label="할일 내용"
                        placeholder="할일을 입력해주세요"
                        variant="bordered"
                        defaultValue={focusedPost.title}
                        value={editedPostTitleInput}
                        onValueChange={setEditedPostTitleInput}
                    />
                    <div className="flex py-1 space-x-4">
                        <span className="font-bold">작성일: </span>
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
            return <>
                <ModalHeader className="flex flex-col gap-1">할일을 삭제하시겠습니까?</ModalHeader>
                <ModalBody>
                    <p><span className="font-bold">id : </span>{focusedPost.id}</p>
                    <p><span className="font-bold">할일 내용 : </span>{focusedPost.title}</p>

                    <div className="flex py-1 space-x-4">

                    </div>
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
                </ModalFooter>
            </>
        }

        const getModal = (type: CustomModalType) => {

            switch (type) {
                case 'detail':
                    return DetailModal();
                case 'delete':
                    return DeleteModal();
                case 'edit':
                    return EditModal();
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

        const [addedPostPasswardInput, setAddedPostPasswardInput] = useState<string>("");

        const [addedPostTitleInput, setAddedPostTitleInput] = useState<string>("");

        const [addedPostContentInput, setAddedPostContentInput] = useState<string>("");

        const AddModal = () => {
            return <>
                <ModalHeader className="flex flex-col gap-1">게시글 작성</ModalHeader>
                <ModalBody>
                    <div className="flex flex-row space-x-4">
                        <Input
                            isRequired
                            autoFocus
                            label="닉네임"
                            placeholder="닉네임을 입력해주세요"
                            variant="bordered"
                            value={addedPostWriterInput}
                            onValueChange={setAddedPostWriterInput}
                        />
                        <Input
                            isRequired
                            autoFocus
                            label="비밀번호"
                            placeholder="비밀번호을 입력해주세요"
                            variant="bordered"
                            value={addedPostPasswardInput}
                            onValueChange={setAddedPostPasswardInput}
                        />
                    </div>

                    <Input className="pt-5 max-w-sm"
                        isRequired
                        autoFocus
                        label="제목"
                        placeholder="제목을 입력해주세요"
                        variant="bordered"
                        value={addedPostTitleInput}
                        onValueChange={setAddedPostTitleInput}
                    />

                    <Textarea
                        label="내용"
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
                        onAdd?.(addedPostWriterInput, addedPostPasswardInput, addedPostTitleInput, addedPostContentInput)
                        if(onAdd) {
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

