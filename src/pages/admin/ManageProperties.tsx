import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  MapPin,
  Calendar,
  DollarSign,
  Check,
  X,
  ArrowLeft,
  Clock,
  Bed,
  Bath,
  Square,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { admin } from "@/services/api";
import { useAISuggestions } from "@/hooks/useAISuggestions";
import { AISuggestionBadge } from "@/components/admin/AISuggestionBadge";
import { AISuggestionDetails } from "@/components/admin/AISuggestionDetails";
import IProperty from "@/interfaces/IProperty";

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
}

interface PendingRequest {
  id: number;
  office_id: number;
  requestable_type: string;
  requestable_id: number;
  status: string;
  target_id: number | null;
  created_at: string;
  updated_at: string;
  requestable: IProperty;
}

interface ApiResponse {
  current_page: number;
  data: PendingRequest[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const ManageProperties = () => {
  const { t, isAuthenticated, hasToken, user } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingProperties, setPendingProperties] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const { analyzeProperty, getSuggestion } = useAISuggestions();

  const handleApiError = useCallback((error: unknown, defaultMessage: string) => {
    console.error("API Error:", error);

    let errorMessage = defaultMessage;

    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        errorMessage = t("admin.authError") || "Authentication failed. Please login again.";
      } else if (apiError.response?.status === 403) {
        errorMessage = t("admin.permissionError") || "You don't have permission to perform this action.";
      } else if (apiError.response?.status === 404) {
        errorMessage = t("admin.notFoundError") || "Request not found.";
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
    }

    return errorMessage;
  }, [t]);



  const fetchPendingProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await admin.getPendingRequests();
      const data: ApiResponse = response.data;

      // Filter only property requests
      const propertyRequests = data.data.filter(
        (request) => request.requestable_type === "App\\Models\\Property"
      );

      setPendingProperties(propertyRequests);

      // Trigger AI analysis for each property
      propertyRequests.forEach((request) => {
        analyzeProperty(request.requestable, request.id);
      });
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.fetchError") || "Failed to fetch pending properties");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t, toast, handleApiError, analyzeProperty]);

  useEffect(() => {
    fetchPendingProperties();
  }, [fetchPendingProperties]);

  // Check if user is admin
  if (!isAuthenticated || !hasToken() || user?.type !== "admin") {
    return <AccessDenied />;
  }

