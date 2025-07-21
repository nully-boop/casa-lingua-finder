import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { office } from "@/services/api";
import HeaderOffice from "@/components/office/HeaderOffice";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Import step components
import MediaUploadStep from "@/components/property/steps/MediaUploadStep";
import PropertyDetailsStep from "@/components/property/steps/PropertyDetailsStep";
import PropertySpecsStep from "@/components/property/steps/PropertySpecsStep";
import PricingStep from "@/components/property/steps/PricingStep";
import LocationStep from "@/components/property/steps/LocationStep";
import DescriptionStep from "@/components/property/steps/DescriptionStep";
import SummaryStep from "@/components/property/steps/SummaryStep";
import SuccessStep from "@/components/property/steps/SuccessStep";

// Step types
type PropertyStep =
  | "media"
  | "details"
  | "specs"
  | "pricing"
  | "location"
  | "description"
  | "summary"
  | "success";

// Property form data interface
export interface PropertyFormData {
  // Media
  images: File[];
  videos: File[];

  // Details
  title: string;

  // Specifications
  property_type: string;
  area: number;
  rooms: number;
  bathrooms: number;
  floor_number: number;
  features: string[];
  furnishing: string;

  // Pricing
  price: number;
  currency: string;
  ad_type: string;
  status: string;
  seller_type: string;

  // Location
  location: string;
  governorate: string;
  latitude: number;
  longitude: number;

  // Description (final step)
  description: string;
}

