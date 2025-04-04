export default function postBoardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		
		<div className="flex flex-col w-full items-center">
				{children}
			</div>
		
	);
}
