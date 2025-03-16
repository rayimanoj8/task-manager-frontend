import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarFooter, SidebarMenuAction } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const SidebarSkeleton = () => {
    return (
        <Sidebar>
            {/* Sidebar Header Skeleton */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <Skeleton className="h-8 w-32" />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Sidebar Content Skeleton */}
            <SidebarContent>
                {/* Projects Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Skeleton className="h-4 w-24" />
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <SidebarMenuItem key={index} className="flex justify-between items-center">
                                <SidebarMenuButton>
                                    <Skeleton className="h-5 w-32" />
                                </SidebarMenuButton>
                                <SidebarMenuAction>
                                    <Skeleton className="h-5 w-5" />
                                </SidebarMenuAction>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <Separator />

                {/* Shortcuts Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Skeleton className="h-4 w-24" />
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton>
                                    <Skeleton className="h-5 w-32" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer Skeleton */}
            <SidebarFooter>
                <Skeleton className="h-10 w-full mt-2" />
            </SidebarFooter>
        </Sidebar>
    );
};

export default SidebarSkeleton;
