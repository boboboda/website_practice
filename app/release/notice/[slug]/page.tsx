import { title } from "@/components/primitives";
import PostTable from "@/components/release/postComponent/PostTable";
import { fetchPosts } from "@/lib/serverActions/posts";


export default async function noticeBoardPage({ params }: { params: { slug: string } }) {


    const appName = params.slug ?? ""

    const response = await fetchPosts(appName, "notice");
    

    const fetchedNotices = response?.posts ?? [];

    return (
    <>
    <div className="container flex w-full pl-5 py-5 flex-col items-center justify-center gap-y-3">
        <h1 className={title()}>공지사항</h1>
        <PostTable posts={fetchedNotices} appName={appName} postType="notice" />
       
    </div>
    </>)
}

