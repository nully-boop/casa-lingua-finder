
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleLogin = () => {
    onOpenChange(false);
    navigate("/login");
  };

  const handleRegister = () => {
    onOpenChange(false);
    navigate("/register");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "ar" ? "تسجيل الدخول مطلوب" : "Login Required"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "ar"
              ? "يجب عليك تسجيل الدخول لإضافة العقارات إلى المفضلة"
              : "You need to be logged in to add properties to favorites"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === "ar" ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin}>
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </AlertDialogAction>
          <AlertDialogAction onClick={handleRegister}>
            {language === "ar" ? "التسجيل" : "Register"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AuthModal;
