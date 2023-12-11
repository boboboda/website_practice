import { divider } from "@nextui-org/theme";
import Head from "next/head"
import Image from "next/image"
import "@/styles/globals.css";
import Hero from "../components/home/hero"


export default function Home() {
	return (

		<div>
			<Head>
				<title>코딩천재 부영실</title>
				<meta name="description" content="오늘도 빡코딩"></meta>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<section className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font">
				<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
				<Hero/>
				</div>
			</section>
		</div>
	);

}
