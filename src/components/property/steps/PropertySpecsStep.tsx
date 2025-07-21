import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Home, Ruler, Bed, Bath, Building2 } from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";
import { useToast } from "@/hooks/use-toast";

interface PropertySpecsStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertySpecsStep: React.FC<PropertySpecsStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const propertyTypes = [
    { value: 'apartment', label: t("property.apartment") || 'Apartment' },
    { value: 'villa', label: t("property.villa") || 'Villa' },
    { value: 'office', label: t("property.office") || 'Office' },
    { value: 'land', label: t("property.land") || 'Land' },
    { value: 'commercial', label: t("property.commercial") || 'Commercial' },
    { value: 'farm', label: t("property.farm") || 'Farm' },
    { value: 'building', label: t("property.building") || 'Building' },
    { value: 'chalet', label: t("property.chalet") || 'Chalet' },
  ];

  const furnishingOptions = [
    { value: 'furnished', label: t("property.furnished") || 'Furnished' },
    { value: 'unfurnished', label: t("property.unfurnished") || 'Unfurnished' },
    { value: 'semi-furnished', label: t("property.semiFurnished") || 'Semi-Furnished' },
  ];

  const handleNext = () => {
    if (!formData.property_type) {
      toast({
        title: "Property Type Required",
        description: "Please select a property type",
        variant: "destructive",
      });
      return;
    }

    if (!formData.area || formData.area <= 0) {
      toast({
        title: "Area Required",
        description: "Please enter a valid area",
        variant: "destructive",
      });
      return;
    }

    if (!formData.furnishing) {
      toast({
        title: "Furnishing Required",
        description: "Please select furnishing status",
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

  const handleFeaturesChange = (value: string) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f.length > 0);
    updateFormData({ features });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Home className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {t("property.specificationsTitle") || "Property Specifications"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.specificationsDesc") || "Provide detailed specifications for your property"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.propertyType") || "Property Type"} *
          </Label>
          <Select
            value={formData.property_type}
            onValueChange={(value) => updateFormData({ property_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectPropertyType") || "Select property type"} />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-base font-medium">
            {t("property.area") || "Area"} (m²) *
          </Label>
          <div className="relative">
            <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="area"
              type="number"
              value={formData.area || ''}
              onChange={(e) => updateFormData({ area: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="pl-10"
              min="1"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <Label htmlFor="rooms" className="text-base font-medium">
            {t("property.rooms") || "Number of Rooms"}
          </Label>
          <div className="relative">
            <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="rooms"
              type="number"
              value={formData.rooms || ''}
              onChange={(e) => updateFormData({ rooms: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="pl-10"
              min="0"
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="text-base font-medium">
            {t("property.bathrooms") || "Number of Bathrooms"}
          </Label>
          <div className="relative">
            <Bath className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="bathrooms"
              type="number"
              value={formData.bathrooms || ''}
              onChange={(e) => updateFormData({ bathrooms: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="pl-10"
              min="0"
            />
          </div>
        </div>

        {/* Floor Number */}
        <div className="space-y-2">
          <Label htmlFor="floor" className="text-base font-medium">
            {t("property.floorNumber") || "Floor Number"}
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="floor"
              type="number"
              value={formData.floor_number || ''}
              onChange={(e) => updateFormData({ floor_number: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="pl-10"
              min="0"
            />
          </div>
        </div>

        {/* Furnishing */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.furnishing") || "Furnishing"} *
          </Label>
          <Select
            value={formData.furnishing}
            onValueChange={(value) => updateFormData({ furnishing: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectFurnishing") || "Select furnishing"} />
            </SelectTrigger>
            <SelectContent>
              {furnishingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label htmlFor="features" className="text-base font-medium">
          {t("property.features") || "Features"}
        </Label>
        <Input
          id="features"
          value={formData.features.join(', ')}
          onChange={(e) => handleFeaturesChange(e.target.value)}
          placeholder={t("property.featuresPlaceholder") || "e.g., Swimming pool, Garden, Parking, Balcony"}
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          {t("property.featuresNote") || "Separate features with commas"}
        </p>
      </div>

      {/* Features Examples */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          {t("property.commonFeatures") || "Common Features"}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <span>• Swimming Pool</span>
          <span>• Garden</span>
          <span>• Parking</span>
          <span>• Balcony</span>
          <span>• Elevator</span>
          <span>• Security</span>
          <span>• Gym</span>
          <span>• Central AC</span>
          <span>• Maid Room</span>
        </div>
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

export default PropertySpecsStep;
