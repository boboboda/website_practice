// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs, getDoc, setDoc, doc, Timestamp,
    deleteDoc, updateDoc, query, orderBy, limit, deleteField, FieldValue, arrayRemove, findIndex, filter
} from "firebase/firestore";
import moment from "moment";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
import { UUID, randomUUID } from "crypto";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// 모든 할일 가져오기
// 컬랙션 네임 컬렉션 아이디 수집

export async function fetchPosts(collectionName) {


    const postsRef = collection(db, `${collectionName}`)

    const descQuery = await query(postsRef, orderBy("created_at", "desc"));


    const querySnapshot = await getDocs(descQuery);

    if (querySnapshot.empty) {
        return [];
    }

    const fetchedPosts = [];



    querySnapshot.forEach((doc) => {

        const aPosts = {
            id: doc.id,
            listNumber: doc.data()["listNumber"],
            password: doc.data()["password"],
            writer: doc.data()["writer"],
            title: doc.data()["title"],
            content: doc.data()["content"],
            comments: Object.values(doc.data()["comments"]),
            created_at: moment(doc.data()["created_at"].toDate()).format("YYYY-MM-DD HH:mm:ss")
        }
        fetchedPosts.push(aPosts);

    });

    return fetchedPosts;
}

//게시글 추가하기
export async function addAPost({
    collectionName,
    password,
    title,
    writer,
    content }) {

    console.log(`파이어베이스 add 실행됨 콜랙션 ${collectionName}`)

    const postsRef = collection(db, `${collectionName}`)

    const checkQuery = await query(postsRef, orderBy("created_at", "desc"));

    const checkQuerySnapshot = await getDocs(checkQuery);

    if (checkQuerySnapshot.docs.length === 0) {

        const newPostsRef = doc(collection(db, `${collectionName}`));

        const createdAtTimestamp = Timestamp.fromDate(new Date())

        const newPostData = {
            id: newPostsRef.id,
            password: password,
            title: title,
            listNumber: 1,
            writer: writer,
            content: content,
            created_at: createdAtTimestamp.toDate(),
            comments: []
        }

        await setDoc(newPostsRef, newPostData);

        return newPostData;

    } else {

        const descQuery = await query(postsRef, orderBy("listNumber", "desc"), limit(1))

        const querySnapshot = await getDocs(descQuery, {
            cache: 'no-store'
        });

        const listNumber = await querySnapshot.docs[0].data()["listNumber"];


        console.log(`listNumber ${listNumber}`);

        const addListNumber = Number(listNumber) + 1

        console.log(`addListNumber ${addListNumber}`);

        const newPostsRef = doc(collection(db, `${collectionName}`));

        const createdAtTimestamp = Timestamp.fromDate(new Date())

        const newPostData = {
            id: newPostsRef.id,
            password: password,
            title: title,
            listNumber: addListNumber,
            writer: writer,
            content: content,
            created_at: createdAtTimestamp.toDate(),
            comments: []
        }

        await setDoc(newPostsRef, newPostData);

        return newPostData;
    }
}


//댓글 추가하기
export async function addAComment({
    collectionName,
    postId,
    commentPassword,
    commentWriter,
    commentContent }) {

    console.log(`파이어베이스 comment add 실행됨 콜랙션 ${collectionName}`)

    const createUuid = randomUUID();

    const createdAtTimestamp = Timestamp.fromDate(new Date())

    const postRef = doc(db, `${collectionName}`, `${postId}`);

    const postSnap = (await getDoc(postRef)).data();

    console.log(`post 조회 ${postSnap.id}`)

    if (postSnap.comments === undefined) {
        const newCommentData = {
            id: postSnap.id,
            title: postSnap.title,
            created_at: postSnap.created_at,
            listNumber: postSnap.listNumber,
            writer: postSnap.writer,
            content: postSnap.content,
            password: postSnap.password,
            comments: [
                {
                    id: createUuid,
                    password: commentPassword,
                    writer: commentWriter,
                    content: commentContent,
                    created_at: createdAtTimestamp.toDate()
                }
            ]

        }
        await setDoc(doc(db, `${collectionName}`, `${postId}`), newCommentData);

        return newCommentData;

    } else {
        const newCommentData = {
            id: postSnap.id,
            title: postSnap.title,
            created_at: postSnap.created_at,
            listNumber: postSnap.listNumber,
            writer: postSnap.writer,
            content: postSnap.content,
            password: postSnap.password,
            comments: [
                ...postSnap.comments,
                {
                    id: createUuid,
                    password: commentPassword,
                    writer: commentWriter,
                    content: commentContent,
                    created_at: createdAtTimestamp.toDate()
                }]

        }


        await setDoc(doc(db, `${collectionName}`, `${postId}`), newCommentData);

        return newCommentData;

    }


}

//댓글 삭제
export async function deleteAComment(collectionName, postId, commentId) {

    console.log(`댓글 삭제 postId${postId}, commentId ${commentId}`)

    // const fetchedPost = await fetchAPost(collectionName, id)

    const postRef = doc(db, `${collectionName}`, `${postId}`);

    const postSnap = (await getDoc(postRef)).data();

    if (postSnap.comments === undefined) {
        return null; // 댓글이 없으면 종료
    } else {

        const formatArray = Array.isArray(postSnap.comments)
            ? postSnap.comments
            : Object.values(postSnap.comments);

        const newComments = formatArray.filter((comment) => comment.id !== commentId);

        console.log(newComments)

        const deleteUpdateData = {
            id: postSnap.id,
            title: postSnap.title,
            created_at: postSnap.created_at,
            listNumber: postSnap.listNumber,
            writer: postSnap.writer,
            content: postSnap.content,
            password: postSnap.password,
            comments: newComments
        }

        console.log(deleteUpdateData)

        await setDoc(postRef, deleteUpdateData);

        return deleteUpdateData;
    }
}

//단일 할일 조회
export async function fetchAPost(collectionName, id) {


    if (id === null) {
        return null;
    }


    const postDocRef = doc(db, `${collectionName}`, id);

    const postDocSnap = await getDoc(postDocRef);

   

    if (postDocSnap.exists()) {

        const fetchedPost = {
            id: postDocSnap.id,
            listNumber: postDocSnap.data()["listNumber"],
            password: postDocSnap.data()["password"],
            writer: postDocSnap.data()["writer"],
            title: postDocSnap.data()["title"],
            content: postDocSnap.data()["content"],
            comments: Object.values(postDocSnap.data()["comments"]),
            created_at: postDocSnap.data()["created_at"].toDate()
        }
        return fetchedPost
    } else {

        return null;
    }


}



//단일 삭제
export async function deleteAPost(collectionName, id) {

    console.log(`post 삭제 ${id}`)

    const fetchedPost = await fetchAPost(collectionName, id)

    if (fetchedPost === null) {
        return null;
    } else {
        await deleteDoc(doc(db, `${collectionName}`, id));
        return fetchedPost;
    }
}


//단일 할일 수정
export async function editAPost(collectionName, id, { title, password, content }) {

    console.log(`post 수정 ${collectionName} ${id} ${title}, ${password} ${content}`)

    const fetchedPost = await fetchAPost(collectionName, id)

    if (fetchedPost === null) {
        return null;
    } else {

        const postRef = doc(db, `${collectionName}`, id);

        await updateDoc(postRef, {
            title,
            password,
            content
        });

        return {
            id: id,
            created_at: fetchedPost.created_at,
            title: title,
            password: password,
            content: content
        };
    }
}


module.exports = { fetchPosts, addAComment, addAPost, deleteAPost, editAPost, deleteAComment }


