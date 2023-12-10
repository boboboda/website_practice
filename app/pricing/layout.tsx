export default function PricingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (

		<>
		<h1>레이아웃</h1>
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				{children}
			</div>
		</section>
		</>
		
	);
}
