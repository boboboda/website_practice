import NavBar from "@/components/navBar";



export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
                <div className="w-full">             
                    {children}
                </div>
    );

}


















