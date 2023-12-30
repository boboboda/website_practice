"use client"

import { useState, useEffect } from "react";
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
  Selection, SortDescriptor, Pagination,
  User, Chip, Tooltip, ChipProps, getKeyValue
} from "@nextui-org/react";
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useRouter, usePathname } from "next/navigation"
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VerticalDotsIcon } from "../icons";
import CustomModal from "./custom-modal";
import { capitalize } from "@/utils";
import columns from "@/types";
import { SearchIcon, ChevronDownIcon, PlusIcon, EyeIcon, EditIcon, DeleteIcon } from "../icons";



const INITIAL_VISIBLE_COLUMNS = ["listNumber", "title", "writer", "actions"];

const PostsTable = ({ posts, appName }: { posts: Post[], appName: string }) => {


  const [myPosts, setMyPosts] = useState<Post[]>([]); // 초기값 설정

  useEffect(() => {
    setMyPosts(posts); // 외부에서 전달받은 posts 값을 상태에 저장
  }, [posts]);



  const [filterValue, setFilterValue] = React.useState("");

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "create_at",
    direction: "ascending",
  });

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const notifySuccessEvent = (msg: string) => toast.success(msg);

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
          <h1 className="flex justify-center" key={post.id}>
            {post.listNumber}
          </h1>
        );
      case "writer":
        return (
          <h1 className="flex justify-center" key={post.id}>
            {post.writer}
          </h1>
        );
      case "title":
        return (
          <h1 className="flex justify-center" key={post.id}>
            {post.title}
          </h1>
        );

      case "create_at":
        return (
          <h1 className="flex justify-center" key={post.id}>
            {`${post.created_at}`}
          </h1>
        );
      case "actions":
        return (
          <div className="relative flex justify-center space-x-3">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" 
              onClick={(event) => {
                setCurrentModalData({ focusedPost: post, modalType: "detail" });
                onOpen();
              }}>
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={(event) => {
                setCurrentModalData({ focusedPost: post, modalType: "edit" });
                onOpen();
              }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={(event) => {
                setCurrentModalData({ focusedPost: post, modalType: "deleteAuth" });
                onOpen();
              }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>



        );
      default:
        return cellValue;
    }
  }, [posts]);

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
    password: string,
    content: string) => {

    setIsLoading(true);

    await new Promise(f => setTimeout(f, 600));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${appName}`, {
        method: 'post',
        body: JSON.stringify({
          title: title,
          writer: writer,
          password: password,
          content: content
        }),
        cache: 'no-store'
      });

    router.refresh();

    setIsLoading(false);

    notifySuccessEvent("성공적으로 작성되었습니다!");

    console.log(`게시글 추가완료`)
    } catch (res) {
      console.log(res);
    }


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
    
    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${appName}/${id}`, {
      method: 'delete',
      cache: 'no-store'
    });

    router.refresh();

    setIsLoading(false);

    notifySuccessEvent("할일 삭제 완료!");
  };



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
                onDeleteAuth={async (post) => {
                  onClose()
                  await new Promise(f => setTimeout(f, 600));
                  setCurrentModalData({
                    focusedPost: post,
                    modalType: "delete"
                  })
                  onOpen()
                }}
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
                onAdd={async (value) => {

                  await addApostHandler(
                    value.title,
                    value.writer,
                    value.password,
                    value.content);
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
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn className="text-center"
            
              key={column.uid}
              // align={column.uid === "action" ? "end" : "center"}
              allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"보여줄 게시글이 없습니다"} items={sortedItems}>
          {(item) => (

            item &&

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
