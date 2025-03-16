import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TaskForm from "@/components/TaskForm.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useState} from "react";

export const Addtask = ({task={}})=>{
    const [open, setOpen] = useState(false);
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
                New Task
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Task Form</DialogTitle>
                <DialogDescription>
                    Your Project is already Selected
                </DialogDescription>
            </DialogHeader>
            <TaskForm task={task} closeDialog={setOpen}/>
        </DialogContent>
    </Dialog>
}