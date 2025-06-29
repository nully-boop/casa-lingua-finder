import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const DangerZone = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
    authService.logout();
    navigate("/");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible actions for your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-destructive">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
