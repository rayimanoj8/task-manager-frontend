import {ModeToggle} from "@/components/ModeToggle.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Main} from "@/components/Main.jsx";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setUsername} from "@/redux/projectSlice.js";
import {Link} from "react-router-dom";
import {SidebarInset, SidebarProvider, SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {AppSidebar} from "@/components/app-sidebar.jsx";
import {Toaster} from "@/components/ui/sonner.jsx";
import {Button} from "@/components/ui/button.jsx";
import {PanelLeft} from "lucide-react";

export default function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const initializeUser = async () => {
            let userId = localStorage.getItem("userId");
            if (!userId) {
                try {
                    const response = await fetch("https://task-manager-rust-sigma.vercel.app/api/setup");
                    const data = await response.json();
                    userId = data.userId;
                    localStorage.setItem("userId", userId);
                } catch (error) {
                    console.error("Error setting up user:", error);
                }
            }
            setLoading(false);
            setUser(userId);
            dispatch(setUsername(userId));
            console.log(userId)// Notify parent component that setup is complete
        };

        initializeUser();
    }, []);
  return <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="w-full">
          <div className="w-full h-full flex flex-col mx-auto">
              <nav className="flex justify-between px-5 lg:px-10 py-4">
                  <Link to="/">
                      <h1 className="text-2xl lg:hidden font-bold tracking-tighter">
                          <SidebarTrigger/>
                          Task Manager
                      </h1>
                  </Link>
                  <ModeToggle/>
              </nav>
              {
                  loading ?
                      <div className="flex flex-grow items-center justify-center">
                          <h1 className="text-5xl font-bold">Setting Up For You...</h1>
                      </div> :
                      <Main username={user}/>
              }
              <Toaster/>
          </div>
      </SidebarInset>
  </SidebarProvider>
}
