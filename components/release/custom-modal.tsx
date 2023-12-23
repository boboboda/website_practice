"use client"

import {
    ModalHeader, ModalBody,
    ModalFooter, Button, Input, checkbox, Switch, CircularProgress
} from "@nextui-org/react";
import React from 'react';
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useState } from "react";



const CustomModal = ({ focusedPost, modalType, onClose, onEdit, onDelete}: {
    focusedPost: Post,
    modalType: CustomModalType,
    onClose: () => void,
    onEdit: (id: string, title: string) => void
    onDelete: (id: string) => void
}) => {

    //수정된 상태
    // const [isDone, setIsDone] = useState<boolean>(focusedTodo.is_done);

    //수정된 할일 입력
    const [editedTodoInput, setEditedTodoInput] = useState<string>(focusedPost.title);

    // 로딩 상태
    const [isLoading, setIsLoading] = useState<Boolean>(false);

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
                    value={editedTodoInput}
                    onValueChange={setEditedTodoInput}
                />
                <div className="flex py-1 space-x-4">
                    {/* <span className="font-bold">완료 여부: </span>
                    <Switch color="warning" defaultSelected={focusedTodo.is_done}
                        onValueChange={setIsDone} aria-label="Automatic updates">
                    </Switch>
                    {isDone ? '완료' : '미완료'} */}
                </div>
                <div className="flex py-1 space-x-4">
                    <span className="font-bold">작성일: </span>
                    <p>{`${focusedPost.created_at}`}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="warning" variant="flat" onPress={() => {
                    setIsLoading(true);
                    onEdit(focusedPost.id, editedTodoInput);
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
                    onDelete(focusedPost.id);
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
}

export default CustomModal;

