
import {ModeToggle} from "@/components/ModeToggle.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Main} from "@/components/Main.jsx";
import {useEffect, useState} from "react";

export default function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const initializeUser = async () => {
            let userId = localStorage.getItem("userId");

            if (!userId) {
                try {
                    const response = await fetch("http://localhost:5000/api/setup");
                    const data = await response.json();
                    userId = data.userId;
                    localStorage.setItem("userId", userId);
                } catch (error) {
                    console.error("Error setting up user:", error);
                }
            }

            setLoading(false);
            setUser(userId);
            console.log(userId)// Notify parent component that setup is complete
        };

        initializeUser();
    }, []);
  return <div className="h-full flex flex-col">
          <nav className="flex justify-between px-10 py-4">
            <h1 className="text-2xl font-bold tracking-tighter">
              Task Manager
            </h1>
            <ModeToggle/>
          </nav>
          <Separator/>
      {
          loading ?
              <div className="flex flex-grow items-center justify-center">
                  <h1 className="text-5xl font-bold">Setting Up For You...</h1>
              </div>:
              <Main username={user}/>
      }
  </div>
}