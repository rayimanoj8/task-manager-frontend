import { Separator } from "@/components/ui/separator.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import { Addtask } from "@/components/Addtask.jsx";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentProject, setProjects} from "@/redux/projectSlice";
import {Link, Outlet, useNavigate} from "react-router-dom";
import ComponentSkeleton from "@/components/skeletons/main-skeleton.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";

export const Main = ({ username }) => {
    const dispatch = useDispatch();
    const { projects, currentProject } = useSelector((state) => state.project);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProjects = async () => {
            if (!username) return;
            try {
                const response = await axios.get(`https://task-manager-rust-sigma.vercel.app/api/projects/${username}`);
                dispatch(setProjects(response.data));
                setLoading(false)
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [username, dispatch]);
    const navigate = useNavigate();
    return <>
        {loading ?
                <ComponentSkeleton/>
                :
                <div className="flex-grow min-h-0 flex justify-center">
                    <div className="w-full h-full px-2 lg:px-20 flex flex-col gap-1">
                            <div className="flex justify-between">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="cursor-pointer" onClick={()=>{
                                            navigate("/");
                                            dispatch(setCurrentProject(null))
                                        }}>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>{username}</TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Your User id (AutoGenerated)</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
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
        }
    </>
};

export default Main;
