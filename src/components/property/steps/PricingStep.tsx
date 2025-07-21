import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, DollarSign, Tag, TrendingUp } from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";
import { useToast } from "@/hooks/use-toast";

interface PricingStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PricingStep: React.FC<PricingStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const currencies = [
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'SYP', label: 'SYP - Syrian Pound' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
  ];

  const adTypes = [
    { value: 'rent', label: t("property.rent") || 'For Rent' },
    { value: 'sale', label: t("property.sale") || 'For Sale' },
  ];

  const statusOptions = [
    { value: 'available', label: t("property.available") || 'Available' },
    { value: 'rented', label: t("property.rented") || 'Rented' },
    { value: 'sold', label: t("property.sold") || 'Sold' },
  ];

  const sellerTypeOptions = [
    { value: 'owner', label: t("property.owner") || 'Owner' },
    { value: 'agent', label: t("property.agent") || 'Agent' },
    { value: 'developer', label: t("property.developer") || 'Developer' },
  ];

  const handleNext = () => {
    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Price Required",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (!formData.currency) {
      toast({
        title: "Currency Required",
        description: "Please select a currency",
        variant: "destructive",
      });
      return;
    }

    if (!formData.ad_type) {
      toast({
        title: "Ad Type Required",
        description: "Please select whether this is for rent or sale",
        variant: "destructive",
      });
      return;
    }

    if (!formData.status) {
      toast({
        title: "Status Required",
        description: "Please select the property status",
        variant: "destructive",
      });
      return;
    }

    if (!formData.seller_type) {
      toast({
        title: "Seller Type Required",
        description: "Please select the seller type",
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

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
        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {t("property.pricingTitle") || "Pricing Information"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.pricingDesc") || "Set the price and terms for your property"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-base font-medium">
            {t("property.price") || "Price"} *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="price"
              type="number"
              value={formData.price || ''}
              onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="pl-10"
              min="1"
            />
          </div>
          {formData.price > 0 && formData.currency && (
            <p className="text-sm text-muted-foreground">
              {formatPrice(formData.price, formData.currency)}
            </p>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.currency") || "Currency"} *
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => updateFormData({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectCurrency") || "Select currency"} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ad Type */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.adType") || "Ad Type"} *
          </Label>
          <Select
            value={formData.ad_type}
            onValueChange={(value) => updateFormData({ ad_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectAdType") || "Select ad type"} />
            </SelectTrigger>
            <SelectContent>
              {adTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.status") || "Property Status"} *
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => updateFormData({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectStatus") || "Select status"} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        status.value === 'available' ? 'bg-green-500' :
                        status.value === 'rented' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                    <span>{status.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seller Type */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("property.sellerType") || "Seller Type"} *
          </Label>
          <Select
            value={formData.seller_type}
            onValueChange={(value) => updateFormData({ seller_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("property.selectSellerType") || "Select seller type"} />
            </SelectTrigger>
            <SelectContent>
              {sellerTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pricing Tips */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>{t("property.pricingTips") || "Pricing Tips"}</span>
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t("property.pricingTip1") || "Research similar properties in your area"}</li>
          <li>• {t("property.pricingTip2") || "Consider the property's unique features and condition"}</li>
          <li>• {t("property.pricingTip3") || "Be realistic about market conditions"}</li>
          <li>• {t("property.pricingTip4") || "You can always adjust the price later"}</li>
        </ul>
      </div>

      {/* Price Summary */}
      {formData.price > 0 && formData.currency && formData.ad_type && (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2">
            {t("property.pricingSummary") || "Pricing Summary"}
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t("property.listingType") || "Listing Type"}:</span>
              <span className="font-medium">
                {formData.ad_type === 'rent' ? (t("property.rent") || 'For Rent') : (t("property.sale") || 'For Sale')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("property.price") || "Price"}:</span>
              <span className="font-medium text-lg">
                {formatPrice(formData.price, formData.currency)}
                {formData.ad_type === 'rent' && (
                  <span className="text-xs text-muted-foreground ml-1">
                    /{t("property.month") || "month"}
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("property.status") || "Status"}:</span>
              <span className="font-medium capitalize">{formData.status}</span>
            </div>
          </div>
        </div>
      )}

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

export default PricingStep;
