import * as React from "react"
import {Folder, Forward, GalleryVerticalEnd, MoreHorizontal, Pencil, Trash2} from "lucide-react"

import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu, SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentProject, setProjects} from "@/redux/projectSlice.js";
import {Link, useNavigate} from "react-router-dom";
import {Addtask} from "@/components/Addtask.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useState} from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {toast} from "sonner";


export function AppSidebar({loading}) {
  const { projects, currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open,setOpen] = useState(false);
  const [newProject,setNewProject] = useState("");
  const username = useSelector((state) => state.project.username);
  const {toggleSidebar,isMobile} = useSidebar();
  const addProject = async () => {
    setOpen(false);
    try {
      const projectResponse = await axios.post("https://task-manager-rust-sigma.vercel.app/api/project", {
        userId: username,
        projectName: newProject,
      });

      ("Project created:", projectResponse.data);

      // ✅ Fetch updated project list manually
      const response = await axios.get(`https://task-manager-rust-sigma.vercel.app/api/projects/${username}`);
      dispatch(setProjects(response.data));
      setNewProject("");
      toast(`Added New Project '${newProject}'`)
    } catch (error) {
      console.error("Error adding project:", error.response?.data || error.message);
      toast(`Error adding new project '${newProject}'`,{variant:"destructive"})
    }
  };
  const deleteProject = async (projectId,projectName) => {
    try {
      await axios.delete("https://task-manager-rust-sigma.vercel.app/api/project", {
        data:{
          userId:username,
          projectId:projectId,
        }
      });
      const response = await axios.get("https://task-manager-rust-sigma.vercel.app/api/projects/"+username);
      dispatch(setProjects(response.data));
      dispatch(setCurrentProject(null));
      navigate("/");
      toast(`Project "${projectName}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting project:", error.response?.data || error.message);
      toast(`Project "${projectName}" deletion unsuccessful.`,{variant:"destructive"});
    }
  };
  return <>
    <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  onClick={()=>{
                    dispatch(setCurrentProject(null))
                    navigate("/")
                  }}
                  size="lg" asChild>
                <a className="cursor-pointer">
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold text-2xl tracking-tighter">Task Manager</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
              </SidebarMenuItem>
              {
                projects.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                          onClick={() => {
                            if(isMobile)
                              toggleSidebar();
                            if(item !== currentProject) {
                              dispatch(setCurrentProject(item));
                              navigate("/" + item.projectId,{ replace: true });
                            }
                          }}
                      >
                        {item.projectName}
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                        >
                          <DropdownMenuItem onClick={()=>{
                            if(isMobile)
                                toggleSidebar();
                            navigate("/"+item.projectId)
                          }}>
                            <Folder className="text-muted-foreground" />
                            <span>View Project</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={()=>{
                            if(isMobile)
                              toggleSidebar();
                            deleteProject(item.projectId,item.projectName)
                          }}>
                            <Trash2 className="text-destructive" />
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroup>
          <Separator/>
          <SidebarGroup>
            <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  Important Tasks
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  Today Reminders
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button className="mt-2 w-full">Create New Project</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input
                    value={newProject}
                    onChange={(e) => {setNewProject(e.target.value)}}
                    placeholder="Enter New Project Title" required />
                <Button onClick={addProject}>Submit</Button>
              </div>
            </PopoverContent>
          </Popover>
        </SidebarFooter>
      </Sidebar>
  </>
}
