import "@/styles/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (

		<>
		
		<Header/>
		<h1>레이아웃</h1>
		{children}
		<Footer/>
		</>
		
		
		
		

					
		// {// 배경색
		// /* <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					
		// 		</Providers> */}
	
		
	);
}
