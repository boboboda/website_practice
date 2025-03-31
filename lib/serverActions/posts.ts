
'use server';

import prisma from "@/lib/prisma"
import { revalidatePath } from 'next/cache';
import moment from 'moment';
import { Post, Comment } from "@/types";



// 게시글 추가하기
export async function addAPost({ 
    appName, 
    postType, 
    password, 
    title, 
    writer, 
    content }: {
        appName: string;
        postType: string;
        password: string;
        title: string;
        writer: string;
        content: string;
    }) {
    try {
      // 콜렉션에서 가장 높은 listNumber 찾기
      const lastPost = await prisma.post.findFirst({
        where: {
          appName,
          postType
        },
        orderBy: {
          listNumber: 'desc'
        }
      });
  
      // 새 listNumber 계산 (존재하지 않으면 1로 시작)
      const newListNumber = lastPost ? lastPost.listNumber + 1 : 1;
  
      // 새 게시글 생성
      const newPost = await prisma.post.create({
        data: {
          password,
          title,
          listNumber: newListNumber,
          writer,
          content,
          appName,
          postType
        }
      });
  
      revalidatePath(`/${appName}/${postType}`);
  
      return {
        id: newPost.id,
        password: newPost.password,
        title: newPost.title,
        listNumber: newPost.listNumber,
        writer: newPost.writer,
        content: newPost.content,
        created_at: newPost.createdAt,
        comments: []
      };
    } catch (error) {
      console.error('게시글 추가 실패:', error);
      throw new Error('게시글을 추가하는 중 오류가 발생했습니다.');
    }
  }



// 모든 게시글 가져오기
export async function fetchPosts(
  appName: string, 
  postType: string
): Promise<{ posts: Post[] }> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        appName,
        postType
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        comments: {
          include: {
            replies: true
          }
        }
      }
    });

    // 날짜를 모두 문자열로 변환
    const formattedPosts: Post[] = posts.map(post => ({
      id: post.id,
      listNumber: post.listNumber.toString(),
      password: post.password,
      writer: post.writer,
      title: post.title,
      content: post.content,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        writer: comment.writer,
        password: comment.password,
        // 문자열로 변환
        created_at: moment(comment.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        replys: comment.replies.map(reply => ({
          id: reply.id,
          personId: reply.personId || '',
          writer: reply.writer,
          content: reply.content,
          password: reply.password,
          created_at: moment(reply.createdAt).format("YYYY-MM-DD HH:mm:ss")
        }))
      })),
      created_at: moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss")
    }));

    return {
      posts: formattedPosts
    };
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    return { posts: [] };
  }
}
// // 댓글 추가하기
// export async function addAComment({ appName, postType, postId, commentPassword, commentWriter, commentContent }) {
//   try {
//     // 게시글 존재 여부 확인
//     const post = await prisma.post.findUnique({
//       where: { id: postId }
//     });

//     if (!post) {
//       throw new Error('게시글을 찾을 수 없습니다.');
//     }

//     // 댓글 추가
//     const newComment = await prisma.comment.create({
//       data: {
//         password: commentPassword,
//         writer: commentWriter,
//         content: commentContent,
//         postId: postId
//       }
//     });

//     revalidatePath(`/${appName}/${postType}/${postId}`);

//     // 업데이트된 게시글 정보 반환
//     const updatedPost = await prisma.post.findUnique({
//       where: { id: postId },
//       include: {
//         comments: {
//           include: {
//             replies: true
//           }
//         }
//       }
//     });

//     return {
//       id: updatedPost.id,
//       title: updatedPost.title,
//       created_at: updatedPost.createdAt,
//       listNumber: updatedPost.listNumber,
//       writer: updatedPost.writer,
//       content: updatedPost.content,
//       password: updatedPost.password,
//       comments: updatedPost.comments
//     };
//   } catch (error) {
//     console.error('댓글 추가 실패:', error);
//     throw new Error('댓글을 추가하는 중 오류가 발생했습니다.');
//   }
// }

// // 댓글 삭제
// export async function deleteAComment(appName, postType, postId, commentId) {
//   try {
//     // 댓글 삭제
//     await prisma.comment.delete({
//       where: { id: commentId }
//     });

//     revalidatePath(`/${appName}/${postType}/${postId}`);

//     // 업데이트된 게시글 정보 반환
//     const updatedPost = await prisma.post.findUnique({
//       where: { id: postId },
//       include: {
//         comments: {
//           include: {
//             replies: true
//           }
//         }
//       }
//     });

//     return {
//       id: updatedPost.id,
//       title: updatedPost.title,
//       created_at: updatedPost.createdAt,
//       listNumber: updatedPost.listNumber,
//       writer: updatedPost.writer,
//       content: updatedPost.content,
//       password: updatedPost.password,
//       comments: updatedPost.comments
//     };
//   } catch (error) {
//     console.error('댓글 삭제 실패:', error);
//     return null;
//   }
// }

