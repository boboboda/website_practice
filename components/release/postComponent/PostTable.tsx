"use client";

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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  useDisclosure,
  Selection,
  SortDescriptor,
  Pagination,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { Post, FocusedPostType, CustomModalType } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VerticalDotsIcon } from "../../icons";
import PostCustomModal from "./Custom-modal";
import { capitalize } from "@/lib/utils";
import { columns } from "@/types";
import {
  SearchIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
  DeleteIcon,
} from "../../icons";
import { of, from, filter, find } from "rxjs";
import { debounce } from "lodash";
import PasswordModal from "../postComponent-dummy/password-modal";
import {
  addAPost,
  deleteAPost,
  editAPost,
  addAComment,
  deleteAComment,
  editComment,
  addAReply,
  deleteAReply,
  editReply,
} from "@/lib/serverActions/posts";
import { useUserStore } from "@/components/providers/user-store-provider";

type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full"
  | "xs"
  | "3xl"
  | "4xl"
  | "5xl";

const PostTable = ({
  posts,
  appName,
  postType,
}: {
  posts: Post[];
  appName: string;
  postType: string;
}) => {
  const { user } = useUserStore((state) => state);

  const isAdmin = user?.role === "admin";

  const [filterValue, setFilterValue] = React.useState("");

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const INITIAL_VISIBLE_COLUMNS = [
    "listNumber",
    "title",
    "writer",
    "actions",
    "created_at",
  ];

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

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
    modalType: "detail",
    appName: "",
  });

  const [currentPost, setCurrentPost] = useState<Post>({
    id: "",
    listNumber: "",
    writer: "",
    email: "",
    title: "",
    content: "",
    created_at: "",
    comments: [],
  });

  useEffect(() => {
    const updataPosts = from(posts)
      .pipe(find((post) => post.id === currentPost.id))
      .subscribe((updatePost) => {
        setCurrentModalData({
          focusedPost: updatePost ?? null,
          modalType: currentModalData.modalType,
        });
      });

    return () => updataPosts.unsubscribe();
  }, [posts, currentPost]);

  const router = useRouter();

  // 페이지
  const [page, setPage] = React.useState(1);

  //검색
  const hasSearchFilter = Boolean(filterValue);

  // 모달 상태 delete, add, edit

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const validateUserAndConfirm = (
    value,
    actionType,
    callback,
    contentType = "comment"
  ) => {
    // 객체 속성 이름 통일을 위한 정규화
    const userEmail = user?.email;

    // 댓글인지 리플인지에 따라 이메일 필드 결정
    let targetEmail;
    if (contentType === "comment") {
      targetEmail = value.commentEmail || value.email;
    } else if (contentType === "reply") {
      targetEmail = value.replyEmail || value.email;
    } else {
      targetEmail = value.email; // 기본값
    }

    // 콘텐츠 타입에 따른 로그 메시지 설정
    const typeLabel = contentType === "reply" ? "답글" : "댓글";

    console.log(`${typeLabel} ${actionType} 작성자:`, value);
    console.log(`${typeLabel} ${actionType} 이메일:`, targetEmail);
    console.log(`${typeLabel} ${actionType} 사용자:`, userEmail);

    // 이메일 검증
    if (userEmail !== targetEmail) {
      const action = actionType === "edit" ? "수정" : "삭제";
      notifyErrorEvent(`자신이 작성한 ${typeLabel}만 ${action}할 수 있습니다.`);
      return false;
    }

    // 확인 모달 설정 및 표시
    setConfirmType(actionType);
    setConfirmAction(() => () => callback(value));
    onConfirmOpen();
    return true;
  };

  const [confirmType, setConfirmType] = useState("delete");

  const [confirmAction, setConfirmAction] = useState(null);

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmChange,
  } = useDisclosure();

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  const notifyErrorEvent = (msg: string) => toast.error(msg);

  const notifyUpdateEvent = (msg: string) => toast.update;

  const [windowWidth, setWindowWidth] = useState(innerWidth);

  const setVisibleColumnsForWindowWidth = () => {
    if (windowWidth <= 700) {
      setVisibleColumns(new Set(["title", "writer", "created_at"]));
    } else {
      setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS));
    }
  };

  const [modalSize, setModalSize] = React.useState<ModalSize>("3xl");

  const setModalEvent = () => {
    if (windowWidth <= 700) {
      setModalSize("md");
    } else {
      setModalSize("3xl");
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
    setModalEvent();
  }, [windowWidth]);

  //해더 컬럼
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  //아이템 필터-검색용도
  const filteredItems = React.useMemo(() => {
    let filteredPosts = [...posts];

    if (hasSearchFilter) {
      filteredPosts = filteredPosts.filter((Posts) =>
        Posts.title.toLowerCase().includes(filterValue.toLowerCase())
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

  const renderCell = React.useCallback(
    (post: any, columnKey: any) => {
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
            <h1
              className="flex justify-center cursor-pointer"
              key={post.id}
              onClick={(event) => {
                setCurrentModalData({
                  focusedPost: post,
                  modalType: "detail",
                });
                onOpen();
              }}
            >
              {post.title}
            </h1>
          );

        case "create_at":
          return (
            <h1
              className="flex w-full text-center items-center justify-center"
              key={post.id}
            >
              {post.create_at}
            </h1>
          );
        case "actions":
          return (
            <div className="relative flex justify-center space-x-3">
              <Tooltip content="Details">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={(event) => {
                    setCurrentModalData({
                      focusedPost: post,
                      modalType: "detail",
                      appName: appName,
                    });
                    // 지우지 마라 이거
                    setCurrentPost(post);
                    onOpen();
                  }}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Edit user">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={(event) => {
                    setCurrentModalData({
                      focusedPost: post,
                      modalType: "editAuth",
                    });
                    onOpen();
                  }}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={(event) => {
                    setCurrentModalData({
                      focusedPost: post,
                      modalType: "deleteAuth",
                    });
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
    },
    [posts]
  );

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

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

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
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
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

            {postType === "notice"
              ? // 공지사항인 경우 - 관리자만 글쓰기 버튼 표시
                isAdmin && (
                  <Button
                    color="primary"
                    endContent={<PlusIcon />}
                    onClick={() => {
                      setCurrentModalData({
                        focusedPost: null,
                        modalType: "add",
                        appName: appName,
                      });
                      onOpen();
                    }}
                  >
                    공지 게시
                  </Button>
                )
              : postType === "post" && (
                  // 일반 게시판인 경우 - 모든 사용자에게 글쓰기 버튼 표시
                  <Button
                    color="primary"
                    endContent={<PlusIcon />}
                    onClick={() => {
                      setCurrentModalData({
                        focusedPost: null,
                        modalType: "add",
                        appName: appName,
                      });
                      onOpen();
                    }}
                  >
                    글쓰기
                  </Button>
                )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {posts.length} Posts
          </span>
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
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            이전
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            다음
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const addAPostHandler = async (
    title: string,
    writer: string,
    content: string
  ) => {
    setIsLoading(true);

    await new Promise((f) => setTimeout(f, 600));

    try {
      await addAPost({
        appName: appName,
        postType: postType,
        title: title,
        writer: writer,
        email: user?.email,
        content: content,
      });

      router.refresh();

      setIsLoading(false);

      notifySuccessEvent(`성공적으로 작성되었습니다!`);

      console.log(`게시글 추가완료`);
    } catch (error) {
      console.error("공지사항 작성 실패:", error);
      notifyErrorEvent(`작성이 실패되었습니다!`);
    }
  };

  // 게시글 수정
  const editAPostHandler = async (
    id: string,
    title: string,
    content: string
  ) => {
    setIsLoading(true);

    await new Promise((f) => setTimeout(f, 600));

    try {
      await editAPost({ appName, postType: postType, id, title, content });

      router.refresh();

      setIsLoading(false);

      notifySuccessEvent("공지사항 수정 완료!");
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      notifyErrorEvent(`공지사항 수정 실패하였습니다.!`);
    }
  };

  // 게시글 삭제
  const deleteAPostHandler = async (id: string) => {
    setIsLoading(true);

    try {
      await deleteAPost({
        appName: appName,
        postType: postType,
        id: id,
      });

      router.refresh();

      setIsLoading(false);

      notifySuccessEvent("공지 삭제 완료!");
    } catch (error) {
      console.error("공지사항 삭제 실패패:", error);
      notifyErrorEvent(`삭제가 실패되었습니다.`);
    }
  };

  const addAcommentHandler = async ({
    postId,
    writer,
    content,
    email,
  }: {
    postId: string;
    writer: string;
    content: string;
    email: string;
  }) => {
    await new Promise((f) => setTimeout(f, 600));

    try {
      const updatedPost = await addAComment({
        postId: postId,
        commentWriter: writer,
        commentContent: content,
        email: email,
      });

      if (updatedPost) {
        setCurrentPost(updatedPost);

        router.refresh();

        notifySuccessEvent(`성공적으로 작성되었습니다!`);

        console.log(`댓글 추가완료`);
      }
    } catch (error) {
      notifyErrorEvent(`댓글 작성에 실패했습니다.`);
      console.error(error);
    }
  };

  const deleteAcommentHandler = async (postId, commentId, commentEmail) => {
    try {
      // 현재 로그인한 사용자 이메일과 댓글 작성자 이메일 비교
      if (user?.email !== commentEmail) {
        notifyErrorEvent("자신이 작성한 댓글만 삭제할 수 있습니다.");
        return;
      }

      await new Promise((f) => setTimeout(f, 600));

      await deleteAComment({
        appName: appName,
        postType: postType,
        postId: postId,
        commentId: commentId,
      });

      router.refresh();
      notifySuccessEvent(`댓글이 삭제되었습니다!`);
      console.log(`댓글 삭제완료`);
    } catch (error) {
      notifyErrorEvent(`댓글 삭제 실패`);
      console.log(`댓글 삭제 실패`);
    }
  };

  const editAcommentHandler = async (postId, commentId, content) => {
    try {
      await new Promise((f) => setTimeout(f, 600));

      const updatedPost = await editComment({
        appName,
        postType: postType,
        postId: postId,
        commentId,
        content,
      });

      setCurrentPost(updatedPost);

      router.refresh();
      notifySuccessEvent("댓글이 수정되었습니다!");
      console.log(`댓글 수정 완료`);
    } catch (error) {
      notifyErrorEvent(`댓글 수정 실패`);
      console.log(`댓글 수정 실패`);
    }
  };

  const addAreplyHandler = async ({
    commendId,
    postId,
    writer,
    content,
    email,
  }: {
    commendId: string;
    writer: string;
    postId: string;
    content: string;
    email: string;
  }) => {
    await new Promise((f) => setTimeout(f, 600));

    try {
      const updatedPost = await addAReply({
        appName: appName,
        postType: postType,
        postId: postId,
        commentId: commendId,
        replyWriter: writer,
        replyContent: content,
        email: email,
      });

      if (updatedPost) {
        setCurrentPost(updatedPost);

        router.refresh();

        notifySuccessEvent(`성공적으로 작성되었습니다!`);

        console.log(`답글 추가완료`);
      }
    } catch (error) {
      notifyErrorEvent(`답글 작성에 실패했습니다.`);
      console.error(error);
    }
  };

  const deleteReplyHandler = async ({
    postId,
    replyId,
    replyEmail,
  }: {
    postId: string;
    replyId: string;
    replyEmail: string;
  }) => {
    try {
      // 현재 로그인한 사용자 이메일과 댓글 작성자 이메일 비교
      if (user?.email !== replyEmail) {
        notifyErrorEvent("자신이 작성한 답글만 삭제할 수 있습니다.");
        return;
      }

      await new Promise((f) => setTimeout(f, 600));

      const updatePost = await deleteAReply({
        appName: appName,
        postType: postType,
        postId: postId,
        replyId: replyId,
      });

      setCurrentPost(updatePost);
      router.refresh();
      notifySuccessEvent(`답글이 삭제되었습니다!`);
      console.log(`답글 삭제완료`);
    } catch (error) {
      notifyErrorEvent(`답글 삭제 실패`);
      console.log(`답글 삭제 실패`);
    }
  };

  const editAreplyHandler = async (PostId, replyId, content) => {
    try {
      await new Promise((f) => setTimeout(f, 600));

      const updatedPost = await editReply({
        appName,
        postType: postType,
        postId: PostId,
        replyId: replyId,
        content,
      });

      setCurrentPost(updatedPost);
      router.refresh();
      notifySuccessEvent("답글이 수정되었습니다!");
      console.log(`답글 수정 완료`);
    } catch (error) {
      notifyErrorEvent(`답글 수정 실패`);
      console.log(`답글 수정 실패`);
    }
  };

  const ModalComponent = () => {
    return (
      <div>
        <Modal
          isOpen={isOpen}
          size={modalSize}
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          }}
          onOpenChange={onOpenChange}
          placement="center"
        >
          <ModalContent>
            {(onClose) =>
              currentModalData.focusedPost ? (
                <PostCustomModal
                  user={user}
                  focusedPost={currentModalData.focusedPost}
                  modalType={currentModalData.modalType}
                  appName={currentModalData.appName}
                  postType={postType}
                  onClose={onClose}
                  onAddComment={async (value) => {
                    await addAcommentHandler({
                      postId: value.postId,
                      writer: value.writer,
                      content: value.content,
                      email: value.email,
                    });
                  }}
                  onEditComment={async (value) => {
                    validateUserAndConfirm(
                      value,
                      "edit",
                      (val) =>
                        editAcommentHandler(
                          val.PostId,
                          val.commentId,
                          val.content
                        ),
                      "comment"
                    );
                  }}
                  ondeleteComment={async (value) => {
                    validateUserAndConfirm(
                      value,
                      "delete",
                      (val) =>
                        deleteAcommentHandler(
                          val.PostId,
                          val.commentId,
                          val.commentEmail || val.email
                        ),
                      "comment"
                    );
                  }}
                  onAddReply={async (value) => {
                    await addAreplyHandler({
                      commendId: value.commentId,
                      writer: value.writer,
                      postId: value.postId,
                      content: value.content,
                      email: value.email,
                    });
                  }}
                  onDeleteReply={async (value) => {
                    validateUserAndConfirm(
                      value,
                      "delete",
                      (val) =>
                        deleteReplyHandler({
                          postId: val.postId,
                          replyId: val.replyId,
                          replyEmail: val.replyEmail || val.email,
                        }),
                      "reply"
                    );
                  }}
                  onEditReply={async (value) => {
                    validateUserAndConfirm(
                      value,
                      "edit",
                      (val) =>
                        editAreplyHandler(val.PostId, val.replyId, val.content),
                      "reply"
                    );
                  }}
                  onDeleteAuth={async (Post) => {
                    onClose();
                    await new Promise((f) => setTimeout(f, 600));
                    setCurrentModalData({
                      focusedPost: Post,
                      modalType: "delete",
                    });
                    onOpen();
                  }}
                  onEditAuth={async (Post) => {
                    onClose();
                    await new Promise((f) => setTimeout(f, 600));
                    setCurrentModalData({
                      focusedPost: Post,
                      modalType: "edit",
                    });
                    onOpen();
                  }}
                  onEdit={async (id, title, content) => {
                    await editAPostHandler(id, title, content);
                    onClose();
                  }}
                  onDelete={async (id) => {
                    await deleteAPostHandler(id);
                    onClose();
                  }}
                />
              ) : (
                <PostCustomModal
                  user={user}
                  appName={appName}
                  postType={postType}
                  modalType={currentModalData.modalType}
                  onClose={onClose}
                  onAdd={async (value) => {
                    await addAPostHandler(
                      value.title,
                      value.writer,
                      value.content
                    );
                    onClose();
                  }}
                />
              )
            }
          </ModalContent>
        </Modal>
      </div>
    );
  };

  const ConfirmActionModal = () => {
    const modalTitle =
      confirmType === "edit" ? "댓글 수정 확인" : "댓글 삭제 확인";
    const actionText = confirmType === "edit" ? "수정" : "삭제";
    const btnColor = confirmType === "edit" ? "primary" : "danger";

    return (
      <Modal
        isOpen={isConfirmOpen}
        size="sm"
        onOpenChange={onConfirmChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                <p>정말 이 댓글을 {actionText}하시겠습니까?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={btnColor}
                  variant="flat"
                  onPress={() => {
                    if (confirmAction) confirmAction();
                    onClose();
                  }}
                >
                  {actionText}
                </Button>
                <Button color="default" onPress={onClose}>
                  취소
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      {/* {adminPasswordComponent()} */}
      {ModalComponent()}
      {ConfirmActionModal()}

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
            <TableColumn
              className="text-center"
              key={column.uid}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"보여줄 게시글이 없습니다"}
          items={sortedItems}
        >
          {(item) =>
            item && (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className=" text-center">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </>
  );
};

export default PostTable;
