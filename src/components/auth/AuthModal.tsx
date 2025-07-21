import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const renderIntroStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Shield className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <DialogTitle className="text-2xl font-bold">
          {t("auth.required") || "Authentication Required"}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          {t("auth.loginToAccess") ||
            "Please login or register to access this feature"}
        </DialogDescription>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => navigate("/register")}
          className="flex-1"
          size="lg"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {t("auth.getStarted") || "Get Started"}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/login")}
          className="flex-1"
          size="lg"
        >
          <LogIn className="h-4 w-4 mr-2" />
          {t("auth.login") || "Login"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="relative">
          <DialogHeader className="sr-only">
            <DialogTitle>Authentication Modal</DialogTitle>
            <DialogDescription>Login or register to continue</DialogDescription>
          </DialogHeader>
          <div>{renderIntroStep()} </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
