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
import {addTask, updateTask} from "@/redux/projectSlice";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell, Briefcase, CalendarIcon, Flag } from "lucide-react";

const formSchema = z.object({
    project: z.string().default(""),
    taskName: z.string().min(1, "Task name is required").default(""),
    dueDate: z.coerce.date(),
    priority: z.string().default("medium"),
    reminder: z.string().default("1-hour"),
});

export default function TaskForm({ task = {} }) {
    const projects = useSelector((state) => state.project.projects);
    const currProject = useSelector((state) => state.project.currentProject);
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            project: currProject.projectName || "",
            taskName: task.taskName || "",
            dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
            priority: task.priority || "medium",
            reminder: task.reminder || "1-hour",
        },
    });

    function onSubmit(values) {
        try {

            dispatch(addTask({
                ...values,
                dueDate: new Date(values.dueDate).toISOString()
            }));
            console.log(values);
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
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
                            <Select onValueChange={field.onChange} value={field.value}>
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

                {/* Task Name Input */}
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
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
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
                                            <SelectItem value="1-hour">Later Today</SelectItem>
                                            <SelectItem value="1-day">Tomorrow</SelectItem>
                                            <SelectItem value="custom">Next Week</SelectItem>
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
