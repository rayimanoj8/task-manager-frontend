import {Button} from "@/components/ui/button.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import * as React from "react";
import axios from "axios";
import {setCurrentProject, setProjects} from "@/redux/projectSlice.js";
import {toast} from "sonner";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton.jsx";

export const EmptyComponent = () =>{
    const [newProject, setNewProject] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const username = useSelector((state) => state.project.username);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const addProject = async () => {
        setOpen(false);
        setLoading(true)
        try {
            const projectResponse = await axios.post("https://task-manager-rust-sigma.vercel.app/api/project", {
                userId: username,
                projectName: newProject,
            });

            console.log("Project created:", projectResponse.data);

            // ✅ Fetch updated project list manually
            const response = await axios.get(`https://task-manager-rust-sigma.vercel.app/api/projects/${username}`);
            dispatch(setProjects(response.data));
            setNewProject("");
            toast(`Added New Project '${newProject}'`)
            dispatch(setCurrentProject(response.data[response.data.length - 1]));
            navigate("/"+response.data[response.data.length-1].projectId);
        } catch (error) {
            console.error("Error adding project:", error.response?.data || error.message);
            toast(`Error adding new project '${newProject}'`,{variant:"destructive"})
        }finally {
            setLoading(false);
        }
    };
    return <>
        {
            loading ?
                <Skeleton className="w-full h-96"/>
                : <div className="flex flex-col gap-2 flex-grow items-center justify-center">
                <p className="text-2xl font-bold text-muted-foreground text-center">
                    No project selected. Please choose or create one.
                </p>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button>Create Project</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input
                                value={newProject}
                                onChange={(e) => {
                                    setNewProject(e.target.value)
                                }}
                                placeholder="Enter New Project Title" required/>
                            <Button onClick={addProject}>Submit</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        }
    </>
}