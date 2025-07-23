import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { OfficeAISuggestion } from '@/services/aiOfficeSuggestionService';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfficeAISuggestionDetailsProps {
  suggestion?: OfficeAISuggestion;
  requestId: number;
}

export const OfficeAISuggestionDetails: React.FC<OfficeAISuggestionDetailsProps> = ({ 
  suggestion, 
  requestId 
}) => {
  const { t } = useLanguage();

  if (!suggestion) {
    return null;
  }

  if (suggestion.status === 'loading') {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">
              {t("admin.aiAnalyzing") || "AI is analyzing this office registration..."}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestion.status === 'error') {
    return (
      <Card className="border-gray-200 bg-gray-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              {suggestion.summary}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (suggestion.status) {
      case 'approve':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'reject':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'review':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (suggestion.status) {
      case 'approve':
        return 'border-green-200 bg-green-50/50';
      case 'reject':
        return 'border-red-200 bg-red-50/50';
      case 'review':
        return 'border-yellow-200 bg-yellow-50/50';
      default:
        return 'border-gray-200 bg-gray-50/50';
    }
  };

  return (
    <Card className={`${getStatusColor()} transition-all duration-200`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          {getStatusIcon()}
          <span>{t("admin.aiSuggestion") || "AI Analysis"}</span>
          <Badge variant="outline" className="ml-auto">
            {t("admin.confidence") || "Confidence"}: {suggestion.confidence}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-3 bg-white/60 rounded-lg border">
          <p className="text-sm text-gray-700 leading-relaxed">
            {suggestion.summary}
          </p>
        </div>

        {/* Reasons */}
        {suggestion.reasons.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              {t("admin.aiReasons") || "Analysis Reasons"}
            </h4>
            <ul className="space-y-1">
              {suggestion.reasons.map((reason, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Document Analysis */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {t("admin.documentAnalysis") || "Document Analysis"}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {t("admin.documentValid") || "Document Valid"}:
              </span>
              <Badge variant={suggestion.documentAnalysis.isValidDocument ? "default" : "destructive"}>
                {suggestion.documentAnalysis.isValidDocument ? 
                  (t("common.yes") || "Yes") : 
                  (t("common.no") || "No")
                }
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {t("admin.documentType") || "Document Type"}:
              </span>
              <span className="text-gray-900 font-medium">
                {suggestion.documentAnalysis.documentType || t("common.unknown") || "Unknown"}
              </span>
            </div>
            {suggestion.documentAnalysis.documentIssues.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">
                  {t("admin.documentIssues") || "Issues"}:
                </span>
                <ul className="mt-1 space-y-1">
                  {suggestion.documentAnalysis.documentIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Location Analysis */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {t("admin.locationAnalysis") || "Location Analysis"}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {t("admin.locationValid") || "Location Valid"}:
              </span>
              <Badge variant={suggestion.locationAnalysis.isValidLocation ? "default" : "destructive"}>
                {suggestion.locationAnalysis.isValidLocation ? 
                  (t("common.yes") || "Yes") : 
                  (t("common.no") || "No")
                }
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {t("admin.locationType") || "Location Type"}:
              </span>
              <span className="text-gray-900 font-medium">
                {suggestion.locationAnalysis.locationType || t("common.unknown") || "Unknown"}
              </span>
            </div>
            {suggestion.locationAnalysis.locationIssues.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">
                  {t("admin.locationIssues") || "Issues"}:
                </span>
                <ul className="mt-1 space-y-1">
                  {suggestion.locationAnalysis.locationIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Profile Analysis */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <User className="h-4 w-4 mr-1" />
            {t("admin.profileAnalysis") || "Profile Analysis"}
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {t("admin.profileCompleteness") || "Profile Completeness"}:
                </span>
                <span className="text-gray-900 font-medium">
                  {suggestion.profileAnalysis.completeness}%
                </span>
              </div>
              <Progress value={suggestion.profileAnalysis.completeness} className="h-2" />
            </div>
            
            {suggestion.profileAnalysis.missingFields.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">
                  {t("admin.missingFields") || "Missing Fields"}:
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {suggestion.profileAnalysis.missingFields.map((field, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {suggestion.profileAnalysis.suggestions.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">
                  {t("admin.suggestions") || "Suggestions"}:
                </span>
                <ul className="mt-1 space-y-1">
                  {suggestion.profileAnalysis.suggestions.map((suggestionText, index) => (
                    <li key={index} className="text-sm text-blue-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {suggestionText}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
