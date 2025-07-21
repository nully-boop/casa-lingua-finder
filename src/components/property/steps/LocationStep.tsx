import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, MapPin, Map, Loader2, Navigation } from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";
import { useToast } from "@/hooks/use-toast";

interface LocationStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const governorates = [
    { value: 'damascus', label: t("location.damascus") || 'Damascus' },
    { value: 'aleppo', label: t("location.aleppo") || 'Aleppo' },
    { value: 'homs', label: t("location.homs") || 'Homs' },
    { value: 'hama', label: t("location.hama") || 'Hama' },
    { value: 'lattakia', label: t("location.lattakia") || 'Lattakia' },
    { value: 'tartus', label: t("location.tartus") || 'Tartus' },
    { value: 'idlib', label: t("location.idlib") || 'Idlib' },
    { value: 'daraa', label: t("location.daraa") || 'Daraa' },
    { value: 'sweida', label: t("location.sweida") || 'As-Sweida' },
    { value: 'quneitra', label: t("location.quneitra") || 'Quneitra' },
    { value: 'raqqa', label: t("location.raqqa") || 'Raqqa' },
    { value: 'deir_ez_zor', label: t("location.deir_ez_zor") || 'Deir ez-Zor' },
    { value: 'hasakah', label: t("location.hasakah") || 'Al-Hasakah' },
    { value: 'damascus_countryside', label: t("location.damascus_countryside") || 'Damascus Countryside' },
  ];

  const handleNext = () => {
    if (!formData.location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter the property location",
        variant: "destructive",
      });
      return;
    }

    if (!formData.governorate) {
      toast({
        title: "Governorate Required",
        description: "Please select a governorate",
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateFormData({ latitude, longitude });
        
        // Reverse geocoding to get address (optional)
        reverseGeocode(latitude, longitude);
        
        toast({
          title: "Location Retrieved",
          description: "Current location has been set",
        });
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location Error",
          description: "Failed to get current location",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // This is a placeholder for reverse geocoding
      // You would typically use a service like Google Maps API
      console.log('Reverse geocoding:', lat, lng);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const openMapPicker = () => {
    // This would open a map picker modal
    // For now, we'll just show a toast
    toast({
      title: "Map Picker",
      description: "Map picker feature coming soon",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {t("property.locationTitle") || "Location Information"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.locationDesc") || "Specify the exact location of your property"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Location Address */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-base font-medium">
            {t("property.address") || "Property Address"} *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              placeholder={t("property.addressPlaceholder") || "Enter full address"}
              className="pl-10"
            />
          </div>
        </div>

        {/* Governorate */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.governorate") || "Governorate"} *
          </Label>
          <Select
            value={formData.governorate}
            onValueChange={(value) => updateFormData({ governorate: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectGovernorate") || "Select governorate"} />
            </SelectTrigger>
            <SelectContent>
              {governorates.map((gov) => (
                <SelectItem key={gov.value} value={gov.value}>
                  {gov.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-base font-medium">
              {t("property.latitude") || "Latitude"}
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formData.latitude || ''}
              onChange={(e) => updateFormData({ latitude: parseFloat(e.target.value) || 0 })}
              placeholder="0.000000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longitude" className="text-base font-medium">
              {t("property.longitude") || "Longitude"}
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formData.longitude || ''}
              onChange={(e) => updateFormData({ longitude: parseFloat(e.target.value) || 0 })}
              placeholder="0.000000"
            />
          </div>
        </div>

        {/* Location Tools */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center space-x-2"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            <span>
              {isGettingLocation 
                ? (t("property.gettingLocation") || "Getting Location...") 
                : (t("property.useCurrentLocation") || "Use Current Location")
              }
            </span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={openMapPicker}
            className="flex items-center space-x-2"
          >
            <Map className="h-4 w-4" />
            <span>{t("property.pickOnMap") || "Pick on Map"}</span>
          </Button>
        </div>

        {/* Coordinates Display */}
        {(formData.latitude !== 0 || formData.longitude !== 0) && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              {t("property.coordinates") || "Coordinates"}
            </h4>
            <div className="text-sm text-muted-foreground">
              <p>Latitude: {formData.latitude}</p>
              <p>Longitude: {formData.longitude}</p>
            </div>
          </div>
        )}

        {/* Location Tips */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">
            {t("property.locationTips") || "Location Tips"}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t("property.locationTip1") || "Provide the exact address for better visibility"}</li>
            <li>• {t("property.locationTip2") || "Include nearby landmarks or metro stations"}</li>
            <li>• {t("property.locationTip3") || "Accurate coordinates help buyers find your property"}</li>
            <li>• {t("property.locationTip4") || "Double-check the location before submitting"}</li>
          </ul>
        </div>
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

export default LocationStep;
