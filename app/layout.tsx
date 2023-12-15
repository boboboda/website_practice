import "@/styles/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";



export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};





export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body
			// className="bg-primary"
			>
			<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
			<div className="relative flex flex-col h-screen">
			<Header/>
			<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
			{children}
			</main>
			<Footer/>
			</div>
			
			</Providers>
			
			</body>
			
		</html>				
	
		
	);
}
