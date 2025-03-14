import {Button} from "@/components/ui/button.jsx";

export const EmptyComponent = () =>{
    return <div className="flex flex-col gap-2 flex-grow items-center justify-center">
        <p className="text-muted-foreground tracking-wider">
            No project selected. Please choose or create one.
        </p>
        <Button>Create Project</Button>
    </div>
}