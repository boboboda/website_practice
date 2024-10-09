
import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./header";
import Footer from "@/components/home/footer";
import { siteConfig } from "@/config/site";

import { Providers } from "@/components/providers/providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import AdFooter from "@/components/home/adFooter";
import { Metadata, Viewport } from "next";
import AppProvider from "@/components/channelTalkManager";
import { UserStoreProvider, useUserStore } from "@/components/providers/user-store-provider";
import { AuthStoreProvider } from "@/components/providers/auth-store-provider";
import dynamic from 'next/dynamic'
import { QueryClient, dehydrate } from "react-query";
import QueryProviders from "@/components/providers/query-provider";

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

// 	const queryClient = new QueryClient()

//   await queryClient.prefetchQuery({
//     queryKey: ['userSession'],
//     queryFn: refreshUserSession,
//   })

	return (
		<html lang="en" className="dark">
			<body>


				<QueryProviders>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
							<AuthStoreProvider>
								<UserStoreProvider>
									<AppProvider>
										<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
											<div className="flex flex-col w-full justify-center items-center">
												<div className="flex flex-col w-[1400px]">
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
												<Header />
												<main className="max-w-full">
													<div className="flex flex-1 w-full">
														{children}
													</div>
													<Footer />
												</main>
												

												</div>
												<AdFooter />
												
											</div>
										</Providers>
									</AppProvider>
								</UserStoreProvider>
							</AuthStoreProvider>

						</Providers>
				</QueryProviders>









			</body>

		</html>


	);
}
