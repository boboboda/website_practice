import { title } from "@/components/primitives";
import PostsTable from "@/components/release/postBoard-table";





async function fetchPostsApiCall(databaseName: string) {
    console.log("fetchPostsApiCall called");
    const res = await fetch(`http://localhost:3000/api/posts/${databaseName}`, {
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


    const appName = params.slug ?? ""

    const response = await fetchPostsApiCall(appName);

    const fetchedPosts = response.data ?? [];


    return (<>
    <div className="container mx-auto flex px-5 py-24 md:flex flex-col items-center">
        <h1 className={title()}>문의게시판</h1>
        <PostsTable posts={fetchedPosts} appName={appName} />
    </div>
    </>)
}

