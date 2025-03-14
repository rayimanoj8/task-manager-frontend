import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import { deleteTasks, updateTask } from "@/redux/projectSlice";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";

const Task = () => {
    const dispatch = useDispatch();
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const {pid} = useParams();
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`);
                setTasks(response.data); // ✅ Store tasks in state
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (pid) {
            fetchTasks(); // ✅ Fetch tasks only if `projectId` is available
        }
    }, [pid]);
    useEffect(() => {
        // If all tasks are selected, set selectAll to true; otherwise, false
        if (tasks.length > 0) {
            setSelectAll(selectedTasks.length === tasks.length);
        }
    }, [selectedTasks, tasks]);

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedTasks([]); // Deselect all
        } else {
            setSelectedTasks(tasks.map((task) => task._id)); // Select all tasks
        }
        setSelectAll((prev) => !prev);
    };

    const markSelectedAsCompleted = () => {
        selectedTasks.forEach((taskId) => {
            dispatch(updateTask({ _id: taskId, completed: true }));
        });
        setSelectedTasks([]);
    };

    const deleteSelectedTasks = () => {
        dispatch(deleteTasks(selectedTasks));
        setSelectedTasks([]);
    };

    return (
        <>

            <ScrollArea className="flex-grow min-h-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                            <span className="flex items-center gap-1">
                                <Checkbox
                                    className="rounded-full"
                                    onCheckedChange={handleSelectAll}
                                    checked={selectAll}
                                />
                                Status
                            </span>
                            </TableHead>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Reminder</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!tasks ?(
                            <TableRow>
                                <TableCell colSpan="5" className="text-center text-gray-500">
                                    No tasks available
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task,index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Checkbox
                                            className="rounded-full"
                                            checked={selectedTasks.includes(task._id)}
                                            onCheckedChange={() => toggleTaskSelection(task._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="w-2/5">{task.taskName}</TableCell>
                                    <TableCell>{format(new Date(task.dueDate), "PPP")}</TableCell>
                                    <TableCell>{task.priority}</TableCell>
                                    <TableCell>{task.reminder}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
            <div className="flex justify-end gap-2">
                <Button onClick={markSelectedAsCompleted}>Make Updates</Button>
                <Button
                    onClick={deleteSelectedTasks}
                    variant="destructive">Delete Selected</Button>
            </div>
        </>
    );
};

export default Task;
