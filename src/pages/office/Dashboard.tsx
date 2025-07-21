import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { useMemo, useState } from "react";
import IProperty from "@/interfaces/IProperty";
import { useQuery } from "@tanstack/react-query";
import { normalizeProperty } from "@/func/properties";
import PropertyOfficeList from "@/components/office/PropertyOfficeList";
import HeaderOffice from "@/components/office/HeaderOffice";
import { useToast } from "@/hooks/use-toast";
import { office } from "@/services/api";

// Mock data for dashboard
const dashboardStats = {
  totalInquiries: 23,
  activeListings: 10,
};

const Dashboard = () => {
  const { t, language, user, isAuthenticated, hasToken } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(
    null
  );

  const { data: apiProperties, isLoading } = useQuery({
    queryKey: ["office-properties"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      return await office.getProperties();
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  const properties = useMemo(() => {
    if (!apiProperties?.data) return [];
    return apiProperties.data.data.map(normalizeProperty);
  }, [apiProperties]);

  const { data: count, isLoading: isCountLoading } = useQuery({
    queryKey: ["property-count"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      try {
        const response = await office.getPropertyCount();
        return {
          count: response.data.count,
          activeCount: response.data.activeCount,
        };
      } catch (error) {
        toast({
          title: t("dashboard.error"),
          description: t("dashboard.errorPropertyCount"),
          variant: "destructive",
        });
        return { count: 0, activeCount: 0 };
      }
    },
    enabled: isAuthenticated && hasToken(),
    retry: false,
  });

  const { data: views, isLoading: isViewsLoading } = useQuery({
    queryKey: ["office-views"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      try {
        const response = await office.getOfficeViews();
        return {
          views: response.data.views,
        };
      } catch (error) {
        toast({
          title: t("dashboard.error"),
          description: t("dashboard.errorViews"),
          variant: "destructive",
        });
        return { views: 0 };
      }
    },
    enabled: isAuthenticated && hasToken(),
    retry: false,
  });

  // Get active subscriptions
  const { data: subscriptions } = useQuery({
    queryKey: ["active-subscriptions"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      try {
        const response = await office.getActiveSubscriptions();
        return response.data?.data || [];
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
    },
    enabled: isAuthenticated && hasToken() && user?.type === "office",
    retry: false,
  });

  const {
    data: officeData,
    isLoading: isLoadingOffice,
    isError: isProfileQueryError,
    error: profileQueryError,
  } = useQuery({
    queryKey: ["office-data"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      try {
        const response = await office.getOffice();
        return response.office;
      } catch (error) {
        console.error("Error fetching office data:", error);
        return null;
      }
    },
    enabled: isAuthenticated && hasToken() && user?.type === "office",
    retry: false,
  });

  // Check subscription status
  const hasActiveSubscription =
    subscriptions && Array.isArray(subscriptions) && subscriptions.length > 0;
  const freeAdsCount = officeData?.free_ads || 0;
  const needsSubscription = !hasActiveSubscription && freeAdsCount <= 2;

  // Check if subscription expires soon (within 3 days)
  const subscriptionExpiringSoon = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return null;

    const activeSubscription = subscriptions[0];
    if (!activeSubscription || !activeSubscription.expires_at) return null;

    try {
      const expiryDate = new Date(activeSubscription.expires_at);
      const today = new Date();
      const threeDaysFromNow = new Date(
        today.getTime() + 3 * 24 * 60 * 60 * 1000
      );

      if (expiryDate <= threeDaysFromNow && expiryDate > today) {
        return activeSubscription;
      }
    } catch (error) {
      console.error("Error parsing expiry date:", error);
    }

    return null;
  }, [subscriptions]);

  // Handle edit property
  const handleEditProperty = (property: IProperty) => {
    toast({
      title: "Edit Property",
      description: `Editing property: ${property.title}`,
    });

    // Navigate to edit page (you'll need to create this route)
    navigate(`/properties/${property.id}/edit`);
  };

  // Handle delete property
  const handleDeleteProperty = async (property: IProperty) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingPropertyId(property.id);

    try {
      // TODO: Replace with actual API call
      // await deleteProperty(property.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Property Deleted",
        description: `${property.title} has been deleted successfully.`,
      });

      // TODO: Refresh the properties list or remove from local state
      // You might want to invalidate the query or refetch
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingPropertyId(null);
    }
  };

  if (!isAuthenticated || !hasToken() || user?.type !== "office") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderOffice
        profileData={officeData}
        isError={isProfileQueryError}
        error={profileQueryError}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("dashboard.welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {t("dashboard.manageProperties")}
          </p>
        </div>

        {/* Subscription Alerts */}
        {isLoadingOffice ? (
          <Skeleton className="h-8 w-16 mb-2" />
        ) : (
          needsSubscription && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {t("dashboard.subscriptionRequired")}
                  </p>

                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {t("dashboard.freeAdsRemaining")}: {freeAdsCount}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-600 dark:hover:bg-yellow-900/20"
                  onClick={() => navigate("/subscriptions")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("dashboard.subscriptions")}
                </Button>
              </AlertDescription>
            </Alert>
          )
        )}

        {subscriptionExpiringSoon && (
          <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  {t("dashboard.subscriptionExpiresSoon")}
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  {t("dashboard.expiresOn")}: {
                    subscriptionExpiringSoon?.expires_at
                      ? new Date(subscriptionExpiringSoon.expires_at).toLocaleDateString()
                      : t("dashboard.notSpecified")
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 border-orange-300 text-orange-800 hover:bg-orange-100 dark:text-orange-200 dark:border-orange-600 dark:hover:bg-orange-900/20"
                onClick={() => navigate("/subscriptions")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {language === "ar" ? "تجديد الاشتراك" : "Renew Subscription"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.properties")}
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isCountLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{count?.count || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {count?.activeCount || 0}{" "}
                    {language === "ar" ? "نشط" : "active"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.views")}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isViewsLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{views?.views || 0}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +12% {language === "ar" ? "من الشهر الماضي" : "from last month"}
                  </p> */}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.inquiries")}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalInquiries}
              </div>
              <p className="text-xs text-muted-foreground">
                +3 {language === "ar" ? "هذا الأسبوع" : "this week"}
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ar" ? "معدل الاستجابة" : "Response Rate"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "ممتاز" : "Excellent"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/create-property">
              <Button className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>{t("dashboard.addProperty")}</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Eye className="h-4 w-4" />
              <span>
                {language === "ar" ? "عرض الإحصائيات" : "View Analytics"}
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{language === "ar" ? "الرسائل" : "Messages"}</span>
            </Button>
          </div>
        </div>

        {/* Recent Properties */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {t("dashboard.recentProperties")}
            </h2>
          </div>

          <div className="mb-6">
            <div className="flex gap-8">
              <div className="flex-1">
                <PropertyOfficeList
                  properties={properties}
                  isLoading={isLoading}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                  deletingPropertyId={deletingPropertyId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
