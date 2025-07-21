import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";
import { useToast } from "@/hooks/use-toast";
import { generatePropertyTitle, isAIServiceAvailable } from "@/services/aiService";

interface PropertyDetailsStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);


  const aiAvailable = isAIServiceAvailable() && formData.images.length > 0;

  const handleNext = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a property title",
        variant: "destructive",
      });
      return;
    }



    onNext();
  };

  const generateTitle = async () => {
    if (!aiAvailable) return;

    setIsGeneratingTitle(true);

    try {
      const generatedTitle = await generatePropertyTitle(formData.images);
      updateFormData({ title: generatedTitle });

      toast({
        title: "Title Generated",
        description: "AI has generated a title based on your images",
      });

    } catch (error) {
      console.error('Title generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">
          {t("property.propertyDetailsTitle") || "Property Details"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.propertyDetailsDesc") || "Add title and description for your property"}
        </p>
      </div>

      {/* Title Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title" className="text-base font-medium">
            {t("property.title") || "Property Title"} *
          </Label>
          {aiAvailable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateTitle}
              disabled={isGeneratingTitle}
              className="flex items-center space-x-2"
            >
              {isGeneratingTitle ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>
                {isGeneratingTitle 
                  ? (t("property.generating") || "Generating...") 
                  : (t("property.generateTitle") || "Generate Title")
                }
              </span>
            </Button>
          )}
        </div>
        
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder={t("property.titlePlaceholder") || "Enter property title"}
          className="text-base"
        />
        
        {!aiAvailable && (
          <p className="text-xs text-muted-foreground">
            {t("property.aiGenerationNote") || "Upload images or videos to enable AI generation"}
          </p>
        )}
      </div>



      {/* Tips Section */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          {t("property.writingTips") || "Writing Tips"}
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t("property.tip1") || "Use descriptive words that highlight unique features"}</li>
          <li>• {t("property.tip2") || "Mention nearby amenities and transportation"}</li>
          <li>• {t("property.tip3") || "Include information about the neighborhood"}</li>
          <li>• {t("property.tip4") || "Be honest and accurate in your description"}</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.back") || "Back"}</span>
        </Button>
        
        <Button onClick={handleNext} className="flex items-center space-x-2">
          <span>{t("common.next") || "Next"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
