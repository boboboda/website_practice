import { title } from "@/components/primitives";
import Head from "next/head"
import { TOKEN, DATABASE_ID } from "@/config";
import ReleaseItem from "@/components/release/releaseItem";









export default async function AppRegisterPage() {

	return (
		<div className=" grid grid-cols-1 gap-0 items-start justify-start px-10 md:grid-cols-2 md:gap-8">
			{
				<h1>앱등록</h1>
			}


		</div>
	);
}

