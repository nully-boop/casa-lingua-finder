import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { OfficeAISuggestion } from '@/services/aiOfficeSuggestionService';

interface OfficeAISuggestionBadgeProps {
  suggestion?: OfficeAISuggestion;
}

export const OfficeAISuggestionBadge: React.FC<OfficeAISuggestionBadgeProps> = ({ suggestion }) => {
  if (!suggestion) {
    return null;
  }

  const getStatusConfig = () => {
    switch (suggestion.status) {
      case 'approve':
        return {
          icon: CheckCircle,
          text: 'AI: Approve',
          className: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
        };
      case 'reject':
        return {
          icon: XCircle,
          text: 'AI: Reject',
          className: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
        };
      case 'review':
        return {
          icon: AlertTriangle,
          text: 'AI: Review',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
        };
      case 'loading':
        return {
          icon: Loader2,
          text: 'AI: Analyzing...',
          className: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
        };
      case 'error':
        return {
          icon: Brain,
          text: 'AI: Error',
          className: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
        };
      default:
        return {
          icon: Brain,
          text: 'AI: Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
        };
    }
  };

  const { icon: Icon, text, className } = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={`${className} transition-all duration-200 cursor-help`}
      title={`AI Confidence: ${suggestion.confidence}%`}
    >
      <Icon className={`h-3 w-3 mr-1 ${suggestion.status === 'loading' ? 'animate-spin' : ''}`} />
      {text}
      {suggestion.status !== 'loading' && suggestion.status !== 'error' && (
        <span className="ml-1 text-xs opacity-75">
          ({suggestion.confidence}%)
        </span>
      )}
    </Badge>
  );
};
