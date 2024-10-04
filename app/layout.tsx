import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./header";
import Footer from "@/components/home/footer";
import { siteConfig } from "@/config/site";

import { Providers } from "./providers/providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import AdFooter from "@/components/home/adFooter";
import { Metadata, Viewport } from "next";
import AppProvider from "@/components/channelTalkManager";
import { UserStoreProvider } from "./providers/user-store-provider";
import { AuthStoreProvider } from "./providers/auth-store-provider";
import dynamic from 'next/dynamic'

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), {
  ssr: false,
})



export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/siteIcon.ico",
		shortcut: "/siteIcon.png",
		apple: "/apple-touch-icon.png",
	},
};

export const viewport: Viewport = {
  themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {


	return (
		<html lang="en" className="dark">
			<body>
				

				<AuthStoreProvider>
				<UserStoreProvider>
				<AppProvider>
				<Providers themeProps={{attribute: "class", defaultTheme: "dark" }}>
			<div className="flex flex-col h-screen w-full">
			<ToastContainer
        className=" foo"
        style={{ width: "450px" }}
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
			<Header/>
			<main className="flex-grow flex flex-col w-full md:pt-16">
                <div className="flex-grow">
                  {children}
                </div>
                <Footer />
              </main>
			<AdFooter/>
			</div>
			</Providers>
				</AppProvider>
				</UserStoreProvider>
				</AuthStoreProvider>
				
			
			
			</body>
			
		</html>				
	
		
	);
}
