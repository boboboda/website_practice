// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs, getDoc, setDoc, doc, Timestamp,
    deleteDoc, updateDoc, query, orderBy, limit,
} from "firebase/firestore";
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
            created_at: doc.data()["created_at"].toDate()
        }

        fetchedPosts.push(aPosts);

    });
    return fetchedPosts;
}

//할일 추가하기
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
            created_at: createdAtTimestamp.toDate()
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
        created_at: createdAtTimestamp.toDate()
    }

    await setDoc(newPostsRef, newPostData);

    return newPostData;
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
export async function editAPost(id, { title, is_done }) {



    const fetchedTodo = await fetchATodo(id)

    if (fetchedTodo === null) {
        return null;
    } else {

        const todoRef = doc(db, "todos", id);

        await updateDoc(todoRef, {
            title,
            is_done
        });

        return {
            id: id,
            created_at: fetchedTodo.created_at,
            title: title,
            is_done: is_done
        };
    }
}


module.exports = { fetchPosts, addAPost, deleteAPost, editAPost }


