import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { Link } from "react-router-dom";

const BreadcrumbSkeleton = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <Skeleton className="h-5 w-20" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <Skeleton className="h-5 w-28" />
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
);

const ComponentSkeleton = () => {
    return (
        <div className="flex-grow min-h-0 flex justify-center">
            <div className="w-full h-full px-2 lg:px-20 flex flex-col gap-1">
                <div className="flex justify-between">
                    <BreadcrumbSkeleton />

                    <Skeleton className="h-8 w-24" />
                </div>

                <Skeleton className="flex-grow mb-10" />
            </div>
        </div>
    );
};

export default ComponentSkeleton;
