import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import HeaderOffice from "@/components/office/HeaderOffice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileAPI, office } from "@/services/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccessDenied from "@/components/AccessDenied";

const Profile = () => {
  const { t, isAuthenticated, hasToken, user } = useLanguage();
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading,
    isError: isProfileQueryError,
    error: profileQueryError,
  } = useQuery({
    queryKey: ["profile", user?.type],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }

      if (user?.type === "office") {
        const response = await office.getOffice();
        return response.office;
      } else {
        const response = await profileAPI.getProfile();
        return response.user;
      }
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  if (!isAuthenticated || !hasToken()) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {user?.type === "office" ? (
          <HeaderOffice
            profileData={profileData}
            isError={isProfileQueryError}
            error={profileQueryError}
          />
        ) : (
          <Header />
        )}
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.loading.profile")}</p>
        </div>
      </div>
    );
  }

  if (profileQueryError) {
    const errorMessage =
      profileQueryError instanceof Error
        ? profileQueryError.message
        : "Unknown error";
    return (
      <div className="min-h-screen bg-background">
        {user?.type === "office" ? (
          <HeaderOffice
            profileData={profileData}
            isError={isProfileQueryError}
            error={profileQueryError}
          />
        ) : (
          <Header />
        )}
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("err.error")}</h1>
          <p className="text-muted-foreground mb-4">
            {t("error.loadProfile")}: {errorMessage}
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["profile", user?.type],
              })
            }
          >
            {t("rt.retry")}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {user?.type === "office" ? (
        <HeaderOffice
          profileData={profileData}
          isError={isProfileQueryError}
          error={profileQueryError}
        />
      ) : (
        <Header />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <ProfileHeader user={profileData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
