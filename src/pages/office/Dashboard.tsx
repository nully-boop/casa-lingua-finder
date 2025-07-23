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
  AlertTriangle,
  CreditCard,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderOffice from "@/components/office/HeaderOffice";
import { useToast } from "@/hooks/use-toast";
import { office } from "@/services/api";
import IOffice from "@/interfaces/IOffice";

// Mock data for dashboard
const dashboardStats = {
  totalInquiries: 23,
  activeListings: 10,
};

// Chart data
const propertyViewsData = [
  { month: "Jan", views: 1200, inquiries: 45 },
  { month: "Feb", views: 1900, inquiries: 67 },
  { month: "Mar", views: 1600, inquiries: 52 },
  { month: "Apr", views: 2100, inquiries: 78 },
  { month: "May", views: 2400, inquiries: 89 },
  { month: "Jun", views: 2800, inquiries: 95 },
];

const propertyTypeData = [
  { name: "Apartments", value: 45, color: "#3B82F6" },
  { name: "Houses", value: 30, color: "#10B981" },
  { name: "Commercial", value: 15, color: "#F59E0B" },
  { name: "Land", value: 10, color: "#EF4444" },
];

const propertyStatusData = [
  { status: "Active", count: 25, color: "#10B981" },
  { status: "Pending", count: 8, color: "#F59E0B" },
  { status: "Sold", count: 12, color: "#3B82F6" },
  { status: "Expired", count: 3, color: "#EF4444" },
];

const revenueData = [
  { month: "Jan", revenue: 45000, commission: 12000 },
  { month: "Feb", revenue: 52000, commission: 14500 },
  { month: "Mar", revenue: 48000, commission: 13200 },
  { month: "Apr", revenue: 61000, commission: 16800 },
  { month: "May", revenue: 58000, commission: 15900 },
  { month: "Jun", revenue: 67000, commission: 18200 },
];

const inquirySourceData = [
  { name: "Website", value: 40, color: "#3B82F6" },
  { name: "Social Media", value: 25, color: "#10B981" },
  { name: "Referrals", value: 20, color: "#F59E0B" },
  { name: "Walk-ins", value: 15, color: "#8B5CF6" },
];

const Dashboard = () => {
  const { t, language, user, isAuthenticated, hasToken } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        alert(error);
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
        alert(error);
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
                  {t("dashboard.expiresOn")}:{" "}
                  {subscriptionExpiringSoon?.expires_at
                    ? new Date(
                        subscriptionExpiringSoon.expires_at
                      ).toLocaleDateString()
                    : t("dashboard.notSpecified")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 border-orange-300 text-orange-800 hover:bg-orange-100 dark:text-orange-200 dark:border-orange-600 dark:hover:bg-orange-900/20"
                onClick={() => navigate("/subscriptions")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {t("dashboard.renewSubscription")}
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
                    {count?.activeCount || 0} {t("dashboard.active")}
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
                +3 {t("dashboard.thisWeek")}
              </p>
            </CardContent>
          </Card>

          <Link to="/followers" className="block">
            <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("office.followers")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(user as IOffice).followers_count}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.clickToView")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {t("dashboard.quickActions")}
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
              <span>{t("dashboard.viewAnalytics")}</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t("dashboard.messages")}</span>
            </Button>

            <Link to="/requests">
              <Button
                variant="outline"
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <FileText className="h-4 w-4" />
                <span>{t("requests.title") || "Property Requests"}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {t("dashboard.analytics")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Property Views & Inquiries Trend */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  {t("dashboard.viewsTrend")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={propertyViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name={t("dashboard.viewsLabel")}
                    />
                    <Area
                      type="monotone"
                      dataKey="inquiries"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name={t("dashboard.inquiriesLabel")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Property Type Distribution */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  {t("dashboard.propertyTypes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  {t("dashboard.revenueTrend")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      name={t("dashboard.revenue")}
                    />
                    <Line
                      type="monotone"
                      dataKey="commission"
                      stroke="#EC4899"
                      strokeWidth={3}
                      name={t("dashboard.commission")}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Property Status Overview */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  {t("dashboard.propertyStatus")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={propertyStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      {propertyStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inquiry Sources */}
            <Card className="animate-fade-in lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  {t("dashboard.inquirySources")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={inquirySourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {inquirySourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="animate-fade-in lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  {t("dashboard.kpiMetrics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-muted-foreground">
                      {t("dashboard.responseRate")}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">4.8</div>
                    <div className="text-sm text-muted-foreground">
                      {language === "ar" ? "تقييم العملاء" : "Client Rating"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-muted-foreground">
                      {language === "ar"
                        ? "متوسط أيام البيع"
                        : "Avg. Days to Sell"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      78%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === "ar" ? "معدل التحويل" : "Conversion Rate"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
