import { Providers } from "../providers/providers";

export default function PricingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		
		<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>

<div className="inline-block max-w-lg text-center justify-center">
				{children}
			</div>

		</Providers>
			
		
	);
}
