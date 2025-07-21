import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { AISuggestion } from "@/services/aiSuggestionService";

interface AISuggestionDetailsProps {
  suggestion: AISuggestion | undefined;
  requestId: number;
  currentPrice: number;
  currency: string;
  formatPrice: (price: number, currency: string) => string;
}

export const AISuggestionDetails = ({ 
  suggestion, 
  requestId, 
  currentPrice, 
  currency, 
  formatPrice 
}: AISuggestionDetailsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
      <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300 uppercase tracking-wide flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
        {t("admin.aiSuggestion") || "AI Price Analysis"}
      </h4>
      
      {(() => {
        if (!suggestion || suggestion.status === 'loading') {
          return (
            <div className="p-4 bg-gradient-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {t("admin.aiAnalyzing") || "AI is analyzing this property..."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.aiAnalyzingDesc") || "Comparing price with market standards and property features"}
                  </p>
                </div>
              </div>
            </div>
          );
        }

        if (suggestion.status === 'error') {
          return (
            <div className="p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-950/30 dark:to-gray-900/20 rounded-lg border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("admin.aiError") || "AI Analysis Error"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.summary}
                  </p>
                </div>
              </div>
            </div>
          );
        }

        const statusColors = {
          approve: 'green',
          reject: 'red',
          review: 'yellow'
        };
        const color = statusColors[suggestion.status] || 'gray';

        return (
          <div className={`p-4 bg-gradient-to-r from-${color}-50/50 to-${color}-100/30 dark:from-${color}-950/30 dark:to-${color}-900/20 rounded-lg border border-${color}-200/50 dark:border-${color}-800/50 hover:shadow-lg hover:scale-[1.01] transition-all duration-300`}>
            <div className="space-y-4">
              {/* AI Recommendation Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {suggestion.status === 'approve' && <TrendingUp className={`h-5 w-5 text-${color}-600`} />}
                  {suggestion.status === 'reject' && <TrendingDown className={`h-5 w-5 text-${color}-600`} />}
                  {suggestion.status === 'review' && <AlertTriangle className={`h-5 w-5 text-${color}-600`} />}
                  <div>
                    <p className={`text-sm font-bold text-${color}-700 dark:text-${color}-300 capitalize`}>
                      {t(`admin.ai${suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}`) || `AI: ${suggestion.status}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("admin.confidence") || "Confidence"}: {suggestion.confidence}%
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 bg-${color}-100 dark:bg-${color}-900/50 rounded-full`}>
                  <span className={`text-xs font-medium text-${color}-700 dark:text-${color}-300`}>
                    {suggestion.confidence}% {t("admin.confident") || "Confident"}
                  </span>
                </div>
              </div>

              {/* Price Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("admin.priceAnalysis") || "Price Analysis"}
                  </h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t("admin.currentPrice") || "Current Price"}:</span>
                      <span className="font-medium">{formatPrice(currentPrice, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t("admin.suggestedPrice") || "AI Suggested"}:</span>
                      <span className="font-medium">{formatPrice(suggestion.priceAnalysis.suggestedPrice, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t("admin.priceDifference") || "Difference"}:</span>
                      <span className={`font-medium ${suggestion.priceAnalysis.priceDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {suggestion.priceAnalysis.priceDifference > 0 ? '+' : ''}{suggestion.priceAnalysis.priceDifference}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("admin.marketComparison") || "Market Comparison"}
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {suggestion.priceAnalysis.marketComparison}
                  </p>
                </div>
              </div>

              {/* AI Reasons */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("admin.aiReasons") || "AI Analysis Reasons"}
                </h5>
                <ul className="space-y-1">
                  {suggestion.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className={`w-1.5 h-1.5 bg-${color}-500 rounded-full mt-1.5 flex-shrink-0`}></div>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Summary */}
              <div className="pt-3 border-t border-muted-foreground/10">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium">{t("admin.aiSummary") || "AI Summary"}:</span> {suggestion.summary}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
