import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Settings } from "lucide-react";

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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
    const [faceCounts, setFaceCounts] = useState<{
        normal: number;
        icon: number;
    } | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [normalPath, setNormalPath] = useState("");
    const [iconPath, setIconPath] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // Temporary state for dialog input
    const [tempNormalPath, setTempNormalPath] = useState("");
    const [tempIconPath, setTempIconPath] = useState("");
    
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
    
    useEffect(() => {
        if (dialogOpen) {
            setTempNormalPath(normalPath);
            setTempIconPath(iconPath);
        } else {
            setTempNormalPath(normalPath);
            setTempIconPath(iconPath);
        }
    }, [dialogOpen, normalPath, iconPath]);
    
    const refreshCounts = async (
        nPath: string = normalPath,
        iPath: string = iconPath
    ) => {
        if (!nPath || !iPath) {
            setDialogOpen(true);
            return;
        }
        
        setIsRefreshing(true);
        const counts = await window.electronAPI.getFaceCounts(nPath, iPath);
        setFaceCounts(counts);
        setTimeout(() => setIsRefreshing(false), 500);
    };
    
    const savePaths = async () => {
        if (!tempNormalPath.trim() || !tempIconPath.trim()) return;
        
        const trimmedNormalPath = tempNormalPath.trim();
        const trimmedIconPath = tempIconPath.trim();
        
        await window.electronAPI.savePaths(trimmedNormalPath, trimmedIconPath);
        setNormalPath(trimmedNormalPath);
        setIconPath(trimmedIconPath);
        setDialogOpen(false);
        refreshCounts(trimmedNormalPath, trimmedIconPath);
    };
    
    const handleCancel = () => {
        setTempNormalPath(normalPath);
        setTempIconPath(iconPath);
        setDialogOpen(false);
    };
    
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1" />
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
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-150">
                                <DialogHeader>
                                    <DialogTitle>Path Settings</DialogTitle>
                                    <DialogDescription>
                                        Set the paths to your Football Manager face folders
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="normal-path">Normal Faces Path</Label>
                                        <Input
                                            id="normal-path"
                                            placeholder="C:/Users/.../Football Manager 26/graphics/faces/normal"
                                            value={tempNormalPath}
                                            onChange={(e) => setTempNormalPath(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="icon-path">Icon Faces Path</Label>
                                        <Input
                                            id="icon-path"
                                            placeholder="C:/Users/.../Football Manager 26/graphics/faces/icons"
                                            value={tempIconPath}
                                            onChange={(e) => setTempIconPath(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={savePaths}
                                        disabled={!tempNormalPath.trim() || !tempIconPath.trim()}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
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
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
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
                    <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
