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
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, useDisclosure,
  Selection, SortDescriptor, Pagination, ModalHeader, ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { Notice, FocusedNoticeType, CustomModalType } from "@/types";
import { useRouter, usePathname } from "next/navigation"
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VerticalDotsIcon } from "../../icons";
import { capitalize } from "@/lib/utils";
import columns from "@/types";
import { SearchIcon, ChevronDownIcon, PlusIcon, EyeIcon, EditIcon, DeleteIcon } from "../../icons";
import { of, from, filter, find } from "rxjs";
import { debounce } from "lodash";
import { Note } from "@/store/editorSotre";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "xs" | "3xl" | "4xl" | "5xl";


const AdminNoteTable = ({ notes }: { notes: Note[] }) => {


  const [filterValue, setFilterValue] = React.useState("");

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));

  const INITIAL_VISIBLE_COLUMNS = ["listNumber", "title", "writer", "actions", "created_at"];

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "create_at",
    direction: "ascending",
  });


  const router = useRouter();

  // 페이지
  const [page, setPage] = React.useState(1);


  //검색
  const hasSearchFilter = Boolean(filterValue);


  const [windowWidth, setWindowWidth] = useState(innerWidth);

  const setVisibleColumnsForWindowWidth = () => {
    if (windowWidth <= 700) {
      setVisibleColumns(new Set(["title", "writer" , "created_at"]));
    } else {
      setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS));
    }
  };



  useEffect(() => {
    // window 크기가 변경될 때마다
    window.addEventListener("resize", () => {
      setWindowWidth(innerWidth);
    });
  }, []);

  useEffect(() => {
    setVisibleColumnsForWindowWidth();
  }, [windowWidth]);

  //해더 컬럼
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);


  //아이템 필터-검색용도
  const filteredItems = React.useMemo(() => {
    let filteredNotes = [...notes];

    if (hasSearchFilter) {
        filteredNotes = filteredNotes.filter((notices) =>
        notices.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredNotes;
  }, [notes, filterValue]);


  //페이지 관련
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);


  // 정렬관련- 날짜 관련 cmp 수정 필요
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Note, b: Note) => {
      const first = a[sortDescriptor.column as keyof Note] as string;
      const second = b[sortDescriptor.column as keyof Note] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((note: Note, columnKey: any) => {
    const cellValue = note[columnKey as keyof Note];

    switch (columnKey) {
      case "listNumber":
        return (
          <h1 className="flex justify-center" key={note.noteId}>
            {note.noteId}
          </h1>
        );
      case "title":
        return (
          <h1 className="flex justify-center cursor-pointer" key={note.id} onClick={(event) => {
            
          
          }}>
            {note.title}
          </h1>
        );

      case "create_at":
        return (
          <h1 className="flex w-full text-center items-center justify-center" key={note.id}>
            {note.create_at}
          </h1>
        );
      case "actions":

        return (
          <div className="relative flex justify-center space-x-3">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={(event) => {
                
                }}>
                <EyeIcon />
              </span>
            </Tooltip>
           
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={(event) => {
                
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
  }, [notes]);

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
      <div className="flex flex-col gap-4 ">
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
              <DropdownTrigger className="flex">
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

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {notes.length} notices</span>
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
    notes.length,
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
            이전
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            다음
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

 
  const [passwordModalType, setPasswordModalType] = useState<number>(1)

  const [deletePassword, setDeletePassword] = useState("")

  const [deleteNoticeId, setDeleteNoticeId] = useState("")

  const [deleteCommentId, setDeleteCommentId] = useState("")

  const [deleteReplyId, setDeleteReplyId] = useState("")

  const { isOpen: isTwoOpen, onOpen: TwoOnOpen, onOpenChange: onTwoChange, onClose: twoOnClose } = useDisclosure();



 




  return (
    <>
      <ToastContainer
        className=" foo"
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
              allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"보여줄 게시글이 없습니다"} items={sortedItems}>
          {(item) => (

            item &&

            <TableRow key={item.id}>
              {(columnKey) => <TableCell className=" text-center">{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}


export default AdminNoteTable
