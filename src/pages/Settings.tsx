import Header from "@/components/Header";
import ProfileInfo from "@/components/settings/ProfileInfo";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import DangerZone from "@/components/settings/DangerZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {t("nav.settings")}
            </h1>
            <p className="text-muted-foreground">{t("stt.manageTitle")} </p>
          </div>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">{t("nav.profile")}</TabsTrigger>
              <TabsTrigger value="appearance">
                {t("stt.شppearance")}
              </TabsTrigger>
              <TabsTrigger value="account">{t("stt.dangerZone")}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileInfo />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="account">
              <DangerZone />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
