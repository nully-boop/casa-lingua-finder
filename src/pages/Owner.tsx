
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { propertiesAPI, dashboardAPI } from "@/services/api";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building, Eye, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Owner = () => {
  const { t } = useLanguage();

  // Fetch owner's properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['myProperties'],
    queryFn: propertiesAPI.getMyProperties,
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardAPI.getStats,
  });

  const propertyList = properties?.data || [];
  const dashboardStats = stats?.data || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("owner.dashboard") || "Owner Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {t("owner.subtitle") || "Manage your properties and track performance"}
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/add-property">
              <Plus className="h-4 w-4 mr-2" />
              {t("owner.addProperty") || "Add Property"}
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("owner.totalProperties") || "Total Properties"}
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : dashboardStats.totalProperties || propertyList.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("owner.activeListings") || "Active Listings"}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : dashboardStats.activeListings || propertyList.filter(p => p.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("owner.totalValue") || "Total Value"}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `$${dashboardStats.totalValue?.toLocaleString() || "0"}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("owner.monthlyViews") || "Monthly Views"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : dashboardStats.monthlyViews?.toLocaleString() || "0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("owner.myProperties") || "My Properties"}</CardTitle>
            <CardDescription>
              {t("owner.propertiesDescription") || "Manage and monitor your property listings"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">
                  {t("common.loading") || "Loading..."}
                </div>
              </div>
            ) : propertyList.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("owner.noProperties") || "No Properties Yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("owner.noPropertiesDescription") || "Start by adding your first property listing"}
                </p>
                <Button asChild>
                  <Link to="/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("owner.addFirstProperty") || "Add Your First Property"}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {propertyList.map((property: any) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{property.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {property.address} • {property.type}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                            {property.status || 'active'}
                          </Badge>
                          <span className="text-sm font-medium">
                            {property.price} {property.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/property/${property.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          {t("common.view") || "View"}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("common.edit") || "Edit"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Owner;
