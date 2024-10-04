import { Providers } from "../providers/providers";

export default function ReleaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
                <div className=" container mx-auto">
                    {children}
                </div>
    );
}

