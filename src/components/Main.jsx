import Projects from "@/components/Projects.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import { useEffect } from "react";
import axios from "axios";
import Task from "@/components/Task.jsx";
import { Addtask } from "@/components/Addtask.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setProjects, setCurrentProject } from "@/redux/projectSlice";
import {Button} from "@/components/ui/button.jsx";
import {Outlet} from "react-router-dom";

export const Main = ({ username }) => {
    const dispatch = useDispatch();
    const { projects, currentProject } = useSelector((state) => state.project);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!username) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/projects/${username}`);
                dispatch(setProjects(response.data));
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [username, dispatch]);

    return (
        <div className="px-30 py-4 flex-grow min-h-0 flex justify-center">
            {projects.length > 0 && <Projects />}
            <Separator orientation="vertical" />
            <div className="w-2/4 h-full px-4 flex flex-col gap-1">
                    <div className="flex justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>{username}</BreadcrumbLink>
                                </BreadcrumbItem>
                                {currentProject &&
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink>{currentProject?.projectName}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                }
                            </BreadcrumbList>
                        </Breadcrumb>
                        {
                            currentProject && <Addtask />
                        }
                    </div>
                    <Outlet/>
            </div>
        </div>
    );
};

export default Main;
