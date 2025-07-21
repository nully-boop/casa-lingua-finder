import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { AISuggestion } from "@/services/aiSuggestionService";

interface AISuggestionBadgeProps {
  suggestion: AISuggestion | undefined;
}

export const AISuggestionBadge = ({ suggestion }: AISuggestionBadgeProps) => {
  const { t } = useLanguage();

  if (!suggestion) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
        <Brain className="h-3 w-3 mr-1 animate-pulse" />
        {t("admin.aiAnalyzing") || "AI Analyzing..."}
      </Badge>
    );
  }

  switch (suggestion.status) {
    case 'loading':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">
          <Brain className="h-3 w-3 mr-1 animate-pulse" />
          {t("admin.aiAnalyzing") || "AI Analyzing..."}
        </Badge>
      );
    case 'approve':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <TrendingUp className="h-3 w-3 mr-1" />
          {t("admin.aiApprove") || "AI: Approve"} ({suggestion.confidence}%)
        </Badge>
      );
    case 'reject':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
          <TrendingDown className="h-3 w-3 mr-1" />
          {t("admin.aiReject") || "AI: Reject"} ({suggestion.confidence}%)
        </Badge>
      );
    case 'review':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t("admin.aiReview") || "AI: Review"} ({suggestion.confidence}%)
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t("admin.aiError") || "AI Error"}
        </Badge>
      );
    default:
      return null;
  }
};