const CreateProperty: React.FC = () => {
  const { t, isRTL, user, isAuthenticated, hasToken } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Current step state
  const [currentStep, setCurrentStep] = useState<PropertyStep>("media");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<PropertyFormData>({
    images: [],
    videos: [],
    title: "",
    description: "",
    property_type: "",
    area: 0,
    rooms: 0,
    bathrooms: 0,
    floor_number: 0,
    features: [],
    furnishing: "",
    price: 0,
    currency: "USD",
    ad_type: "",
    status: "available",
    seller_type: "owner",
    location: "",
    governorate: "",
    latitude: 0,
    longitude: 0,
  });

  // Check subscription status
  const { data: subscriptions } = useQuery({
    queryKey: ["active-subscriptions"],
    queryFn: async () => {
      if (!hasToken()) throw new Error("No authentication token found");
      const response = await office.getActiveSubscriptions();
      return response.data;
    },
    enabled: isAuthenticated && hasToken() && user?.type === "office",
  });

  const {
    data: officeData,
    isLoading: isLoadingOffice,
    isError: isProfileQueryError,
    error: profileQueryError,
  } = useQuery({
    queryKey: ["office-data"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      try {
        const response = await office.getOffice();
        return response.office;
      } catch (error) {
        console.error("Error fetching office data:", error);
        return null;
      }
    },
    enabled: isAuthenticated && hasToken() && user?.type === "office",
    retry: false,
  });

  // Check if user can create properties
  const hasActiveSubscription =
    subscriptions && Array.isArray(subscriptions) && subscriptions.length > 0;
  const freeAdsCount = officeData?.free_ads || 0;
  const canCreateProperty = hasActiveSubscription || freeAdsCount > 0;

  // Step navigation
  const steps: PropertyStep[] = [
    "media",
    "details",
    "specs",
    "pricing",
    "location",
    "description",
    "summary",
    "success",
  ];
  const currentStepIndex = steps.indexOf(currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  // Update form data
  const updateFormData = (updates: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Submit property
  const submitProperty = async () => {
    setIsSubmitting(true);

    try {
      // Use the office API to create property
      const response = await office.createProperty({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: formData.price,
        currency: formData.currency,
        latitude: formData.latitude,
        longitude: formData.longitude,
        area: formData.area,
        floor_number: formData.floor_number,
        ad_type: formData.ad_type,
        type: formData.property_type,
        position: formData.status,
        bathrooms: formData.bathrooms,
        rooms: formData.rooms,
        seller_type: formData.seller_type,
        furnishing: formData.furnishing,
        governorate: formData.governorate,
        features: formData.features,
        url: formData.images,
        Vurl: formData.videos,
      });

      console.log("Property created successfully:", response.data);
      setCurrentStep("success");
    } catch (error) {
      console.error("Error creating property:", error);
      let errorMessage = "Failed to create property. Please try again.";

      // Check if it's an Axios error with response data
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        errorMessage = error.response.data.message as string;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "media":
        return (
          <MediaUploadStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        );
      case "details":
        return (
          <PropertyDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case "specs":
        return (
          <PropertySpecsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case "pricing":
        return (
          <PricingStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case "location":
        return (
          <LocationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case "description":
        return (
          <DescriptionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case "summary":
        return (
          <SummaryStep
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={submitProperty}
            onBack={goToPreviousStep}
            isSubmitting={isSubmitting}
          />
        );
      case "success":
        return <SuccessStep />;
      default:
        return null;
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case "media":
        return t("property.uploadMedia") || "Upload Media";
      case "details":
        return t("property.propertyDetails") || "Property Details";
      case "specs":
        return t("property.specifications") || "Specifications";
      case "pricing":
        return t("property.pricingInfo") || "Pricing Information";
      case "location":
        return t("property.locationInfo") || "Location Information";
      case "description":
        return t("property.finalDescription") || "Property Description";
      case "summary":
        return t("property.propertySummary") || "Property Summary";
      case "success":
        return t("property.propertyCreated") || "Property Created";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderOffice
        profileData={officeData}
        isError={isProfileQueryError}
        error={profileQueryError}
      />

      {/* Subscription Check */}
      {!canCreateProperty && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {t("property.subscriptionRequired") ||
                      (isRTL
                        ? "تحتاج إلى اشتراك نشط أو إعلانات مجانية لإضافة عقارات جديدة"
                        : "You need an active subscription or free ads to add new properties")}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {isRTL
                      ? `الإعلانات المجانية المتبقية: ${freeAdsCount}`
                      : `Free ads remaining: ${freeAdsCount}`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-600 dark:hover:bg-yellow-900/20"
                  onClick={() => navigate("/subscriptions")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isRTL ? "الاشتراكات" : "Subscriptions"}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {canCreateProperty && (
        <div className="flex relative">
          {/* Vertical Progress Bar */}
          {currentStep !== "success" && (
            <div
              className={`fixed top-20 ${
                isRTL ? "right-4" : "left-4"
              } z-10 transition-all duration-500`}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Step indicator */}
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <div className="text-xs text-muted-foreground text-center mb-2">
                    {t("common.step")} {currentStepIndex + 1} {t("common.of")}{" "}
                    {steps.length - 1}
                  </div>
                  <div className="text-sm font-medium text-center">
                    {getStepTitle()}
                  </div>
                </div>

                {/* Vertical progress bar */}
                <div className="h-64 w-2 bg-muted rounded-full relative overflow-hidden">
                  <div
                    className="bg-primary w-2 rounded-full transition-all duration-500 absolute"
                    style={{
                      height: `${
                        (currentStepIndex / (steps.length - 2)) * 100
                      }%`,
                      [isRTL ? "bottom" : "top"]: 0,
                      transition:
                        "height 0.5s ease, top 0.5s ease, bottom 0.5s ease",
                    }}
                  />
                </div>

                {/* Step dots */}
                <div className="flex flex-col space-y-3">
                  {steps.slice(0, -1).map((step, index) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= currentStepIndex
                          ? "bg-primary"
                          : "bg-muted border-2 border-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div
            className={`flex-1 ${
              currentStep !== "success" ? (isRTL ? "pr-24" : "pl-24") : ""
            }`}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold mb-2">
                    {t("property.createProperty") || "Create Property"}
                  </h1>
                  <p className="text-muted-foreground">
                    {t("property.createPropertyDesc") ||
                      "Follow the steps to create your property listing"}
                  </p>
                </div>

                {/* Step content */}
                <Card className="animate-scale-in">
                  <CardContent className="py-7">
                    {renderStepContent()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProperty;
