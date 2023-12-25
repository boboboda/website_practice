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
  ModalFooter, useDisclosure,
  Selection, SortDescriptor, Pagination
} from "@nextui-org/react";
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useRouter } from "next/navigation"
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VerticalDotsIcon } from "../icons";
import CustomModal from "./custom-modal";
import { capitalize } from "@/utils";
import columns from "@/types";
import { SearchIcon, ChevronDownIcon, PlusIcon } from "../icons";



const INITIAL_VISIBLE_COLUMNS = ["listNumber", "title", "writer", "actions"];

const PostsTable = ({ posts, appName }: { posts: Post[], appName: string }) => {


  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "create_at",
    direction: "ascending",
  });

  // 할일 추가 가능 여부 

  const [postAddEnable, setPostAddEnable] = useState(false);


  // 로딩 상태

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  // 띄우는 모달 상태

  const [currentModalData, setCurrentModalData] = useState<FocusedPostType>({
    focusedPost: null,
    modalType: 'detail',
  });

  const router = useRouter();

  // 페이지
  const [page, setPage] = React.useState(1);


  //검색
  const hasSearchFilter = Boolean(filterValue);

  //해더 컬럼
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);


  //아이템 필터-검색용도
  const filteredItems = React.useMemo(() => {
    let filteredPosts = [...posts];

    if (hasSearchFilter) {
      filteredPosts = filteredPosts.filter((posts) =>
        posts.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredPosts;
  }, [posts, filterValue]);


  //페이지 관련
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);


  // 정렬관련- 날짜 관련 cmp 수정 필요
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Post, b: Post) => {
      const first = a[sortDescriptor.column as keyof Post] as string;
      const second = b[sortDescriptor.column as keyof Post] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const renderCell = React.useCallback((post: Post, columnKey: React.Key) => {
    const cellValue = post[columnKey as keyof Post];

    switch (columnKey) {
      case "listNumber":
        return (
          <h1>
            {post.listNumber}
          </h1>
        );
      case "writer":
        return (
          <h1>
            {post.writer}
          </h1>
        );
      case "title":
        return (
          <h1>
            {post.title}
          </h1>
        );

      case "create_at":
        return (
          <h1>
            {`${post.created_at}`}
          </h1>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => {
                console.log(`apost.id: ${post.id}  key: ${key}}`)

                setCurrentModalData({ focusedPost: post, modalType: key as CustomModalType })
                onOpen();
              }}>
                <DropdownItem key="detail">상세보기</DropdownItem>
                <DropdownItem key="edit">수정</DropdownItem>
                <DropdownItem key="delete">삭제</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);


  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])



  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="제목 검색"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />} onClick={() => {
              setCurrentModalData({
                focusedPost: null,
                modalType: "add"
              })
  onOpen();
}}>
  글쓰기
</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {posts.length} posts</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    posts.length,
    hasSearchFilter,
  ]);

  //페이지 뷰
  const bottomContent = React.useMemo(() => {
    return (

      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);


  const addApostHandler = async (
    title: string,
    writer: string,
    passward: string,
    content: string) => {

    setIsLoading(true);

    console.log(`appName${appName}`)

    await new Promise(f => setTimeout(f, 600));
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${appName}`, {
        method: 'post',
        body: JSON.stringify({
          title: title,
          writer: writer,
          passward: passward,
          content: content
        }),
        cache: 'no-store'
      });
    } catch(res) {
      console.log(res);
    }
    
    router.refresh();

    setIsLoading(false);

    notifySuccessEvent("성공적으로 작성되었습니다!");

    console.log(`게시글 추가완료`)

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  const ModalComponent = () => {
    return <div>
      <Modal
        isOpen={isOpen}
        size="5xl"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
        onOpenChange={onOpenChange}
        placement="top-center">
        <ModalContent>
          {(onClose) => (
            (currentModalData.focusedPost ? (
              <CustomModal
                focusedPost={currentModalData.focusedPost}
                modalType={currentModalData.modalType}
                onClose={onClose}
                onEdit={async (id, title) => {
                  await editApostHandler(id, title);
                  onClose();
                }}
                onDelete={async (id) => {
                  await deleteApostHandler(id);
                  onClose();
                }}
              />
            ) : (
              <CustomModal
                modalType={currentModalData.modalType}
                onClose={onClose}
                onAdd={async (writer, passward, title, content) => {

                  await addApostHandler(writer, passward, title, content);
                  onClose();
                }}
              />
            ))
          )}
        </ModalContent>
      </Modal>
    </div>
  }

  return (




    <>
      {ModalComponent()}
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


      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </>



  );
}


export default PostsTable;
