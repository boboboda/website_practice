import NavBar from "@/components/navBar";
import NavbarController from "@/lib/wrappers/NavbarController";



export default function NoteListLayout({
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


















