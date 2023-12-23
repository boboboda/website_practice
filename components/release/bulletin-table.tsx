"use client"

import { useState } from "react";
import {
  Table,
  Input,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Popover, PopoverContent, PopoverTrigger,
  Spinner,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, 
  ModalHeader, ModalBody,
   ModalFooter, useDisclosure
} from "@nextui-org/react";
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useRouter } from "next/navigation"
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {VerticalDotsIcon} from "../icons";
import CustomModal from "../release/custom-modal";

const PostsTable = ({ posts}: { posts: Post[] }) => {


  // 할일 추가 가능 여부 

  const [postAddEnable, setPostAddEnable] = useState(false);

  // 입력된 할일

  const [newPostInput, setNewPostInput] = useState('');

  // 로딩 상태

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  // 띄우는 모달 상태

  const [currentModalData, setCurrentModalData] = useState<FocusedPostType>({
    focusedPost: null,
    modalType: 'detail',
  });

  const router = useRouter();




  const addApostHandler = async (
    title: string,
    listNumber: String,
    writer: string,
    passward: string,
    contents: string,
    created_at: Date) => {

    if (!postAddEnable) { return }

    setPostAddEnable(false);

    setIsLoading(true);

    // setTimeout(() => {
    //   console.log("첫 번째 메시지")
    // }, 5000);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
      method: 'post',
      body: JSON.stringify({
        title: title
      }),
      cache: 'no-store'
    });

    setNewPostInput('');

    router.refresh();

    setIsLoading(false);

    notifySuccessEvent("할일이 성공적으로 추가되었습니다!");

    console.log(`할일 추가완료: ${newPostInput}`)


  };

  const editApostHandler = async (
    id: string, 
    editedTitle: string) => {

    setIsLoading(true);

    // setTimeout(() => {
    //   console.log("첫 번째 메시지")
    // }, 5000);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method: 'post',
      body: JSON.stringify({
        title: editedTitle,
      }),
      cache: 'no-store'
    });

    router.refresh();

    setIsLoading(false);

    notifySuccessEvent("할일 수정 완료!");
  };

  const deleteApostHandler = async (
    id: string) => {

    setIsLoading(true);

    // setTimeout(() => {
    //   console.log("첫 번째 메시지")
    // }, 5000);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method: 'delete',
      cache: 'no-store'
    });

    router.refresh();

    setIsLoading(false);

    notifySuccessEvent("할일 삭제 완료!");
  };




  const PostRow = (aPost: Post) => {
    return <TableRow key={aPost.id}>
      <TableCell>{aPost.listNumber.slice(0, 4)}</TableCell>
      <TableCell>{aPost.title}</TableCell>
      <TableCell>{aPost.writer}</TableCell>
      <TableCell>{`${aPost.created_at}`}</TableCell>
      <TableCell>
        <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) =>{
                console.log(`aTodo.id: ${aPost.id}  key: ${key}}`)

                setCurrentModalData({focusedPost: aPost, modalType: key as CustomModalType})
                onOpen();
              }}>
                <DropdownItem key="detail">상세보기</DropdownItem>
                <DropdownItem key="edit">수정</DropdownItem>
                <DropdownItem key="delete">삭제</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div></TableCell>
    </TableRow>
  }

  const DisabledTodoAddButton = () => {
    return <Popover placement="top" showArrow={true}>
      <PopoverTrigger>
        <Button color="default" className="h-14">
          추가
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">💥</div>
          <div className="text-tiny">할일을 입력해주세요</div>
        </div>
      </PopoverContent>
    </Popover>
  }



  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  const ModealComponent = () => {
    return <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            (currentModalData.focusedPost && <CustomModal 
              focusedPost={currentModalData.focusedPost}
              modalType={currentModalData.modalType}
              onClose={onClose}
              onEdit={ async (id, title) => {

                await editApostHandler(id, title);
                onClose();
              }}
              onDelete={ async (id) =>{

                await deleteApostHandler(id);
                onClose();
              }}
              />)
            
          )}
        </ModalContent>
      </Modal>
    </div>
  }

  return (

    <div className="flex flex-col space-y-2">

      {ModealComponent()}
      <ToastContainer
        className=" foo "
        style={{ width: "400px" }}
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"



      />
      {/* <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="새로운 할일"
          value={newTodoInput}
          onValueChange={(changedInput) => {
            setNewaInput(changedInput);
            setTodoAddEnable(changedInput.length > 0);
          }} />
        {todoAddEnable ? <Button color="warning" className="h-14"
          onPress={async () => {
            await addAtodoHandler(newTodoInput)
          }}>
          추가
        </Button> : DisabledTodoAddButton()
        }
      </div> */}
      {/* <div className="h-6">{isLoading && <Spinner size="sm" color="warning" />}</div> */}



      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디</TableColumn>
          <TableColumn>할일내용</TableColumn>
          <TableColumn>완료여부</TableColumn>
          <TableColumn>생성일자</TableColumn>
          <TableColumn>액션</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"보여줄 데이터가 없습니다."}>
          {
            posts && posts.map((aPost: Post) => (

              PostRow(aPost)
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}


export default PostsTable;
