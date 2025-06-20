import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const AccessDenied = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("accss.denied")}</h1>
        <p className="text-muted-foreground mb-4">{t("error.access")}</p>
        <Link to="/login">
          <Button>{t("auth.login")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
