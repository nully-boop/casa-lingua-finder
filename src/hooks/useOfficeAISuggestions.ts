import { useState, useCallback } from 'react';
import { OfficeAISuggestion, aiOfficeSuggestionService } from '@/services/aiOfficeSuggestionService';
import IOffice from '@/interfaces/IOffice';

export const useOfficeAISuggestions = () => {
  const [suggestions, setSuggestions] = useState<Map<number, OfficeAISuggestion>>(new Map());

  const analyzeOffice = useCallback(async (office: IOffice, requestId: number) => {
    // Set loading state
    setSuggestions(prev => new Map(prev.set(requestId, aiOfficeSuggestionService.createLoadingSuggestion())));

    try {
      const suggestion = await aiOfficeSuggestionService.analyzeOffice(office);
      setSuggestions(prev => new Map(prev.set(requestId, suggestion)));
    } catch (error) {
      console.error('Office AI analysis failed:', error);
      setSuggestions(prev => new Map(prev.set(requestId, aiOfficeSuggestionService.createErrorSuggestion(
        error instanceof Error ? error.message : 'Unknown error'
      ))));
    }
  }, []);

  const getSuggestion = useCallback((requestId: number): OfficeAISuggestion | undefined => {
    return suggestions.get(requestId);
  }, [suggestions]);

  const clearSuggestion = useCallback((requestId: number) => {
    setSuggestions(prev => {
      const newMap = new Map(prev);
      newMap.delete(requestId);
      return newMap;
    });
  }, []);

  const clearAllSuggestions = useCallback(() => {
    setSuggestions(new Map());
  }, []);

  return {
    analyzeOffice,
    getSuggestion,
    clearSuggestion,
    clearAllSuggestions
  };
};