// // 답글 추가하기
// export async function addAReply({ appName, postType, postId, commentId, personId, replyPassword, replyWriter, replyContent }) {
//   try {
//     // 댓글 존재 여부 확인
//     const comment = await prisma.comment.findUnique({
//       where: { id: commentId }
//     });

//     if (!comment) {
//       throw new Error('댓글을 찾을 수 없습니다.');
//     }

//     // 답글 추가
//     await prisma.reply.create({
//       data: {
//         personId,
//         password: replyPassword,
//         writer: replyWriter,
//         content: replyContent,
//         commentId
//       }
//     });

//     revalidatePath(`/${appName}/${postType}/${postId}`);

//     // 업데이트된 게시글 정보 반환
//     const updatedPost = await prisma.post.findUnique({
//       where: { id: postId },
//       include: {
//         comments: {
//           include: {
//             replies: true
//           }
//         }
//       }
//     });

//     return {
//       id: updatedPost.id,
//       title: updatedPost.title,
//       created_at: updatedPost.createdAt,
//       listNumber: updatedPost.listNumber,
//       writer: updatedPost.writer,
//       content: updatedPost.content,
//       password: updatedPost.password,
//       comments: updatedPost.comments
//     };
//   } catch (error) {
//     console.error('답글 추가 실패:', error);
//     throw new Error('답글을 추가하는 중 오류가 발생했습니다.');
//   }
// }

// // 답글 삭제
// export async function deleteAReply(appName, postType, postId, commentId, replyId) {
//   try {
//     // 답글 삭제
//     await prisma.reply.delete({
//       where: { id: replyId }
//     });

//     revalidatePath(`/${appName}/${postType}/${postId}`);

//     // 업데이트된 게시글 정보 반환
//     const updatedPost = await prisma.post.findUnique({
//       where: { id: postId },
//       include: {
//         comments: {
//           include: {
//             replies: true
//           }
//         }
//       }
//     });

//     return {
//       id: updatedPost.id,
//       title: updatedPost.title,
//       created_at: updatedPost.createdAt,
//       listNumber: updatedPost.listNumber,
//       writer: updatedPost.writer,
//       content: updatedPost.content,
//       password: updatedPost.password,
//       comments: updatedPost.comments
//     };
//   } catch (error) {
//     console.error('답글 삭제 실패:', error);
//     return null;
//   }
// }

// // 단일 게시글 조회
// export async function fetchAPost(appName, postType, id) {
//   try {
//     if (!id) {
//       return null;
//     }

//     const post = await prisma.post.findFirst({
//       where: { 
//         id,
//         appName,
//         postType
//       },
//       include: {
//         comments: {
//           include: {
//             replies: true
//           }
//         }
//       }
//     });

//     if (!post) {
//       return null;
//     }

//     return {
//       id: post.id,
//       listNumber: post.listNumber,
//       password: post.password,
//       writer: post.writer,
//       title: post.title,
//       content: post.content,
//       comments: post.comments,
//       created_at: post.createdAt
//     };
//   } catch (error) {
//     console.error('게시글 조회 실패:', error);
//     return null;
//   }
// }

// // 단일 게시글 삭제
// export async function deleteAPost(appName, postType, id) {
//   try {
//     // 게시글 찾기
//     const post = await prisma.post.findFirst({
//       where: { 
//         id,
//         appName,
//         postType 
//       }
//     });

//     if (!post) {
//       return null;
//     }

//     // 게시글 삭제 (관계된 댓글과 답글은 cascade로 자동 삭제)
//     await prisma.post.delete({
//       where: { id }
//     });

//     revalidatePath(`/${appName}/${postType}`);

//     return post;
//   } catch (error) {
//     console.error('게시글 삭제 실패:', error);
//     return null;
//   }
// }

// // 단일 게시글 수정
// export async function editAPost(appName, postType, id, { title, password, content }) {
//   try {
//     // 게시글 존재 여부 확인
//     const existingPost = await prisma.post.findFirst({
//       where: { 
//         id,
//         appName,
//         postType 
//       }
//     });

//     if (!existingPost) {
//       return null;
//     }

//     // 게시글 업데이트
//     const updatedPost = await prisma.post.update({
//       where: { id },
//       data: {
//         title,
//         password,
//         content
//       }
//     });

//     revalidatePath(`/${appName}/${postType}`);
//     revalidatePath(`/${appName}/${postType}/${id}`);

//     return {
//       id,
//       created_at: updatedPost.createdAt,
//       title,
//       password,
//       content
//     };
//   } catch (error) {
//     console.error('게시글 수정 실패:', error);
//     return null;
//   }
// }