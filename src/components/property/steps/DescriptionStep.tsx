import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, FileText } from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";
import { useToast } from "@/hooks/use-toast";
import { generatePropertyDescriptionFromData, isAIServiceAvailable } from "@/services/aiService";

interface DescriptionStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DescriptionStep: React.FC<DescriptionStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const aiAvailable = isAIServiceAvailable();

  const handleNext = () => {
    if (!formData.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a property description or generate one using AI",
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

  const generateDescription = async () => {
    if (!aiAvailable) return;

    setIsGeneratingDescription(true);
    
    try {
      const generatedDescription = await generatePropertyDescriptionFromData(formData);
      updateFormData({ description: generatedDescription });
      
      toast({
        title: "Description Generated",
        description: "AI has generated a comprehensive description based on your property details",
      });
      
    } catch (error) {
      console.error('Description generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {t("property.description") || "Property Description"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.descriptionStepDesc") || "Create a compelling description for your property"}
        </p>
      </div>



      {/* Description Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-base font-medium">
            {t("property.description") || "Property Description"} *
          </Label>
          {aiAvailable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateDescription}
              disabled={isGeneratingDescription}
              className="flex items-center space-x-2"
            >
              {isGeneratingDescription ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>
                {isGeneratingDescription 
                  ? (t("property.generating") || "Generating...") 
                  : (t("property.generateDescription") || "Generate Description")
                }
              </span>
            </Button>
          )}
        </div>
        
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder={t("property.descriptionPlaceholder") || "Describe your property in detail..."}
          rows={8}
          className="text-base resize-none"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {!aiAvailable && (t("property.aiGenerationNote") || "AI generation not available")}
          </span>
          <span>{formData.description.length}/2000</span>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          {t("property.descriptionTips") || "Description Tips"}
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t("property.descTip1") || "Highlight unique features and selling points"}</li>
          <li>• {t("property.descTip2") || "Mention nearby amenities and transportation"}</li>
          <li>• {t("property.descTip3") || "Describe the lifestyle and benefits"}</li>
          <li>• {t("property.descTip4") || "Use compelling language to attract buyers"}</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.back") || "Back"}</span>
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex items-center space-x-2"
        >
          <span>{t("common.next") || "Next"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DescriptionStep;
