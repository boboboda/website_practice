import NavBar from "@/components/navBar";
import Header from "../header";


export default function MainLayout({
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


















