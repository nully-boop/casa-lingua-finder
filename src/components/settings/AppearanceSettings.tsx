
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor } from "lucide-react";

interface AppearanceSettingsProps {
  theme: string;
  isDark: boolean;
  handleThemeChange: (newTheme: string) => void;
  getThemeIcon: () => React.ReactNode;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  theme, isDark, handleThemeChange, getThemeIcon,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {getThemeIcon()}
        Appearance
      </CardTitle>
      <CardDescription>
        Customize how the application looks and feels
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <Label>Theme</Label>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Light
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Dark
              </div>
            </SelectItem>
            <SelectItem value="system">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                System
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose your preferred theme or use system setting
        </p>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Current Theme Status</Label>
          <p className="text-sm text-muted-foreground">
            Currently using {isDark ? "dark" : "light"} mode
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDark ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AppearanceSettings;
