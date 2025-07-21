import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  FileText,
  Settings,
  BarChart3,
  Shield,
  UserCheck,
  Home,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import AccessDenied from "@/components/AccessDenied";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { t, isAuthenticated, hasToken, user, logout } = useLanguage();
  const navigate = useNavigate();

  if (!isAuthenticated || !hasToken() || user?.type !== "admin") {
    return <AccessDenied />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminStats = [
    {
      title: t("admin.totalUsers") || "Total Users",
      value: "1,234",
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: t("admin.totalOffices") || "Total Offices",
      value: "89",
      icon: Building,
      color: "bg-green-500",
      change: "+5%",
      changeType: "positive",
    },
    {
      title: t("admin.totalProperties") || "Total Properties",
      value: "2,456",
      icon: Home,
      color: "bg-purple-500",
      change: "+18%",
      changeType: "positive",
    },
    {
      title: t("admin.pendingApprovals") || "Pending Approvals",
      value: "23",
      icon: FileText,
      color: "bg-orange-500",
      change: "-3%",
      changeType: "negative",
    },
    {
      title: t("admin.activeSubscriptions") || "Active Subscriptions",
      value: "156",
      icon: CreditCard,
      color: "bg-indigo-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: t("admin.monthlyRevenue") || "Monthly Revenue",
      value: "$12,450",
      icon: TrendingUp,
      color: "bg-emerald-500",
      change: "+15%",
      changeType: "positive",
    },
  ];

  const quickActions = [
    {
      title: t("admin.manageUsers") || "Manage Users",
      description:
        t("admin.manageUsersDesc") || "View and manage user accounts",
      icon: Users,
      color: "bg-blue-500",
      action: () => navigate("/admin/users"),
    },
    {
      title: t("admin.manageOffices") || "Manage Offices",
      description:
        t("admin.manageOfficesDesc") || "Approve and manage office accounts",
      icon: Building,
      color: "bg-green-500",
      action: () => navigate("/admin/offices"),
    },
    {
      title: t("admin.manageProperties") || "Manage Properties",
      description:
        t("admin.managePropertiesDesc") ||
        "Review and moderate property listings",
      icon: Home,
      color: "bg-purple-500",
      action: () => navigate("/admin/properties"),
    },
    {
      title: t("admin.subscriptions") || "Subscriptions",
      description:
        t("admin.subscriptionsDesc") ||
        "Manage subscription plans and requests",
      icon: CreditCard,
      color: "bg-indigo-500",
      action: () => navigate("/admin/subscriptions"),
    },
    {
      title: t("admin.analytics") || "Analytics",
      description:
        t("admin.analyticsDesc") || "View detailed analytics and reports",
      icon: BarChart3,
      color: "bg-emerald-500",
      action: () => navigate("/admin/analytics"),
    },
    {
      title: t("admin.settings") || "System Settings",
      description:
        t("admin.settingsDesc") || "Configure system settings and preferences",
      icon: Settings,
      color: "bg-gray-500",
      action: () => navigate("/admin/settings"),
    },
  ];

  const recentActivities = [
    {
      type: "user_registered",
      message: t("admin.userRegistered") || "New user registered",
      user: "John Doe",
      time: "2 minutes ago",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      type: "office_approved",
      message: t("admin.officeApproved") || "Office account approved",
      user: "Real Estate Pro",
      time: "15 minutes ago",
      icon: Building,
      color: "text-blue-600",
    },
    {
      type: "property_submitted",
      message:
        t("admin.propertySubmitted") || "New property submitted for review",
      user: "Property Plus",
      time: "1 hour ago",
      icon: Home,
      color: "text-purple-600",
    },
    {
      type: "subscription_purchased",
      message: t("admin.subscriptionPurchased") || "Subscription purchased",
      user: "Elite Homes",
      time: "2 hours ago",
      icon: CreditCard,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {t("admin.panel") || "Admin Panel"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("admin.welcome") || "Welcome back"}, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                <Activity className="h-3 w-3 mr-1" />
                {t("admin.online") || "Online"}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                {t("nav.logout") || "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {t("admin.fromLastMonth") || "from last month"}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t("admin.quickActions") || "Quick Actions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={action.action}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-primary"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t("admin.recentActivity") || "Recent Activity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {activity.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.user}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
