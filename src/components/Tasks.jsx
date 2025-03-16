import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import {deleteTasks, setLoadingTasks, setTasksList, updateTask} from "@/redux/projectSlice";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Check, Delete, Ellipsis, Pencil, Trash, X} from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog.jsx";
import TaskForm from "@/components/TaskForm.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {toast} from "sonner";
import TableSkeleton from "@/components/skeletons/table-skeleton.jsx";

const Tasks = () => {
    const dispatch = useDispatch();
    const {pid} = useParams();
    const tasks = useSelector((state) => state.project.tasks);
    const username = useSelector((state) => state.project.username);
    const loadingTasks = useSelector((state) => state.project.loadingTasks);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                dispatch(setLoadingTasks(true));
                const response = await axios.get(`https://task-manager-rust-sigma.vercel.app/api/projects/${pid}/tasks`);
                dispatch(setTasksList(response.data))
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                dispatch(setLoadingTasks(false));
            }
        };

        if (pid) {
            fetchTasks(); // ✅ Fetch tasks only if `projectId` is available
        }
    }, [pid]);

    const markAsDone = async (task)=>{
        try{
             await axios.patch(
                "https://task-manager-rust-sigma.vercel.app/api/task",
                {
                    userId: username,
                    projectId:pid,
                    taskId:task._id,
                    updatedFields:{...task,taskCompleted:!task.taskCompleted}
                }
            )
            dispatch(updateTask({...task,taskCompleted:!task.taskCompleted}))
            toast.success("Task Status Updated");
        }catch (error) {
            console.error("Error updating task:", error.response?.data || error.message);
            toast("Task Status Not Updated",{variant:"destructive"});
        }
    }

    const deleteSelectedTasks = async (taskId) => {
        try {
            (taskId);
            const response = await axios.delete(`https://task-manager-rust-sigma.vercel.app/api/projects/${pid}`, {
                data: { tasks: [taskId] },
            });

            ("Tasks deleted successfully:", response.data);

            // ✅ Only update Redux state if API call is successful
            dispatch(deleteTasks(taskId));
            toast.success("Task Deleted Successfully")
        } catch (error) {
            console.error("Error deleting tasks:", error.response?.data || error.message);
            toast("Task Deletion Unsuccessful",{variant:"destructive"})
        }
    };

    const [open,setOpen] = useState(false);
    const [editTask,setEditTask] = useState({});
    const dic = {
        High:"destructive",
        Medium:"secondary",
        Low:"secondary",
    }
    return (
        <>

            <ScrollArea className="flex-grow min-h-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Reminder</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingTasks && <TableSkeleton/>}
                        {!loadingTasks && tasks.length === 0 ?(
                            <TableRow>
                                <TableCell colSpan="5" className="text-center text-gray-500">
                                    No tasks available
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task,index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        className={`lg:w-2/5 ${task.taskCompleted && "line-through"}`}>{task.taskName}</TableCell>
                                    <TableCell>{format(new Date(task.dueDate), "PPP")}</TableCell>
                                    <TableCell><Badge variant={dic[task.priority]}>{task.priority}</Badge></TableCell>
                                    <TableCell>{task.reminder}</TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm">
                                                    <Ellipsis />
                                                </Button>
                                            </TableCell>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>{task.taskName}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={()=>{markAsDone(task)}}>
                                                {
                                                    task.taskCompleted ? <>
                                                                            <X/> Undo
                                                                        </>: <>
                                                                            <Check /> Mark as done
                                                                        </>
                                                }
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setEditTask(task);
                                                setOpen(!open);
                                            }}>
                                                <Pencil/> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => deleteSelectedTasks(task._id)}>
                                                <Trash/> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <TaskForm task={editTask} updateForm={true} closeDialog={setOpen}/>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Tasks;
