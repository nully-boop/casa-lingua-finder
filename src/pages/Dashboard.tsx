import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { formatPriceSeller } from "@/func/properties";

// Mock data for dashboard
const dashboardStats = {
  totalProperties: 12,
  totalViews: 2847,
  totalInquiries: 23,
  activeListings: 10,
};

const recentProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    titleAr: "شقة عصرية في وسط المدينة",
    type: "apartment",
    price: 850000,
    currency: "AED",
    location: "Dubai Marina",
    locationAr: "مرسى دبي",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
    forSale: true,
    views: 245,
    inquiries: 5,
    status: "active",
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    titleAr: "فيلا فاخرة مع مسبح",
    type: "villa",
    price: 12000,
    currency: "AED",
    location: "Palm Jumeirah",
    locationAr: "نخلة جميرا",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop",
    forSale: false,
    views: 189,
    inquiries: 8,
    status: "active",
  },
  {
    id: 3,
    title: "Commercial Office Space",
    titleAr: "مساحة مكتبية تجارية",
    type: "office",
    price: 2500000,
    currency: "AED",
    location: "Business Bay",
    locationAr: "خليج الأعمال",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
    forSale: true,
    views: 156,
    inquiries: 3,
    status: "pending",
  },
];

const Dashboard = () => {
  const { t, language, user, isAuthenticated } = useLanguage();

  if (!isAuthenticated || user?.user_type !== "seller") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("dashboard.welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "إدارة عقاراتك ومراقبة الأداء"
              : "Manage your properties and monitor performance"}
          </p>
        </div>

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
              <div className="text-2xl font-bold">
                {dashboardStats.totalProperties}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.activeListings}{" "}
                {language === "ar" ? "نشط" : "active"}
              </p>
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
              <div className="text-2xl font-bold">
                {dashboardStats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% {language === "ar" ? "من الشهر الماضي" : "from last month"}
              </p>
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
            <Link to="/add-property">
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
            <Link to="/my-properties">
              <Button variant="outline" size="sm">
                {language === "ar" ? "عرض الكل" : "View All"}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden animate-fade-in"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={language === "ar" ? property.titleAr : property.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <Badge variant={property.forSale ? "default" : "secondary"}>
                      {property.forSale ? t("common.sale") : t("common.rent")}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                    <Badge
                      variant={
                        property.status === "active" ? "default" : "secondary"
                      }
                      className="bg-background text-foreground border border-border"
                    >
                      {property.status === "active"
                        ? language === "ar"
                          ? "نشط"
                          : "Active"
                        : language === "ar"
                        ? "معلق"
                        : "Pending"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">
                    {language === "ar" ? property.titleAr : property.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "ar"
                      ? property.locationAr
                      : property.location}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-primary">
                      {formatPriceSeller(
                        property.price,
                        property.currency,
                        property.forSale,
                        t
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Eye className="h-4 w-4" />
                      <span>{property.views}</span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <MessageSquare className="h-4 w-4" />
                      <span>{property.inquiries}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
