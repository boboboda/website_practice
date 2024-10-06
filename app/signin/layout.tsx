
export default function SignInLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
        <div className="w-full flex mt-[80px] text-center justify-center">
        {children}
    </div>
	);
}
