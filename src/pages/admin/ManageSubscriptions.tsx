import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Calendar,
  DollarSign,
  Check,
  X,
  ArrowLeft,
  Clock,
  CreditCard,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { admin } from "@/services/api";

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
}

interface Office {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  phone: string;
  type: string;
  status: string;
  document_path: string;
  free_ads: number;
  followers_count: number;
  views: number;
  created_at: string;
  updated_at: string;
}

interface PendingSubscription {
  id: number;
  office_id: number;
  subscription_type: string;
  price: string;
  starts_at: string | null;
  expires_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  office: Office;
}



const ManageSubscriptions = () => {
  const { t, isAuthenticated, hasToken, user } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingSubscriptions, setPendingSubscriptions] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

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

  const fetchPendingSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await admin.getPendingSubscriptions();

      console.log("Raw API response:", response);
      console.log("Response data:", response.data);

      // Handle both possible response formats
      let subscriptions: PendingSubscription[] = [];

      if (Array.isArray(response.data)) {
        // Direct array response (most likely format based on your example)
        subscriptions = response.data;
        console.log("Using direct array format");
      } else if (response.data && Array.isArray(response.data.data)) {
        // Wrapped in data property
        subscriptions = response.data.data;
        console.log("Using wrapped array format");
      } else if (response.data && response.data.data) {
        // Single object wrapped in data
        subscriptions = [response.data.data];
        console.log("Using single object format");
      } else {
        console.warn("Unexpected response format:", response.data);
      }

      console.log("Final subscriptions array:", subscriptions);
      console.log("Number of subscriptions:", subscriptions.length);

      setPendingSubscriptions(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      const errorMessage = handleApiError(error, t("admin.fetchError") || "Failed to fetch pending subscriptions");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t, toast, handleApiError]);

  useEffect(() => {
    fetchPendingSubscriptions();
  }, [fetchPendingSubscriptions]);

  // Check if user is admin
  if (!isAuthenticated || !hasToken() || user?.type !== "admin") {
    return <AccessDenied />;
  }

  const toggleCardExpansion = (subscriptionId: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
  };

  const handleApprove = async (subscriptionId: number) => {
    try {
      setActionLoading(subscriptionId);
      await admin.approveSubscription(subscriptionId);

      toast({
        title: t("common.success") || "Success",
        description: t("admin.subscriptionApproved") || "Subscription approved successfully",
      });

      // Refresh the list
      fetchPendingSubscriptions();
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.approveError") || "Failed to approve subscription");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (subscriptionId: number) => {
    try {
      setActionLoading(subscriptionId);
      await admin.rejectSubscription(subscriptionId);

      toast({
        title: t("common.success") || "Success",
        description: t("admin.subscriptionRejected") || "Subscription rejected successfully",
      });

      // Refresh the list
      fetchPendingSubscriptions();
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.rejectError") || "Failed to reject subscription");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getSubscriptionTypeBadge = (type: string) => {
    const typeColors = {
      monthly: "bg-blue-50 text-blue-700 border-blue-300",
      yearly: "bg-green-50 text-green-700 border-green-300",
      premium: "bg-purple-50 text-purple-700 border-purple-300",
    };

    return (
      <Badge variant="outline" className={typeColors[type as keyof typeof typeColors] || "bg-gray-50 text-gray-700 border-gray-300"}>
        <CreditCard className="h-3 w-3 mr-1" />
        {t(`subscription.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
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

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t("common.loading") || "Loading..."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back") || "Back"}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t("admin.manageSubscriptions") || "Manage Subscriptions"}</h1>
            <p className="text-muted-foreground">
              {t("admin.pendingSubscriptionsDesc") || "Review and approve pending subscription requests"}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Subscriptions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {t("admin.pendingSubscriptions") || "Pending Subscriptions"} ({pendingSubscriptions.length})
          </h2>
        </div>

        {pendingSubscriptions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("admin.noPendingSubscriptions") || "No Pending Subscriptions"}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("admin.noPendingSubscriptionsDesc") || "All subscription requests have been processed"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingSubscriptions.map((subscription) => {
              const isExpanded = expandedCards.has(subscription.id);
              return (
                <Card 
                  key={subscription.id} 
                  className={`group transition-all duration-500 ease-in-out border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50/30 to-transparent dark:from-purple-950/20 ${
                    isExpanded 
                      ? 'shadow-2xl scale-[1.02] border-purple-500 bg-gradient-to-r from-purple-100/50 to-purple-50/30 dark:from-purple-900/40 dark:to-purple-950/30' 
                      : 'hover:shadow-lg hover:scale-[1.01] hover:border-purple-450'
                  }`}
                >
                  {/* Collapsed Header - Always Visible */}
                  <CardHeader className={`pb-3 transition-all duration-300 ${isExpanded ? 'pb-4 bg-purple-50/20 dark:bg-purple-950/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg transition-all duration-300 ${
                          isExpanded ? 'scale-110 bg-purple-200 dark:bg-purple-800/70 shadow-lg' : 'group-hover:scale-105'
                        }`}>
                          <Building className={`h-5 w-5 text-purple-600 dark:text-purple-400 transition-all duration-300 ${
                            isExpanded ? 'text-purple-700 dark:text-purple-300' : ''
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className={`text-lg font-bold text-gray-900 dark:text-gray-100 truncate transition-all duration-300 ${
                              isExpanded ? 'text-purple-700 dark:text-purple-300 text-xl' : 'group-hover:text-purple-600'
                            }`}>
                              {subscription.office.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {getSubscriptionTypeBadge(subscription.subscription_type)}
                              <Badge 
                                variant="outline" 
                                className={`bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm transition-all duration-300 ${
                                  isExpanded ? 'bg-yellow-100 border-yellow-400 shadow-md scale-105' : ''
                                }`}
                              >
                                <Clock className={`h-3 w-3 mr-1 transition-all duration-300 ${isExpanded ? 'animate-pulse' : ''}`} />
                                {t("admin.pending") || "Pending"}
                              </Badge>
                            </div>
                          </div>
                          <div className={`flex items-center gap-4 text-sm text-muted-foreground transition-all duration-300 ${
                            isExpanded ? 'text-purple-600/80 dark:text-purple-400/80' : ''
                          }`}>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">ID:</span>
                              <code className={`bg-muted px-1.5 py-0.5 rounded text-xs transition-all duration-300 ${
                                isExpanded ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : ''
                              }`}>{subscription.id}</code>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-green-500' : ''}`} />
                              <span className={`font-medium text-green-600 transition-all duration-300 ${
                                isExpanded ? 'text-green-700 font-bold' : ''
                              }`}>
                                {formatPrice(subscription.price)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-purple-500' : ''}`} />
                              <span>{formatDate(subscription.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Always Visible */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          onClick={() => handleReject(subscription.id)}
                          disabled={actionLoading === subscription.id}
                          size="sm"
                          className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                            isExpanded ? 'shadow-lg border-red-300 bg-red-50/50' : ''
                          }`}
                        >
                          <X className={`h-4 w-4 mr-1 transition-all duration-300 ${actionLoading === subscription.id ? 'animate-pulse' : ''}`} />
                          {actionLoading === subscription.id ? (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="hidden sm:inline">{t("common.processing") || "Processing..."}</span>
                            </div>
                          ) : (
                            <span className="hidden sm:inline">{t("admin.reject") || "Reject"}</span>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleApprove(subscription.id)}
                          disabled={actionLoading === subscription.id}
                          size="sm"
                          className={`bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            isExpanded ? 'shadow-xl bg-green-700 scale-105' : ''
                          }`}
                        >
                          <Check className={`h-4 w-4 mr-1 transition-all duration-300 ${actionLoading === subscription.id ? 'animate-pulse' : ''}`} />
                          {actionLoading === subscription.id ? (
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
                          onClick={() => toggleCardExpansion(subscription.id)}
                          className={`p-2 transition-all duration-300 hover:scale-110 hover:bg-purple-100 dark:hover:bg-purple-900/50 ${
                            isExpanded ? 'bg-purple-100 dark:bg-purple-900/50 scale-110 shadow-md' : 'hover:shadow-sm'
                          }`}
                        >
                          <div className="relative">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 transition-all duration-500 ease-in-out transform rotate-0 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 transition-all duration-500 ease-in-out transform rotate-0 hover:text-purple-600 dark:hover:text-purple-400" />
                            )}
                            {isExpanded && (
                              <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping"></div>
                            )}
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Expandable Content */}
                  {isExpanded && (
                    <CardContent className="space-y-6 pt-0 border-t border-purple-200/50 dark:border-purple-800/50 animate-in slide-in-from-top-2 fade-in duration-500">
                      {/* Subscription Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-700 delay-100">
                          <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            {t("admin.subscriptionDetails") || "Subscription Details"}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 rounded-lg hover:bg-gradient-to-r hover:from-green-100/70 hover:to-green-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-green-200 dark:hover:bg-green-800/70">
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 transition-all duration-300 hover:text-green-700 dark:hover:text-green-300" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                  {formatPrice(subscription.price)}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {t("subscription.price") || "Subscription Price"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg hover:bg-gradient-to-r hover:from-blue-100/70 hover:to-blue-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-blue-200 dark:hover:bg-blue-800/70">
                                <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{subscription.subscription_type}</span>
                                <p className="text-xs text-muted-foreground">{t("subscription.type") || "Subscription Type"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg hover:bg-gradient-to-r hover:from-purple-100/70 hover:to-purple-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-purple-200 dark:hover:bg-purple-800/70">
                                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400 transition-all duration-300 hover:text-purple-700 dark:hover:text-purple-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{formatDate(subscription.created_at)}</span>
                                <p className="text-xs text-muted-foreground">{t("admin.submittedOn") || "Submitted On"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-700 delay-200">
                          <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            {t("admin.officeInfo") || "Office Information"}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg hover:bg-gradient-to-r hover:from-orange-100/70 hover:to-orange-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-orange-200 dark:hover:bg-orange-800/70">
                                <Building className="h-4 w-4 text-orange-600 dark:text-orange-400 transition-all duration-300 hover:text-orange-700 dark:hover:text-orange-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{subscription.office.name}</span>
                                <p className="text-xs text-muted-foreground">{t("admin.officeName") || "Office Name"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/30 dark:to-cyan-900/20 rounded-lg hover:bg-gradient-to-r hover:from-cyan-100/70 hover:to-cyan-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-cyan-200 dark:hover:bg-cyan-800/70">
                                <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400 transition-all duration-300 hover:text-cyan-700 dark:hover:text-cyan-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{subscription.office.phone}</span>
                                <p className="text-xs text-muted-foreground">{t("admin.phoneNumber") || "Phone Number"}</p>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-950/30 dark:to-slate-900/20 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={`${
                                  subscription.office.status === 'approved' 
                                    ? 'bg-green-50 text-green-700 border-green-300' 
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                                }`}>
                                  {subscription.office.status}
                                </Badge>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  {t("admin.officeStatus") || "Office Status"}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {t("admin.freeAds") || "Free Ads"}: {subscription.office.free_ads} | 
                                {t("admin.followers") || "Followers"}: {subscription.office.followers_count} | 
                                {t("admin.views") || "Views"}: {subscription.office.views}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center justify-center pt-4 border-t border-purple-200/50 dark:border-purple-800/50 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300">
                        <div className="flex items-center gap-2 text-xs text-purple-600/80 dark:text-purple-400/80 bg-purple-50/50 dark:bg-purple-950/30 px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-800/50 hover:shadow-md transition-all duration-300">
                          <div className="relative">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"></div>
                          </div>
                          <span className="font-medium">{t("admin.awaitingSubscriptionReview") || "Awaiting Subscription Review"}</span>
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

export default ManageSubscriptions;
