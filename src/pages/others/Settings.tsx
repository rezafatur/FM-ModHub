import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [normalPath, setNormalPath] = useState("");
  const [iconPath, setIconPath] = useState("");
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    window.electronAPI.getPaths().then(({ normalPath, iconPath }) => {
      setNormalPath(normalPath ?? "");
      setIconPath(iconPath ?? "");
    });
  }, []);
  
  const savePaths = async () => {
    if (!normalPath.trim() || !iconPath.trim()) return;
    
    setSaving(true);
    
    await window.electronAPI.savePaths(
      normalPath.trim(),
      iconPath.trim()
    );
    
    setSaving(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Face Folder Configuration</CardTitle>
        <CardDescription>
          Configure the directories where Football Manager face images are stored.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="space-y-2.5">
          <Label>Normal Faces Path</Label>
          <Input
            placeholder="C:/Users/.../graphics/faces/normal"
            value={normalPath}
            onChange={(e) => setNormalPath(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Used for standard player face images.
          </p>
        </div>
        
        <div className="space-y-2.5">
          <Label>Icon Faces Path</Label>
          <Input
            placeholder="C:/Users/.../graphics/faces/icons"
            value={iconPath}
            onChange={(e) => setIconPath(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Used for small icon-sized faces.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={savePaths}
            disabled={saving || !normalPath.trim() || !iconPath.trim()}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
