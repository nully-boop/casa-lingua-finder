import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Eye, MessageSquare } from "lucide-react";

const SuccessStep: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="space-y-4">
        <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-green-700">
            {t("property.propertyCreated") || "Property Created Successfully!"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("property.propertyCreatedDesc") || "Your property has been submitted and is now waiting for admin approval."}
          </p>
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <h4 className="font-medium text-yellow-800">
            {t("property.pendingApproval") || "Pending Admin Approval"}
          </h4>
        </div>
        <p className="text-sm text-yellow-700">
          {t("property.approvalMessage") || "Your property listing will be reviewed by our admin team and published once approved. This usually takes 24-48 hours."}
        </p>
      </div>

      {/* What's Next */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">
          {t("property.whatsNext") || "What's Next?"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-primary" />
              <h5 className="font-medium">
                {t("property.adminReview") || "Admin Review"}
              </h5>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("property.adminReviewDesc") || "Our team will review your property details and media for quality and compliance."}
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className="font-medium">
                {t("property.approval") || "Approval"}
              </h5>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("property.approvalDesc") || "Once approved, your property will be published and visible to potential buyers/renters."}
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <h5 className="font-medium">
                {t("property.inquiries") || "Inquiries"}
              </h5>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("property.inquiriesDesc") || "Start receiving inquiries from interested buyers and renters through our platform."}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">
          {t("property.notifications") || "Stay Updated"}
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          {t("property.notificationsDesc") || "We'll notify you via email and SMS about the approval status and any inquiries."}
        </p>
        <div className="text-xs text-blue-600">
          ✓ {t("property.emailNotifications") || "Email notifications enabled"}<br />
          ✓ {t("property.smsNotifications") || "SMS notifications enabled"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>{t("property.goToDashboard") || "Go to Dashboard"}</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/create-property")}
            className="flex items-center space-x-2"
          >
            <span>{t("property.addAnotherProperty") || "Add Another Property"}</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost"
          onClick={() => navigate("/properties-office")}
          className="text-muted-foreground"
        >
          {t("property.viewAllProperties") || "View All My Properties"}
        </Button>
      </div>

      {/* Contact Support */}
      <div className="border-t pt-6">
        <p className="text-sm text-muted-foreground">
          {t("property.needHelp") || "Need help or have questions?"}{" "}
          <Button variant="link" className="p-0 h-auto text-sm">
            {t("property.contactSupport") || "Contact Support"}
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;
