import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {useDispatch, useSelector} from "react-redux";
import {addTask, setTasksList, updateTask} from "@/redux/projectSlice";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell, Briefcase, CalendarIcon, Flag } from "lucide-react";
import axios from "axios";
import {useParams} from "react-router-dom";

const formSchema = z.object({
    project: z.string().default(""),
    taskName: z.string().min(1, "Tasks name is required").default(""),
    dueDate: z.coerce.date(),
    priority: z.string().default("Medium"),
    reminder: z.string().default("Later Today"),
});

export default function TaskForm({ task = {},updateForm=false, closeDialog}) {
    const {pid} = useParams();
    const projects = useSelector((state) => state.project.projects);
    const currProject = useSelector((state) => state.project.currentProject);
    const dispatch = useDispatch();
    const username = useSelector((state) => state.project.username);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            project: currProject.projectId || "",
            taskName: task.taskName || "",
            dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
            priority: task.priority || "Medium",
            reminder: task.reminder || "Later Today",
        },
    });

    async function onSubmit(values) {
        if(!updateForm){
            console.log("creating")
            try {
                await axios.post("https://task-manager-rust-sigma.vercel.app/api/task",{
                    "userId": username,
                    "projectId": pid,
                    task:{...values}
                })
                const response = await axios.get(`https://task-manager-rust-sigma.vercel.app/api/projects/${pid}/tasks`);
                let newTasks = response.data;
                newTasks = newTasks.map((item) =>({...item,dueDate: new Date(values.dueDate).toISOString()}))
                dispatch(setTasksList(newTasks));
                toast.success("Task Added successfully!");
            } catch (error) {
                console.error("Form submission error", error);
                toast("Currently unable to Add a task");
            }
        }else{
            console.log("updating")
            try{
                console.log(task,values)
                await axios.patch(
                    "https://task-manager-rust-sigma.vercel.app/api/task",
                    {
                        userId: username,
                        projectId:pid,
                        taskId:task._id,
                        updatedFields:{...values}
                    }
                )
                dispatch(updateTask({
                    ...task,
                    ...values,
                    dueDate: new Date(values.dueDate).toISOString()
                }));
                toast.success("Task Updated successfully!");
            }catch (error) {
                console.error("Error updating task:", error.response?.data || error.message);
                toast("Unable to Update Task");
            }
        }
        closeDialog(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {/* Project Selection */}
                <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <Briefcase className="inline-block mr-2 h-4 w-4" />
                                Project
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        projects.map((item,index) =>(
                                            <SelectItem key={index} value={item.projectId}>{item.projectName}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tasks Name Input */}
                <FormField
                    control={form.control}
                    name="taskName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <Flag className="inline-block mr-2 h-4 w-4" />
                                Task Name
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter task name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Due Date Picker */}
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>
                                <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                                Due Date
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Priority & Reminder */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <Flag className="inline-block mr-2 h-4 w-4" />
                                        Priority
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Medium" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="reminder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <Bell className="inline-block mr-2 h-4 w-4" />
                                        Remind Me
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Reminder" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Later Today">Later Today</SelectItem>
                                            <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                                            <SelectItem value="Next Week">Next Week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
