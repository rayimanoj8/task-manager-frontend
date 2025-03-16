import {ModeToggle} from "@/components/ModeToggle.jsx";
import {Main} from "@/components/Main.jsx";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setUsername} from "@/redux/projectSlice.js";
import {Link} from "react-router-dom";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {AppSidebar} from "@/components/app-sidebar.jsx";
import {Toaster} from "@/components/ui/sonner.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {Cloudy, Terminal} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Badge} from "@/components/ui/badge.jsx";

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
            (userId)// Notify parent component that setup is complete
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
                      <div className="h-full px-2 lg:px-20 space-y-2 flex flex-col">
                          <Alert>
                              <Cloudy className="size-4" />
                              <AlertTitle>Plan your tasks based on the weather </AlertTitle>
                              <AlertDescription>
                                  Check the weather details before planning or performing any tasks in the area.
                                  &nbsp;
                                  <Link to="/weather" className="font-semibold underline underline-offset-4">click here</Link>
                              </AlertDescription>
                          </Alert>

                          <Separator/>
                          <Main username={user} />
                      </div>
              }
              <Toaster/>
          </div>
      </SidebarInset>
  </SidebarProvider>
}
