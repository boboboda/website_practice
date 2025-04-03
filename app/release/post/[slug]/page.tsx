import { title } from "@/components/primitives";
import PostTable from "@/components/release/postComponent/PostTable";
import { fetchPosts } from "@/lib/serverActions/posts";





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


    const appName = params.slug ?? ""
    
        const response = await fetchPosts(appName, "post");
        
    
        const fetchedPosts = response?.posts ?? [];

      

    return (<>
    <div className="container flex pl-5 py-5 flex-col h-[100%] items-center justify-center gap-y-3">
        <h1 className={title()}>문의사항</h1>
        <PostTable posts={fetchedPosts} appName={appName} postType="post"/>
    </div>
    </>)
}

