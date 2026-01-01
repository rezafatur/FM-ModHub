import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortalOverview() {
    const [faceCounts, setFaceCounts] = useState<{
        normal: number;
        icon: number;
        normalLastUpdate?: string | null;
        iconLastUpdate?: string | null;
    } | null>(null);
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
        if (!nPath || !iPath) return;
        
        const counts = await window.electronAPI.getFaceCounts(nPath, iPath);
        setFaceCounts(counts);
    };
    
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };
    
    return (
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
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">
                            {faceCounts ? formatDate(faceCounts.normalLastUpdate) : "-"}
                        </p>
                    </div>
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
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">
                            {faceCounts ? formatDate(faceCounts.iconLastUpdate) : "-"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
