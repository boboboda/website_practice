import { title } from "@/components/primitives";
import Head from "next/head"
// import PostsTable from "@/components/release/postboard-table";
import { Post } from "@/types";
import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation"




async function fetchPostsApiCall(databaseName: string) {
    console.log("fetchPostsApiCall called");
    const res = await fetch(`${process.env.BASE_URL}/api/posts/${databaseName}`, {
        cache: 'no-store'
    });

    const contentTypeHeaderValue = res.headers.get('Content-Type');
    // text/html; charset=utf-8

    if (contentTypeHeaderValue?.includes("text/html")) {
        console.log("fetchPostsApiCall / contentTypeHeaderValue: ", contentTypeHeaderValue);
        return null;
    }

    return res.json();
}


export default async function postBoardPage({ params }: { params: { slug: string } }) {

    const response = await fetchPostsApiCall(params.slug);

    const fetchedPosts = response?.data ?? [];

    console.log(`postBoardPage ${JSON.stringify(fetchedPosts)}`)

    const data = response

    return (<></>)
}

