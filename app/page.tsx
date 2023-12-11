import "@/styles/globals.css";
import Head from "next/head"
import { title } from "@/components/primitives";

export default function Home() {
	return(
	<div>
		{/* <Head>
			<title>빡코딩 포토폴리오</title>
			<meta name="description" content="오늘도 빡코딩"></meta>
			<link rel="icon" href="/favicon.ico"/>
		</Head> */}


		<h1 className="text-3xl font-bold underline"> 
		홈입니다. </h1>

		<h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
	</div>
	
	);

}
