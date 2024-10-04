import { Providers } from "../providers/providers";

export default function NoteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		
		<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
			{children}
			</Providers>
		
	);
}
