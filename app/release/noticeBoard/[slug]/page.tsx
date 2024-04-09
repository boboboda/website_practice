import { title } from "@/components/primitives";
import NoticesTable from "@/components/release/noticeComponent/noticeBoard-table";





async function fetchNoticesApiCall(databaseName: string) {
    console.log("fetchNoticesApiCall called");
    const res = await fetch(`${process.env.BASE_URL}/api/notices/${databaseName}`, {
        cache: 'no-store'
    });

    const contentTypeHeaderValue = res.headers.get('Content-Type');
    // text/html; charset=utf-8

    if (contentTypeHeaderValue?.includes("text/html")) {
        console.log("fetchNoticesApiCall / contentTypeHeaderValue: ", contentTypeHeaderValue);
        return null;
    }

    return res.json();
}


export default async function noticeBoardPage({ params }: { params: { slug: string } }) {


    const appName = params.slug ?? ""

    const response = await fetchNoticesApiCall(appName);

    const fetchedNotices = response?.data ?? [];

    return (
    <>
    <div className="container flex pl-5 py-5 flex-col items-center justify-center gap-y-3">
        <h1 className={title()}>공지사항</h1>
        <NoticesTable notices={fetchedNotices} appName={appName} />
       
    </div>
    </>)
}

