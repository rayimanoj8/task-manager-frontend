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

export const Addtask = ()=>{
    return <Dialog>
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
            <TaskForm/>
        </DialogContent>
    </Dialog>
}