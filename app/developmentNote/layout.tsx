import { Providers } from "../providers/providers";


export default function DevelopmentNoteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		
			
<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
<div>
				{children}
			</div>

</Providers>
		
	);
}
