import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentProject } from "@/redux/projectSlice";
import {useNavigate} from "react-router-dom";

export default function Projects() {
    const dispatch = useDispatch();
    const { projects, currentProject } = useSelector((state) => state.project);
    const navigate = useNavigate();
    return (
        <ScrollArea className="w-1/6 h-full flex flex-col gap-1 px-2">
            <div className="space-y-1">
                <h1 className="px-4 py-2 text-lg font-bold tracking-wider">Projects</h1>
                {projects.map((project, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 w-full text-start hover:bg-secondary font-semibold rounded ${
                            project === currentProject ? "bg-secondary" : ""
                        }`}
                        onClick={() => {
                            dispatch(setCurrentProject(project));
                            navigate("/"+project.projectId)
                        }}

                    >
                        {project.projectName}
                    </button>
                ))}
            </div>
            <Separator />
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="mt-2 w-full">Create New Project</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <form className="space-y-2">
                        <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input placeholder="Enter New Project Title" required />
                        </div>
                        <Button>Submit</Button>
                    </form>
                </PopoverContent>
            </Popover>
        </ScrollArea>
    );
}
