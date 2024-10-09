import NavBar from "@/components/navBar";

export default function ReleaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <div className="w-full">
            <div className=" container mx-auto mt-3">
                    
                    {children}
                </div>
        </div>
                
    );
}

