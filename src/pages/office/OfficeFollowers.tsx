import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { office } from "@/services/api";
import { IFollower } from "@/interfaces/IFollower";
import {
  Users,
  ArrowLeft,
  Search,
  Phone,
  Calendar,
  User,
  Loader2,
  UserCheck,
} from "lucide-react";
import AccessDenied from "@/components/AccessDenied";

const OfficeFollowers: React.FC = () => {
  const [followers, setFollowers] = useState<IFollower[]>([]);
  const [filteredFollowers, setFilteredFollowers] = useState<IFollower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t, language, user, isAuthenticated } = useLanguage();
  const navigate = useNavigate();

  // Fetch followers
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const response = await office.getOfficeFollowers();
        setFollowers(response.data.followers);
        setFilteredFollowers(response.data.followers);
      } catch (error) {
        console.error("Error fetching followers:", error);
        toast({
          title: t("office.followersError") || "Error",
          description:
            t("office.followersErrorDesc") || "Failed to fetch followers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && user.type === "office") {
      fetchFollowers();
    }
  }, [isAuthenticated, user, toast, t]);

  // Filter followers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFollowers(followers);
    } else {
      const filtered = followers.filter(
        (follower) =>
          follower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          follower.phone.includes(searchTerm)
      );
      setFilteredFollowers(filtered);
    }
  }, [searchTerm, followers]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated || !user || user.type !== "office") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.back") || "Back"}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("office.followers") || "Followers"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("office.followersDesc") || "Manage your office followers"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("office.totalFollowers") || "Total Followers"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {followers.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("office.filteredResults") || "Filtered Results"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {filteredFollowers.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("office.latestFollower") || "Latest Follower"}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {followers.length > 0
                        ? formatDate(followers[0].created_at)
                        : t("common.none") || "None"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                t("office.searchFollowers") ||
                "Search followers by name or phone..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t("common.loading") || "Loading..."}</span>
            </div>
          </div>
        ) : filteredFollowers.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  {searchTerm ? (
                    <Search className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Users className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm
                    ? t("office.noSearchResults") || "No followers found"
                    : t("office.noFollowers") || "No followers yet"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? t("office.noSearchResultsDesc") ||
                      "Try adjusting your search terms"
                    : t("office.noFollowersDesc") ||
                      "Users will appear here when they follow your office"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="mt-4"
                  >
                    {t("common.clearSearch") || "Clear Search"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFollowers.map((follower) => (
              <Card
                key={follower.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {follower.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {follower.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          {t("common.user") || "User"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="font-mono">{follower.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t("office.followedOn") || "Followed on"}{" "}
                      {formatDate(follower.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficeFollowers;
