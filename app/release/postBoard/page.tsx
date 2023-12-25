import { title } from "@/components/primitives";
import Head from "next/head"
import PostsTable from "@/components/release/postBoard-table";
import { Post } from "@/types";




async function fetchPostsApiCall() {
    console.log("fetchPostsApiCall called");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        cache: 'no-store'
    });

    const contentTypeHeaderValue = res.headers.get('Content-Type');
    // text/html; charset=utf-8

    if (contentTypeHeaderValue?.includes("text/html")) {
        console.log("fetchTodosApiCall / contentTypeHeaderValue: ", contentTypeHeaderValue);
        return null;
    }

    return res.json();
}



export default async function BulletinPage() {

	const response = await fetchPostsApiCall();

    const fetchedPosts = response?.data ?? [];
	

	return (
        <div className="flex flex-col space-y-8">
            {/* <h1 className={title()}>Todos</h1>
            <PostsTable posts={fetchedPosts} /> */}
        </div>
    );
}