  const handleApprove = async (requestId: number) => {
    try {
      setActionLoading(requestId);
      await admin.approveProperty(requestId);

      toast({
        title: t("common.success") || "Success",
        description: t("admin.propertyApproved") || "Property approved successfully",
      });

      // Refresh the list
      fetchPendingProperties();
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.approveError") || "Failed to approve property");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      setActionLoading(requestId);
      await admin.rejectProperty(requestId);

      toast({
        title: t("common.success") || "Success",
        description: t("admin.propertyRejected") || "Property rejected successfully",
      });

      // Refresh the list
      fetchPendingProperties();
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.rejectError") || "Failed to reject property");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleCardExpansion = (requestId: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ${currency}`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K ${currency}`;
    }
    return `${price.toLocaleString()} ${currency}`;
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "office":
        return Building;
      default:
        return Home;
    }
  };

  const getAdTypeBadge = (adType: string) => {
    const isRent = adType === "rent";
    return (
      <Badge variant={isRent ? "secondary" : "default"} className={isRent ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
        {isRent ? t("property.rent") || "Rent" : t("property.sale") || "Sale"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Home className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {t("admin.manageProperties") || "Manage Properties"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("admin.pendingPropertyRequests") || "Review and approve pending property requests"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Clock className="h-3 w-3 mr-1" />
              {pendingProperties.length} {t("admin.pending") || "Pending"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pendingProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("admin.noPendingProperties") || "No Pending Properties"}
              </h3>
              <p className="text-muted-foreground">
                {t("admin.noPendingPropertiesDesc") || "All property requests have been processed"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingProperties.map((request) => {
              const PropertyIcon = getPropertyTypeIcon(request.requestable.type);
              const isRent = request.requestable.ad_type === "rent";
              const isExpanded = expandedCards.has(request.id);
              return (
                <Card
                  key={request.id}
                  className={`group transition-all duration-500 ease-in-out border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/30 to-transparent dark:from-blue-950/20 ${
                    isExpanded
                      ? 'shadow-2xl scale-[1.02] border-blue-500 bg-gradient-to-r from-blue-100/50 to-blue-50/30 dark:from-blue-900/40 dark:to-blue-950/30'
                      : 'hover:shadow-lg hover:scale-[1.01] hover:border-blue-450'
                  }`}
                >
                  {/* Collapsed Header - Always Visible */}
                  <CardHeader className={`pb-3 transition-all duration-300 ${isExpanded ? 'pb-4 bg-blue-50/20 dark:bg-blue-950/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg transition-all duration-300 ${
                          isExpanded ? 'scale-110 bg-blue-200 dark:bg-blue-800/70 shadow-lg' : 'group-hover:scale-105'
                        }`}>
                          <PropertyIcon className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-300 ${
                            isExpanded ? 'text-blue-700 dark:text-blue-300' : ''
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <CardTitle className={`text-lg font-bold text-gray-900 dark:text-gray-100 truncate transition-all duration-300 ${
                              isExpanded ? 'text-blue-700 dark:text-blue-300 text-xl' : 'group-hover:text-blue-600'
                            }`}>
                              {request.requestable.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                              {getAdTypeBadge(request.requestable.ad_type)}
                              <Badge
                                variant="outline"
                                className={`bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm transition-all duration-300 ${
                                  isExpanded ? 'bg-yellow-100 border-yellow-400 shadow-md' : ''
                                }`}
                              >
                                <Clock className={`h-3 w-3 mr-1 transition-all duration-300 ${isExpanded ? 'text-yellow-700' : ''}`} />
                                {t("admin.pending") || "Pending"}
                              </Badge>
                              <AISuggestionBadge suggestion={getSuggestion(request.id)} />
                            </div>
                          </div>
                          <div className={`flex items-center gap-4 text-sm text-muted-foreground flex-wrap transition-all duration-300 ${
                            isExpanded ? 'text-blue-600/80 dark:text-blue-400/80' : ''
                          }`}>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">ID:</span>
                              <code className={`bg-muted px-1.5 py-0.5 rounded text-xs transition-all duration-300 ${
                                isExpanded ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : ''
                              }`}>{request.requestable.ad_number}</code>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-green-500' : ''}`} />
                              <span className={`font-medium text-green-600 transition-all duration-300 ${
                                isExpanded ? 'text-green-700 font-bold' : ''
                              }`}>
                                {formatPrice(request.requestable.price, request.requestable.currency)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-blue-500' : ''}`} />
                              <span>{request.requestable.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-blue-500' : ''}`} />
                              <span>{formatDate(request.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Bed className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-orange-500' : ''}`} />
                                <span>{request.requestable.rooms}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bath className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-cyan-500' : ''}`} />
                                <span>{request.requestable.bathrooms}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Square className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-emerald-500' : ''}`} />
                                <span>{request.requestable.area}m²</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Always Visible */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading === request.id}
                          size="sm"
                          className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                            isExpanded ? 'shadow-lg border-red-300 bg-red-50/50' : ''
                          }`}
                        >
                          <X className={`h-4 w-4 mr-1 transition-all duration-300 ${actionLoading === request.id ? 'animate-pulse' : ''}`} />
                          {actionLoading === request.id ? (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="hidden sm:inline">{t("common.processing") || "Processing..."}</span>
                            </div>
                          ) : (
                            <span className="hidden sm:inline">{t("admin.reject") || "Reject"}</span>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleApprove(request.id)}
                          disabled={actionLoading === request.id}
                          size="sm"
                          className={`bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            isExpanded ? 'shadow-xl bg-green-700 scale-105' : ''
                          }`}
                        >
                          <Check className={`h-4 w-4 mr-1 transition-all duration-300 ${actionLoading === request.id ? 'animate-pulse' : ''}`} />
                          {actionLoading === request.id ? (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="hidden sm:inline">{t("common.processing") || "Processing..."}</span>
                            </div>
                          ) : (
                            <span className="hidden sm:inline">{t("admin.approve") || "Approve"}</span>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCardExpansion(request.id)}
                          className={`p-2 transition-all duration-300 hover:scale-110 hover:bg-blue-100 dark:hover:bg-blue-900/50 ${
                            isExpanded ? 'bg-blue-100 dark:bg-blue-900/50 scale-110 shadow-md' : 'hover:shadow-sm'
                          }`}
                        >
                          <div className="relative">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 transition-all duration-500 ease-in-out transform rotate-0 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 transition-all duration-500 ease-in-out transform rotate-0 hover:text-blue-600 dark:hover:text-blue-400" />
                            )}
                            {isExpanded && (
                              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                            )}
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <CardContent className="space-y-6 pt-0 border-t border-blue-200/50 dark:border-blue-800/50 animate-in slide-in-from-top-2 fade-in duration-500">
                      {/* Property Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-700 delay-100">
                          <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            {t("admin.propertyDetails") || "Property Details"}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 rounded-lg hover:bg-gradient-to-r hover:from-green-100/70 hover:to-green-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-green-200 dark:hover:bg-green-800/70">
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 transition-all duration-300 hover:text-green-700 dark:hover:text-green-300" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                  {formatPrice(request.requestable.price, request.requestable.currency)}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {isRent ? t("property.monthlyRent") || "Monthly Rent" : t("property.salePrice") || "Sale Price"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg hover:bg-gradient-to-r hover:from-blue-100/70 hover:to-blue-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-blue-200 dark:hover:bg-blue-800/70">
                                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{request.requestable.location}</span>
                                <p className="text-xs text-muted-foreground">{t("admin.location") || "Location"}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg hover:bg-gradient-to-r hover:from-purple-100/70 hover:to-purple-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-purple-200 dark:hover:bg-purple-800/70">
                                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400 transition-all duration-300 hover:text-purple-700 dark:hover:text-purple-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{formatDate(request.created_at)}</span>
                                <p className="text-xs text-muted-foreground">{t("admin.submittedOn") || "Submitted On"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-700 delay-200">
                          <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            {t("admin.specifications") || "Specifications"}
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:shadow-lg hover:scale-[1.05] transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-700">
                              <div className="flex items-center gap-2 mb-1">
                                <Bed className="h-4 w-4 text-orange-600 dark:text-orange-400 transition-all duration-300 hover:scale-110" />
                                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                  {t("property.rooms") || "Rooms"}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-orange-800 dark:text-orange-200">
                                {request.requestable.rooms}
                              </span>
                            </div>

                            <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 hover:shadow-lg hover:scale-[1.05] transition-all duration-300 hover:border-cyan-300 dark:hover:border-cyan-700">
                              <div className="flex items-center gap-2 mb-1">
                                <Bath className="h-4 w-4 text-cyan-600 dark:text-cyan-400 transition-all duration-300 hover:scale-110" />
                                <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                                  {t("property.bathrooms") || "Bathrooms"}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-cyan-800 dark:text-cyan-200">
                                {request.requestable.bathrooms}
                              </span>
                            </div>

                            <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 col-span-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700">
                              <div className="flex items-center gap-2 mb-1">
                                <Square className="h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-all duration-300 hover:scale-110" />
                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                  {t("property.area") || "Area"}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                                {request.requestable.area}m²
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-950/30 dark:to-slate-900/20 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="h-4 w-4 text-slate-600 dark:text-slate-400 transition-all duration-300 hover:scale-110" />
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {t("property.floorNumber") || "Floor"}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {request.requestable.floor_number}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Suggestion Section */}
                      <AISuggestionDetails
                        suggestion={getSuggestion(request.id)}
                        requestId={request.id}
                        currentPrice={request.requestable.price}
                        currency={request.requestable.currency}
                        formatPrice={formatPrice}
                      />

                      {/* Description Section */}
                      <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-400">
                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          {t("admin.description") || "Description"}
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {request.requestable.description}
                          </p>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center justify-center pt-4 border-t border-blue-200/50 dark:border-blue-800/50 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-500">
                        <div className="flex items-center gap-2 text-xs text-blue-600/80 dark:text-blue-400/80 bg-blue-50/50 dark:bg-blue-950/30 px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-300">
                          <div className="relative">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                          </div>
                          <span className="font-medium">{t("admin.awaitingReview") || "Awaiting Admin Review"}</span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProperties;
