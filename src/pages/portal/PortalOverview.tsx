import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PortalOverview() {
    const [faceCounts, setFaceCounts] = useState<{
        normal: number;
        icon: number;
    } | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [normalPath, setNormalPath] = useState("");
    const [iconPath, setIconPath] = useState("");
    
    useEffect(() => {
        // Load saved paths from electron-store
        window.electronAPI.getPaths().then(({ normalPath, iconPath }) => {
            if (normalPath) setNormalPath(normalPath);
            if (iconPath) setIconPath(iconPath);
            
            // Auto refresh if path exist
            if (normalPath && iconPath) {
                refreshCounts(normalPath, iconPath);
            }
        });
    }, []);
    
    const refreshCounts = async (
        nPath: string = normalPath,
        iPath: string = iconPath
    ) => {
        if (!nPath || !iPath) {
            return;
        }
        
        setIsRefreshing(true);
        const counts = await window.electronAPI.getFaceCounts(nPath, iPath);
        setFaceCounts(counts);
        setTimeout(() => setIsRefreshing(false), 500);
    };
    
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
                    <div className="flex items-center px-5 gap-2.5 w-full">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Portal</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Overview</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => refreshCounts()}
                                disabled={isRefreshing}
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                                />
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </header>
                
                {/* Content */}
                <div className="flex flex-1 flex-col p-5 gap-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Normal Faces</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {faceCounts ? faceCounts.normal.toLocaleString() : "-"}
                                </p>
                                <p className="text-sm text-muted-foreground">PNG files</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Icon Faces</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {faceCounts ? faceCounts.icon.toLocaleString() : "-"}
                                </p>
                                <p className="text-sm text-muted-foreground">PNG files</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
