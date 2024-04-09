import { divider } from "@nextui-org/theme";

import Image from "next/image"
import "@/styles/globals.css";
import Hero from "../components/home/hero"
import Head from "next/head"
import { title, subtitle } from "@/components/primitives";


export default function Home() {

	return (

		
			
				<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center justify-center">
					<Head>
					<meta name="google-site-verification" content="9nZTkmZViK_nwQ0Vfp-qrT3t_bynfb9jbPkgC3sSIcM" />
					</Head>
				<Hero/>
				</div>
		
		
	);

}
