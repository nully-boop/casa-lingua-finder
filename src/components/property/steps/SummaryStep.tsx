import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Check, 
  FileText, 
  MapPin, 
  DollarSign, 
  Home, 
  Image, 
  Bed, 
  Bath, 
  Square, 
  CheckCircle, 
  Loader2 
} from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";
import { useToast } from "@/hooks/use-toast";

interface SummaryStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-lg font-semibold">
          {t("property.finalReview") || "Final Review"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.finalReviewDesc") || "Review your property details before submission"}
        </p>
      </div>

      {/* Property Summary Card */}
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl">{formData.title || "Untitled Property"}</span>
            <Badge variant={formData.ad_type === 'sale' ? 'default' : 'secondary'} className="text-sm">
              {formData.ad_type === 'sale' ? (t("property.sale") || "For Sale") : (t("property.rent") || "For Rent")}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Media Section */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center">
                <Image className="h-4 w-4 mr-2" />
                {t("property.media") || "Media"}
              </h4>
              <Badge variant="outline" className="font-normal">
                {formData.images.length + formData.videos.length} {t("property.files") || "files"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formData.images.length} {t("property.images") || "images"}</span>
              <span>•</span>
              <span>{formData.videos.length} {t("property.videos") || "videos"}</span>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {formData.images.slice(0, 5).map((image, index) => (
                  <div key={index} className="relative h-16 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {formData.images.length > 5 && (
                  <Badge variant="secondary" className="absolute bottom-1 right-1 text-xs">
                    +{formData.images.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Basic Details Section */}
          <div className="p-4 border-b">
            <h4 className="font-medium flex items-center mb-3">
              <Home className="h-4 w-4 mr-2" />
              {t("property.basicDetails") || "Basic Details"}
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("property.propertyType") || "Property Type"}
                </Label>
                <p className="font-medium capitalize">{formData.property_type || "Not specified"}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("property.furnishing") || "Furnishing"}
                </Label>
                <p className="font-medium capitalize">{formData.furnishing || "Not specified"}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("property.status") || "Status"}
                </Label>
                <Badge variant="outline" className="capitalize font-normal">
                  {formData.status || "Available"}
                </Badge>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("property.floorNumber") || "Floor Number"}
                </Label>
                <p className="font-medium">{formData.floor_number || "Not specified"}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("property.sellerType") || "Seller Type"}
                </Label>
                <p className="font-medium capitalize">{formData.seller_type || "Owner"}</p>
              </div>
            </div>
          </div>
          
          {/* Specifications Section */}
          <div className="p-4 border-b">
            <h4 className="font-medium flex items-center mb-3">
              <FileText className="h-4 w-4 mr-2" />
              {t("property.specifications") || "Specifications"}
            </h4>
            
            <div className="flex justify-between">
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">{formData.area || 0}</span>
                <span className="text-xs text-muted-foreground ml-1">m²</span>
              </div>
              
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">{formData.rooms || 0}</span>
                <span className="text-xs text-muted-foreground ml-1">{t("property.rooms") || "Rooms"}</span>
              </div>
              
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">{formData.bathrooms || 0}</span>
                <span className="text-xs text-muted-foreground ml-1">{t("property.bathrooms") || "Bathrooms"}</span>
              </div>
            </div>
            
            {/* Features */}
            {formData.features.length > 0 && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t("property.features") || "Features"}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="font-normal">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Pricing Section */}
          <div className="p-4 border-b bg-muted/30">
            <h4 className="font-medium flex items-center mb-3">
              <DollarSign className="h-4 w-4 mr-2" />
              {t("property.pricing") || "Pricing"}
            </h4>
            
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">
                {formData.price && formData.currency 
                  ? formatPrice(formData.price, formData.currency)
                  : "Not specified"
                }
              </span>
              {formData.ad_type === 'rent' && (
                <span className="text-sm text-muted-foreground ml-1">
                  /{t("property.month") || "month"}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {formData.currency || "Currency not specified"}
            </p>
          </div>
          
          {/* Location Section */}
          <div className="p-4 border-b">
            <h4 className="font-medium flex items-center mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              {t("property.location") || "Location"}
            </h4>
            
            <p className="font-medium">{formData.location || "Address not specified"}</p>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {formData.governorate || "Governorate not specified"}
            </p>
            
            {(formData.latitude !== 0 || formData.longitude !== 0) && (
              <div className="text-xs text-muted-foreground mt-2 flex gap-3">
                <span>Lat: {formData.latitude.toFixed(6)}</span>
                <span>Lng: {formData.longitude.toFixed(6)}</span>
              </div>
            )}
          </div>
          
          {/* Description Section */}
          <div className="p-4">
            <h4 className="font-medium flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              {t("property.description") || "Description"}
            </h4>
            
            <p className="text-sm whitespace-pre-line">
              {formData.description || "No description provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("property.confirmationChecklist") || "Confirmation Checklist"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>{t("property.checklistMedia") || "Media files uploaded"}</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>{t("property.checklistDetails") || "Property details provided"}</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>{t("property.checklistPricing") || "Pricing information set"}</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>{t("property.checklistLocation") || "Location information added"}</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>{t("property.checklistDescription") || "Description completed"}</span>
          </div>
          
          <Separator className="my-2" />
          
          <p className="text-sm text-muted-foreground">
            {t("property.readyToSubmit") || "Your property listing is ready to be submitted for admin approval."}
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.back") || "Back"}</span>
        </Button>
        
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("property.creating") || "Creating..."}</span>
            </>
          ) : (
            <span>{t("property.createProperty") || "Create Property"}</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
