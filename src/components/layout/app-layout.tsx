import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Outlet, useMatches } from "react-router-dom";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppLayout() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const matches = useMatches();
    
    const crumbs = matches
        .map((m) => m.handle as { breadcrumb?: { label: string; href?: string } })
        .filter((h): h is { breadcrumb: { label: string; href?: string } } => !!h?.breadcrumb)
        .map((h) => h.breadcrumb);
    
    const breadcrumb = {
        parent: crumbs.length > 1 ? crumbs[crumbs.length - 2].label : undefined,
        current: crumbs.length > 0 ? crumbs[crumbs.length - 1].label : undefined,
    };
    
    const handleRefresh = () => {
        if (refreshing) return;
        
        setRefreshing(true);
        setRefreshKey((prev) => prev + 1);
        
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    };
    
    return (
        <SidebarProvider>
            <AppSidebar />
            
            <SidebarInset>
                {/* Header */}
                <header
                    className="
                        sticky top-0 z-10
                        flex items-center px-5 py-2.5
                        bg-background/50 backdrop-blur-xl border-b
                    "
                >
                    {/* Left Section */}
                    <div className="w-full flex items-center gap-2.5 h-5">
                        <SidebarTrigger />
                        <Separator orientation="vertical" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumb.parent && (
                                    <>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">{breadcrumb.parent}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                    </>
                                )}
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{breadcrumb.current}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    
                    {/* Right Section */}
                    <div className="ml-auto flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            title="Refresh"
                        >
                            <RefreshCw
                                className={`
                                    h-4 w-4
                                    ${refreshing ? "animate-spin" : ""}
                                `}
                            />
                        </Button>
                        <ModeToggle />
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex flex-1 flex-col p-5 gap-5">
                    <Outlet key={refreshKey} />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
