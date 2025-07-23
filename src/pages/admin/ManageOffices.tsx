import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Phone,
  Calendar,
  FileText,
  Check,
  X,
  ArrowLeft,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { admin } from "@/services/api";
import IOffice from "@/interfaces/IOffice";
import { useOfficeAISuggestions } from "@/hooks/useOfficeAISuggestions";
import { OfficeAISuggestionBadge } from "@/components/admin/OfficeAISuggestionBadge";
import { OfficeAISuggestionDetails } from "@/components/admin/OfficeAISuggestionDetails";

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
  requestable: IOffice;
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

const ManageOffices = () => {
  const { t, isAuthenticated, hasToken, user } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingOffices, setPendingOffices] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const { analyzeOffice, getSuggestion } = useOfficeAISuggestions();

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

  const fetchPendingOffices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await admin.getPendingRequests();
      const data: ApiResponse = response.data;

      // Filter only office requests
      const officeRequests = data.data.filter(
        (request) => request.requestable_type === "App\\Models\\Office"
      );

      setPendingOffices(officeRequests);

      // Trigger AI analysis for each office
      officeRequests.forEach((request) => {
        analyzeOffice(request.requestable, request.id);
      });
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.fetchError") || "Failed to fetch pending offices");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t, toast, handleApiError, analyzeOffice]);

  useEffect(() => {
    fetchPendingOffices();
  }, [fetchPendingOffices]);

  // Check if user is admin
  if (!isAuthenticated || !hasToken() || user?.type !== "admin") {
    return <AccessDenied />;
  }

  const handleApprove = async (requestId: number) => {
    try {
      setActionLoading(requestId);
      await admin.approveOfficeRequest(requestId);

      toast({
        title: t("common.success") || "Success",
        description: t("admin.officeApproved") || "Office approved successfully",
      });

      // Refresh the list
      fetchPendingOffices();
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.approveError") || "Failed to approve office");
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
      await admin.rejectOfficeRequest(requestId);

      toast({
        title: t("common.success") || "Success",
        description: t("admin.officeRejected") || "Office rejected successfully",
      });

      // Refresh the list
      fetchPendingOffices();
    } catch (error) {
      const errorMessage = handleApiError(error, t("admin.rejectError") || "Failed to reject office");
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
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

  const handleDownloadDocument = (documentPath: string, officeName: string) => {
    const link = document.createElement("a");
    link.href = documentPath;
    link.download = `${officeName}_document.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <Building className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {t("admin.manageOffices") || "Manage Offices"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("admin.pendingOfficeRequests") || "Review and approve pending office requests"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Clock className="h-3 w-3 mr-1" />
              {pendingOffices.length} {t("admin.pending") || "Pending"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pendingOffices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("admin.noPendingOffices") || "No Pending Offices"}
              </h3>
              <p className="text-muted-foreground">
                {t("admin.noPendingOfficesDesc") || "All office requests have been processed"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingOffices.map((request) => {
              const isExpanded = expandedCards.has(request.id);
              return (
                <Card
                  key={request.id}
                  className={`group transition-all duration-500 ease-in-out border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50/30 to-transparent dark:from-orange-950/20 ${
                    isExpanded
                      ? 'shadow-2xl scale-[1.02] border-orange-500 bg-gradient-to-r from-orange-100/50 to-orange-50/30 dark:from-orange-900/40 dark:to-orange-950/30'
                      : 'hover:shadow-lg hover:scale-[1.01] hover:border-orange-450'
                  }`}
                >
                  {/* Collapsed Header - Always Visible */}
                  <CardHeader className={`pb-3 transition-all duration-300 ${isExpanded ? 'pb-4 bg-orange-50/20 dark:bg-orange-950/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg transition-all duration-300 ${
                          isExpanded ? 'scale-110 bg-orange-200 dark:bg-orange-800/70 shadow-lg' : 'group-hover:scale-105'
                        }`}>
                          <Building className={`h-5 w-5 text-orange-600 dark:text-orange-400 transition-all duration-300 ${
                            isExpanded ? 'text-orange-700 dark:text-orange-300' : ''
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className={`text-lg font-bold text-gray-900 dark:text-gray-100 truncate transition-all duration-300 ${
                              isExpanded ? 'text-orange-700 dark:text-orange-300 text-xl' : 'group-hover:text-orange-600'
                            }`}>
                              {request.requestable.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm flex-shrink-0 transition-all duration-300 ${
                                  isExpanded ? 'bg-yellow-100 border-yellow-400 shadow-md' : ''
                                }`}
                              >
                                <Clock className={`h-3 w-3 mr-1 transition-all duration-300 ${isExpanded ? 'text-yellow-700' : ''}`} />
                                {t("admin.pending") || "Pending"}
                              </Badge>
                              <OfficeAISuggestionBadge suggestion={getSuggestion(request.id)} />
                            </div>
                          </div>
                          <div className={`flex items-center gap-4 text-sm text-muted-foreground transition-all duration-300 ${
                            isExpanded ? 'text-orange-600/80 dark:text-orange-400/80' : ''
                          }`}>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">ID:</span>
                              <code className={`bg-muted px-1.5 py-0.5 rounded text-xs transition-all duration-300 ${
                                isExpanded ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' : ''
                              }`}>{request.id}</code>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-orange-500' : ''}`} />
                              <span>{request.requestable.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className={`h-3 w-3 transition-all duration-300 ${isExpanded ? 'text-orange-500' : ''}`} />
                              <span>{formatDate(request.created_at)}</span>
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
                          className={`p-2 transition-all duration-300 hover:scale-110 hover:bg-orange-100 dark:hover:bg-orange-900/50 ${
                            isExpanded ? 'bg-orange-100 dark:bg-orange-900/50 scale-110 shadow-md' : 'hover:shadow-sm'
                          }`}
                        >
                          <div className="relative">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 transition-all duration-500 ease-in-out transform rotate-0 text-orange-600 dark:text-orange-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 transition-all duration-500 ease-in-out transform rotate-0 hover:text-orange-600 dark:hover:text-orange-400" />
                            )}
                            {isExpanded && (
                              <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping"></div>
                            )}
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <CardContent className="space-y-6 pt-0 border-t border-orange-200/50 dark:border-orange-800/50 animate-in slide-in-from-top-2 fade-in duration-500">
                      {/* Office Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-700 delay-100">
                          <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            {t("admin.contactInfo") || "Contact Information"}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg hover:bg-gradient-to-r hover:from-blue-100/70 hover:to-blue-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-blue-200 dark:hover:bg-blue-800/70">
                                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300" />
                              </div>
                              <div>
                                <span className="text-sm font-medium">{request.requestable.phone}</span>
                                <p className="text-xs text-muted-foreground">{t("admin.phoneNumber") || "Phone Number"}</p>
                              </div>
                            </div>

                            {request.requestable.location && (
                              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 rounded-lg hover:bg-gradient-to-r hover:from-green-100/70 hover:to-green-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform">
                                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-green-200 dark:hover:bg-green-800/70">
                                  <Building className="h-4 w-4 text-green-600 dark:text-green-400 transition-all duration-300 hover:text-green-700 dark:hover:text-green-300" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{request.requestable.location}</span>
                                  <p className="text-xs text-muted-foreground">{t("admin.location") || "Location"}</p>
                                </div>
                              </div>
                            )}

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
                          <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            {t("admin.documentation") || "Documentation"}
                          </h4>
                          <div className="p-4 border-2 border-dashed border-indigo-200/50 dark:border-indigo-800/50 rounded-lg hover:border-indigo-400/70 dark:hover:border-indigo-600/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-indigo-50/30 to-indigo-100/20 dark:from-indigo-950/20 dark:to-indigo-900/10">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded transition-all duration-300 hover:scale-110 hover:bg-indigo-200 dark:hover:bg-indigo-800/70 hover:shadow-md">
                                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:text-indigo-700 dark:hover:text-indigo-300" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{t("admin.verificationDocument") || "Verification Document"}</p>
                                <p className="text-xs text-muted-foreground">PDF Document</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadDocument(request.requestable.document.url, request.requestable.name)}
                              className="w-full hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                            >
                              <Download className="h-4 w-4 mr-2 transition-all duration-300 hover:scale-110" />
                              {t("admin.downloadDocument") || "Download Document"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      {request.requestable.description && (
                        <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
                          <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-300 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            {t("admin.description") || "Description"}
                          </h4>
                          <div className="p-4 bg-gradient-to-r from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {request.requestable.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* AI Suggestion Section */}
                      <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 delay-350">
                        <OfficeAISuggestionDetails
                          suggestion={getSuggestion(request.id)}
                          requestId={request.id}
                        />
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center justify-center pt-4 border-t border-orange-200/50 dark:border-orange-800/50 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-400">
                        <div className="flex items-center gap-2 text-xs text-orange-600/80 dark:text-orange-400/80 bg-orange-50/50 dark:bg-orange-950/30 px-4 py-2 rounded-full border border-orange-200/50 dark:border-orange-800/50 hover:shadow-md transition-all duration-300">
                          <div className="relative">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75"></div>
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

export default ManageOffices;
