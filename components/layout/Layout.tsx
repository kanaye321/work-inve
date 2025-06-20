import Head from "next/head";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = "SRPH MIS Inventory Manager", description = "Comprehensive IT Asset Management System" }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 md:hidden">
            <div className="px-4 h-16 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="text-xl font-bold">IT Asset Manager</div>
              <div className="w-10"></div> {/* Empty div for flex spacing */}
            </div>
          </header>
          
          <main className="flex-1 py-6 px-4 md:px-6 lg:px-8 max-w-[2000px] mx-auto w-full">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} SRPH MIS Inventory Manager.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}