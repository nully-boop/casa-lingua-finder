import { useState, useCallback } from 'react';
import { AISuggestion, aiSuggestionService, PropertyData } from '@/services/aiSuggestionService';

export const useAISuggestions = () => {
  const [aiSuggestions, setAiSuggestions] = useState<Map<number, AISuggestion>>(new Map());

  const analyzeProperty = useCallback(async (property: PropertyData, requestId: number) => {
    try {
      // Set loading state
      setAiSuggestions(prev => new Map(prev.set(requestId, aiSuggestionService.createLoadingSuggestion())));

      // Perform AI analysis
      const analysis = await aiSuggestionService.analyzeProperty(property);
      
      // Update state with AI analysis
      setAiSuggestions(prev => new Map(prev.set(requestId, analysis)));

    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Set error state
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAiSuggestions(prev => new Map(prev.set(requestId, aiSuggestionService.createErrorSuggestion(errorMessage))));
    }
  }, []);

  const getSuggestion = useCallback((requestId: number): AISuggestion | undefined => {
    return aiSuggestions.get(requestId);
  }, [aiSuggestions]);

  const clearSuggestions = useCallback(() => {
    setAiSuggestions(new Map());
  }, []);

  const removeSuggestion = useCallback((requestId: number) => {
    setAiSuggestions(prev => {
      const newMap = new Map(prev);
      newMap.delete(requestId);
      return newMap;
    });
  }, []);

  return {
    aiSuggestions,
    analyzeProperty,
    getSuggestion,
    clearSuggestions,
    removeSuggestion,
  };
};
