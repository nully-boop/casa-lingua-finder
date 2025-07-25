import IOffice from "@/interfaces/IOffice";
import IUser from "@/interfaces/IUser";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";
export type UserType = "buyer" | "seller";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  user: IUser | IOffice | null;
  login: (user: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasToken: () => boolean;
  isLanguageTransitioning: boolean;
  triggerLanguageAnimation: () => void;
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.properties": "Properties",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.language": "English",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.profileActions": "Profile Actions",
    "nav.mainNavigation": "Main Navigation",
    "nav.createProperty": "Create Property",
    "nav.subscriptions": "Subscriptions",
    "nav.light": "Light Mode",
    "nav.dark": "Dark Mode",
    "nav.currency": "Currency",
    "nav.favorites": "Favorites",
    "nav.owner": "Owner Dashboard",

    //Owner
    "owner.subtitle": "Manage your properties and track performance",
    "owner.addProperty": "Add Property",
    "owner.totalProperties": "Total Properties",
    "owner.activeListings": "Active Listings",
    "owner.totalValue": "Total Value",
    "owner.error.statsLoadFailed": "Failed to load dashboard statistics",
    "owner.noProperties": "No Properties Yet",
    "owner.noPropertiesDescription":
      "Start by adding your first property listing",
    "owner.addFirstProperty": "Add Your First Property",

    // Toast messages
    "toast.logoutSuccess": "Logout successful",
    "toast.seeYouAgain": "See you again!",
    "toast.logoutFailed": "Logout failed",
    "toast.error": "An error occurred",

    // Error messages
    "error.loadFailed": "Failed to load properties",
    "error.loadProfile": "Failed to load profile data",
    "error.tryAgain":
      "There was a problem fetching the properties. Please try again later.",
    "error.access": "You need to be logged in to access this page.",
    "error.access.feature": "You need to be logged in.",
    "error.failed": "Error",
    "error.favoriteActionFailed": "Failed to update favorite status",
    "error.specificLoadFailed": "Error: {message}",
    "err.error": "error",
    "rt.retry": "Retry",
    "accss.denied": "Access Denied",
    "error.notFound": "Oops! Page not found",

    // Hero Section
    "hero.title": "Find Your Perfect Property",
    "hero.subtitle":
      "Whether you're looking to buy, sell, or rent, we have the perfect property for you.",
    "hero.search": "Search properties...",
    "hero.location": "Location",
    "hero.type": "Property Type",
    "hero.price": "Price Range",
    "hero.searchBtn": "Search Properties",

    // Property Types
    "type.apartment": "Apartment",
    "type.villa": "Villa",
    "type.land": "Land",
    "type.office": "Office",
    "type.shop": "Shop",

    // Common
    "common.sale": "For Sale",
    "common.rent": "For Rent",
    "common.bedrooms": "Bedrooms",
    "common.bathrooms": "Bathrooms",
    "common.area": "Area",
    "common.price": "Price",
    "common.location": "Location",
    "common.description": "Description",
    "common.images": "Images",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View Details",
    "common.contact": "Contact Seller",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.loadingProperty": "Loading property details...",
    "common.back": "Back",
    "common.search": "Search",
    "common.loading.profile": "Loading profile...",
    "common.returnHome": "Return to home",
    "common.loadingProperties": "Loading properties data...",
    "common.retry": "Retry",
    "common.all": "All",
    "common.step": "Step",
    "common.of": "of",
    "common.user": "user",
    "common.yes": "Yes",
    "common.no": "No",
    "common.error": "Error",
    "common.success": "Success",
    "common.processing": "Processing...",

    // Authentication
    "auth.email": "Email",
    "auth.required": "Login Required",
    "auth.password": "Password",
    "auth.phone": "Phone",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Name",
    "auth.userType": "Account Type",
    "auth.buyer": "Buyer",
    "auth.seller": "Seller",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.forgotPassword": "Forgot Password?",
    "auth.resetPassword": "Reset Password",
    "auth.loginTitle": "Welcome Back",
    "auth.registerTitle": "Create Account",
    "auth.loginSubtitle": "Sign in to your account",
    "auth.registerSubtitle": "Join our property platform",
    "auth.noAccount": "Don't have an account?   ",
    "auth.haveAccount": "Already have an account?   ",
    "auth.accountType": "Account Type",
    "auth.userAccount": "User Account",
    "auth.officeAccount": "Office Account",
    "auth.userAccountDesc": "Login as a user to browse and search properties",
    "auth.officeAccountDesc":
      "Login as a real estate office to manage properties",
    "auth.selectAccountTypeDesc":
      "Select the type of account you want to create",
    "auth.enterYourName": "Enter your name",
    "auth.enterCredentials": "Enter your credentials",
    "auth.uploadDocument": "Upload required document",
    "auth.successMessage": "Your registration is complete",
    "auth.registrationComplete": "Registration Complete",
    "auth.officeRegistration": "Office Registration",
    "auth.userRegistration": "User Registration",
    "auth.enterPhone": "Enter your phone number",
    "auth.phonePlaceholder": "Enter phone number",
    "auth.phoneRequired": "Phone number is required",
    "auth.phoneInvalid": "Please enter a valid phone number",
    "auth.phoneHint": "Enter your phone number with country code",
    "auth.enterPassword": "Enter your password",
    "auth.loginToAccess": "Please login or register to access this feature",
    "auth.featureAccess": "Feature",
    "auth.getStarted": "Get Started",
    "auth.chooseAccountType": "Choose Account Type",
    "auth.free": "Free",
    "auth.professional": "Professional",
    "auth.userWelcome": "Join thousands of property seekers",
    "auth.officeWelcome": "Start listing your properties today",
    "auth.createAccount": "Create Account",
    "auth.loginExisting": "Login to Existing Account",
    "auth.userBenefit1": "Browse thousands of properties",
    "auth.userBenefit2": "Save your favorite listings",
    "auth.userBenefit3": "Get verified property information",
    "auth.officeBenefit1": "List unlimited properties",
    "auth.officeBenefit2": "Reach thousands of buyers",
    "auth.officeBenefit3": "Professional verification badge",
    "auth.selected": "Selected",
    "auth.confirmYourPassword": "Confirm your password",
    "auth.uploadDocumentDesc":
      "Please upload a PDF document for office verification",
    "auth.selectPdfFile": "Select PDF File",
    "auth.submitRegistration": "Submit Registration",
    "auth.registrationSubmitted": "Registration Submitted!",
    "auth.officeRegistrationMessage":
      "Your office registration request has been sent.",
    "auth.waitForApproval": "Please wait for admin approval.",
    "auth.goToLogin": "Go to Login",
    "auth.officeRequired":
      "Office authentication required to update property status.",
    "common.next": "Next",

    // Office registration
    "office.photo": "Office Photo",
    "office.photoDesc": "Upload a photo of your office (optional)",
    "office.uploadPhoto": "Upload office photo",
    "office.photoFormats": "PNG, JPG up to 10MB",
    "office.fileTooLarge": "File too large",
    "office.fileTooLargeDesc": "Please select a file smaller than 10MB",
    "office.selectPhoto": "Select Photo",
    "office.description": "Office Description",
    "office.descriptionDesc": "Describe your office and services (optional)",
    "office.descriptionPlaceholder":
      "Tell potential clients about your office, services, and expertise...",
    "office.location": "Office Location",
    "office.locationDesc": "Provide your office location (required)",
    "office.locationPlaceholder": "Enter your office address or coordinates",
    "office.manageProperties": "Manage and monitor your property listings",
    // Office Followers
    "office.followers": "Followers",
    "office.followersDesc": "Manage your office followers",
    "office.followersError": "Error",
    "office.followersErrorDesc": "Failed to fetch followers",
    "office.totalFollowers": "Total Followers",
    "office.filteredResults": "Filtered Results",
    "office.latestFollower": "Latest Follower",
    "office.searchFollowers": "Search followers by name or phone...",
    "office.noSearchResults": "No followers found",
    "office.noSearchResultsDesc": "Try adjusting your search terms",
    "office.noFollowers": "No followers yet",
    "office.noFollowersDesc":
      "Users will appear here when they follow your office",
    "office.followedOn": "Followed on",
    "common.clearSearch": "Clear Search",

    // Office Requests
    "requests.title": "Property Requests",
    "requests.subtitle": "Manage your property submission requests",
    "requests.pending": "Pending",
    "requests.accepted": "Accepted",
    "requests.rejected": "Rejected",
    "requests.fetchError": "Error",
    "requests.fetchErrorDesc": "Failed to fetch property requests",
    "requests.submittedOn": "Submitted on",
    "requests.lastUpdated": "Updated",
    "requests.noPending": "No pending requests",
    "requests.noPendingDesc": "You don't have any pending property requests yet.",
    "requests.noAccepted": "No accepted requests",
    "requests.noAcceptedDesc": "You don't have any accepted property requests yet.",
    "requests.noRejected": "No rejected requests",
    "requests.noRejectedDesc": "You don't have any rejected property requests yet.",

    // Location
    "location.required": "Location required",
    "location.requiredDesc": "Please provide your location",
    "location.notSupported": "Location not supported",
    "location.notSupportedDesc": "Geolocation is not supported by this browser",
    "location.success": "Location obtained",
    "location.successDesc": "Your current location has been set",
    "location.error": "Location Error",
    "location.permissionDenied": "Location access denied",
    "location.unavailable": "Location information unavailable",
    "location.timeout": "Location request timed out",
    "location.getting": "Getting location...",
    "location.current": "Use Current Location",
    "location.pickOnMap": "Pick on Map",
    "location.mapPicker": "Map Picker",
    "location.mapPickerDesc": "Map picker will be available soon",

    // Property creation
    "property.createProperty": "Create Property",
    "property.createPropertyDesc":
      "Follow the steps to create your property listing",
    "property.uploadMedia": "Upload Media",
    "property.propertyDetails": "Property Details",
    "property.specifications": "Specifications",
    "property.pricingInfo": "Pricing Information",
    "property.locationInfo": "Location Information",
    "property.propertyCreated": "Property Created",

    // Media upload
    "property.uploadMediaTitle": "Upload Property Media",
    "property.uploadMediaDesc":
      "Add images and videos to showcase your property (optional)",
    "property.images": "Images",
    "property.videos": "Videos",
    "property.addImages": "Add Images",
    "property.addVideos": "Add Videos",
    "property.uploadGuidelines": "Upload Guidelines",
    "property.guideline1": "Images: JPG, PNG, WebP (max 10MB each)",
    "property.guideline2": "Videos: MP4, MOV, AVI (max 100MB each)",
    "property.guideline3": "Maximum 20 images and 5 videos",
    "property.guideline4": "High-quality media helps attract more buyers",

    // Property details
    "property.propertyDetailsTitle": "Property Details",
    "property.propertyDetailsDesc":
      "Add title and description for your property",
    "property.title": "Property Title",
    "property.description": "Property Description",
    "property.generateTitle": "Generate Title",
    "property.generateDescription": "Generate Description",
    "property.generating": "Generating...",
    "property.aiGenerationNote":
      "Upload images or videos to enable AI generation",
    "property.titlePlaceholder": "Enter property title",
    "property.descriptionPlaceholder": "Describe your property in detail...",
    "property.writingTips": "Writing Tips",
    "property.tip1": "Use descriptive words that highlight unique features",
    "property.tip2": "Mention nearby amenities and transportation",
    "property.tip3": "Include information about the neighborhood",
    "property.tip4": "Be honest and accurate in your description",

    // Property specifications
    "property.specificationsTitle": "Property Specifications",
    "property.specificationsDesc":
      "Provide detailed specifications for your property",
    "property.propertyType": "Property Type",
    "property.selectPropertyType": "Select property type",
    "property.apartment": "Apartment",
    "property.villa": "Villa",
    "property.office": "Office",
    "property.land": "Land",
    "property.commercial": "Commercial",
    "property.farm": "Farm",
    "property.building": "Building",
    "property.chalet": "Chalet",
    "property.area": "Area",
    "property.rooms": "Number of Rooms",
    "property.bathrooms": "Number of Bathrooms",
    "property.floorNumber": "Floor Number",
    "property.features": "Features",
    "property.featuresPlaceholder":
      "e.g., Swimming pool, Garden, Parking, Balcony",
    "property.featuresNote": "Separate features with commas",
    "property.furnishing": "Furnishing",
    "property.selectFurnishing": "Select furnishing",
    "property.furnished": "Furnished",
    "property.unfurnished": "Unfurnished",
    "property.semiFurnished": "Semi-Furnished",
    "property.commonFeatures": "Common Features",

    // Pricing
    "property.pricingTitle": "Pricing Information",
    "property.pricingDesc": "Set the price and terms for your property",
    "property.price": "Price",
    "property.currency": "Currency",
    "property.selectCurrency": "Select currency",
    "property.adType": "Ad Type",
    "property.selectAdType": "Select ad type",
    "property.rent": "For Rent",
    "property.sale": "For Sale",
    "property.status": "Property Status",
    "property.selectStatus": "Select status",
    "property.available": "Available",
    "property.rented": "Rented",
    "property.sold": "Sold",
    "property.month": "month",
    "property.pricingTips": "Pricing Tips",
    "property.pricingTip1": "Research similar properties in your area",
    "property.pricingTip2":
      "Consider the property's unique features and condition",
    "property.pricingTip3": "Be realistic about market conditions",
    "property.pricingTip4": "You can always adjust the price later",
    "property.pricingSummary": "Pricing Summary",
    "property.listingType": "Listing Type",
    "property.sellerType": "Seller Type",
    "property.selectSellerType": "Select seller type",
    "property.owner": "Owner",
    "property.agent": "Agent",
    "property.developer": "Developer",

    // Location
    "property.locationTitle": "Location Information",
    "property.locationDesc": "Specify the exact location of your property",
    "property.address": "Property Address",
    "property.addressPlaceholder": "Enter full address",
    "property.governorate": "Governorate",
    "property.selectGovernorate": "Select governorate",
    "property.latitude": "Latitude",
    "property.longitude": "Longitude",
    "property.useCurrentLocation": "Use Current Location",
    "property.gettingLocation": "Getting Location...",
    "property.pickOnMap": "Pick on Map",
    "property.coordinates": "Coordinates",
    "property.locationTips": "Location Tips",
    "property.locationTip1": "Provide the exact address for better visibility",
    "property.locationTip2": "Include nearby landmarks or metro stations",
    "property.locationTip3":
      "Accurate coordinates help buyers find your property",
    "property.locationTip4": "Double-check the location before submitting",
    "property.creating": "Creating...",

    // Final description step
    "property.finalDescription": "Property Description",
    "property.finalDescriptionTitle": "Property Description & Summary",
    "property.finalDescriptionDesc":
      "Review your property details and create a compelling description",
    "property.propertySummary": "Property Summary",
    "property.pricing": "Pricing",
    "property.media": "Media",
    "property.descriptionTips": "Description Tips",
    "property.descTip1": "Highlight unique features and selling points",
    "property.descTip2": "Mention nearby amenities and transportation",
    "property.descTip3": "Describe the lifestyle and benefits",
    "property.descTip4": "Use compelling language to attract buyers",

    // Summary step
    "property.finalReview": "Final Review",
    "property.finalReviewDesc":
      "Review your property details before submission",
    "property.basicDetails": "Basic Details",
    "property.files": "files",
    "property.confirmationChecklist": "Confirmation Checklist",
    "property.checklistMedia": "Media files uploaded",
    "property.checklistDetails": "Property details provided",
    "property.checklistPricing": "Pricing information set",
    "property.checklistLocation": "Location information added",
    "property.checklistDescription": "Description completed",
    "property.readyToSubmit":
      "Your property listing is ready to be submitted for admin approval.",
    "property.descriptionStepDesc":
      "Create a compelling description for your property",

    // Success step
    "property.propertyCreatedDesc":
      "Your property has been submitted and is now waiting for admin approval.",
    "property.pendingApproval": "Pending Admin Approval",
    "property.approvalMessage":
      "Your property listing will be reviewed by our admin team and published once approved. This usually takes 24-48 hours.",
    "property.whatsNext": "What's Next?",
    "property.adminReview": "Admin Review",
    "property.adminReviewDesc":
      "Our team will review your property details and media for quality and compliance.",
    "property.approval": "Approval",
    "property.approvalDesc":
      "Once approved, your property will be published and visible to potential buyers/renters.",
    "property.inquiries": "Inquiries",
    "property.inquiriesDesc":
      "Start receiving inquiries from interested buyers and renters through our platform.",
    "property.notifications": "Stay Updated",
    "property.notificationsDesc":
      "We'll notify you via email and SMS about the approval status and any inquiries.",
    "property.emailNotifications": "Email notifications enabled",
    "property.smsNotifications": "SMS notifications enabled",
    "property.goToDashboard": "Go to Dashboard",
    "property.addAnotherProperty": "Add Another Property",
    "property.viewAllProperties": "View All My Properties",
    "property.needHelp": "Need help or have questions?",
    "property.contactSupport": "Contact Support",

    // Property Status Modal
    "property.updateStatus": "Update Property Status",
    "property.updateStatusDesc":
      "Change the status of this property to reflect its current availability.",
    "property.propertyInfo": "Property Information",
    "property.currentStatus": "Current Status",
    "property.newStatus": "New Status",
    "property.newStatusPreview": "New status will be",
    "property.statusUpdated": "Status Updated",
    "property.statusUpdatedDesc":
      "Property status has been updated successfully.",
    "property.statusUpdateError":
      "Failed to update property status. Please try again.",
    "property.updating": "Updating...",

    //Settings
    "stt.manageTitle": "Manage your account and preferences",
    "stt.appearance": "Appearance",
    "stt.dangerZone": "Danger Zone",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.stats": "Your Statistics",
    "dashboard.properties": "Properties",
    "dashboard.views": "Total Views",
    "dashboard.inquiries": "Inquiries",
    "dashboard.addProperty": "Add New Property",
    "dashboard.myProperties": "My Properties",
    "dashboard.recentProperties": "Recent Properties",
    "dashboard.manageProperties":
      "Manage your properties and monitor performance",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.viewAnalytics": "View Analytics",

    // Dashboard Charts
    "dashboard.analytics": "Analytics & Insights",
    "dashboard.viewsTrend": "Views & Inquiries Trend",
    "dashboard.propertyTypes": "Property Type Distribution",
    "dashboard.revenueTrend": "Revenue Trend",
    "dashboard.propertyStatus": "Property Status Overview",
    "dashboard.inquirySources": "Inquiry Sources",
    "dashboard.kpiMetrics": "Key Performance Metrics",
    "dashboard.viewsLabel": "Views",
    "dashboard.inquiriesLabel": "Inquiries",
    "dashboard.revenue": "Revenue",
    "dashboard.commission": "Commission",
    "dashboard.messages": "Messages",
    "dashboard.responseRate": "Response Rate",
    "dashboard.excellent": "Excellent",
    "dashboard.thisWeek": "this week",
    "dashboard.active": "active",
    "dashboard.subscriptionRequired":
      "You need an active subscription to add new properties",
    "dashboard.freeAdsRemaining": "Free ads remaining",
    "dashboard.subscriptions": "Subscriptions",
    "dashboard.subscriptionExpiresSoon": "Your subscription expires soon",
    "dashboard.expiresOn": "Expires on",
    "dashboard.renewSubscription": "Renew Subscription",
    "dashboard.notSpecified": "Not specified",
    "dashboard.error": "Error",
    "dashboard.errorPropertyCount":
      "Failed to get property count. Please try again.",
    "dashboard.errorViews": "Failed to get views. Please try again.",
    "dashboard.editProperty": "Edit Property",
    "dashboard.editingProperty": "Editing property",
    "dashboard.propertyDeleted": "Property Deleted",
    "dashboard.deletedSuccessfully": "has been deleted successfully",
    "dashboard.deleteFailed": "Delete Failed",
    "dashboard.deleteFailedDesc":
      "Failed to delete property. Please try again.",
    "dashboard.clickToView": "Click to view",

    // Subscriptions
    "subscriptions.title": "Subscriptions",
    "subscriptions.manage":
      "Manage your subscriptions and subscription requests",
    "subscriptions.requestNew": "Request New Subscription",
    "subscriptions.monthly": "Monthly Subscription",
    "subscriptions.yearly": "Yearly Subscription",
    "subscriptions.oneMonth": "One month subscription",
    "subscriptions.oneYear": "One year subscription",
    "subscriptions.perMonth": "per month",
    "subscriptions.perYear": "per year",
    "subscriptions.active": "Active",
    "subscriptions.pending": "Pending",
    "subscriptions.rejected": "Rejected",
    "subscriptions.expires": "Expires",
    "subscriptions.requested": "Requested",
    "subscriptions.rejectedOn": "Rejected",
    "subscriptions.noActive": "No Active Subscriptions",
    "subscriptions.noActiveDesc":
      "You don't have any active subscriptions currently",
    "subscriptions.noPending": "No Pending Requests",
    "subscriptions.noPendingDesc":
      "You don't have any pending subscription requests",
    "subscriptions.noRejected": "No Rejected Requests",
    "subscriptions.noRejectedDesc":
      "You don't have any rejected subscription requests",
    "subscriptions.requestSent": "Request Sent",
    "subscriptions.requestSentDesc":
      "Subscription request sent successfully. Wait for admin approval.",
    "subscriptions.requestError": "Failed to send subscription request",
    "subscriptions.loading": "Loading...",
    "subscriptions.notSpecified": "Not specified",
    "subscriptions.invalidDate": "Invalid date",

    // Office Profile
    "office.verified": "Verified",
    "office.pending": "Pending",
    "office.follow": "Follow",
    "office.following": "Following",
    "office.followersCount": "followers",
    "office.views": "views",
    "office.memberSince": "Member since",
    "office.properties": "Properties",
    "office.propertiesDesc":
      "Properties from this office will be displayed here.",
    "office.notFound": "Office Not Found",
    "office.notFoundDesc":
      "The office you're looking for doesn't exist or has been removed.",
    "office.followSuccess": "Success",
    "office.followSuccessDesc": "You are now following this office",
    "office.followError": "Failed to follow office",
    "office.propertiesError": "Error loading properties",
    "office.propertiesErrorDesc": "Failed to load properties from this office",
    "office.noProperties": "No properties yet",
    "office.noPropertiesDesc": "This office hasn't listed any properties yet.",
    "office.userOnly": "User Only",
    "office.userOnlyDesc": "Only users can follow offices",

    // Admin Panel
    "admin.panel": "Admin Panel",
    "admin.welcome": "Welcome back",
    "admin.online": "Online",
    "admin.totalUsers": "Total Users",
    "admin.totalOffices": "Total Offices",
    "admin.totalProperties": "Total Properties",
    "admin.pendingApprovals": "Pending Approvals",
    "admin.activeSubscriptions": "Active Subscriptions",
    "admin.monthlyRevenue": "Monthly Revenue",
    "admin.fromLastMonth": "from last month",
    "admin.quickActions": "Quick Actions",
    "admin.recentActivity": "Recent Activity",
    "admin.manageUsers": "Manage Users",
    "admin.manageUsersDesc": "View and manage user accounts",
    "admin.manageOffices": "Manage Offices",
    "admin.manageOfficesDesc": "Approve and manage office accounts",
    "admin.manageProperties": "Manage Properties",
    "admin.managePropertiesDesc": "Review and moderate property listings",
    "admin.subscriptions": "Subscriptions",
    "admin.subscriptionsDesc": "Manage subscription plans and requests",
    "admin.analytics": "Analytics",
    "admin.analyticsDesc": "View detailed analytics and reports",
    "admin.settings": "System Settings",
    "admin.settingsDesc": "Configure system settings and preferences",
    "admin.userRegistered": "New user registered",
    "admin.officeApproved": "Office account approved",
    "admin.propertySubmitted": "New property submitted for review",
    "admin.subscriptionPurchased": "Subscription purchased",
    "admin.pending": "Pending",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.description": "Description",
    "admin.submittedOn": "Submitted on",
    "admin.downloadDocument": "Download Document",
    "admin.fetchError": "Failed to fetch data",
    "admin.approveError": "Failed to approve",
    "admin.rejectError": "Failed to reject",
    "admin.officeRejected": "Office rejected successfully",
    "admin.propertyApproved": "Property approved successfully",
    "admin.propertyRejected": "Property rejected successfully",
    "admin.noPendingOffices": "No Pending Offices",
    "admin.noPendingOfficesDesc": "All office requests have been processed",
    "admin.noPendingProperties": "No Pending Properties",
    "admin.noPendingPropertiesDesc":
      "All property requests have been processed",
    "admin.pendingOfficeRequests": "Review and approve pending office requests",
    "admin.pendingPropertyRequests":
      "Review and approve pending property requests",
    "admin.contactInfo": "Contact Information",
    "admin.phoneNumber": "Phone Number",
    "admin.location": "Location",
    "admin.documentation": "Documentation",
    "admin.verificationDocument": "Verification Document",
    "admin.awaitingReview": "Awaiting Admin Review",

    // AI Suggestions for Offices
    "admin.aiAnalyzing": "AI is analyzing ...",
    "admin.aiSuggestion": "AI Analysis",
    "admin.aiError": "AI Error",
    "admin.confidence": "Confidence",
    "admin.aiReasons": "Analysis Reasons",
    "admin.documentAnalysis": "Document Analysis",
    "admin.documentValid": "Document Valid",
    "admin.documentType": "Document Type",
    "admin.documentIssues": "Issues",
    "admin.locationAnalysis": "Location Analysis",
    "admin.locationValid": "Location Valid",
    "admin.locationType": "Location Type",
    "admin.locationIssues": "Issues",
    "admin.profileAnalysis": "Profile Analysis",
    "admin.profileCompleteness": "Profile Completeness",
    "admin.missingFields": "Missing Fields",
    "admin.suggestions": "Suggestions",
    "admin.aiReject": "Reject",
    "admin.confident": "Confident",
    "admin.priceAnalysis": "Price analysis",
    "admin.currentPrice": "Current price",
    "admin.suggestedPrice": "Suggested price",
    "admin.priceDifference": "Price difference",
    "admin.marketComparison": "Market comparison",

    "admin.propertyDetails": "Property Details",
    "admin.specifications": "Specifications",
    "admin.authError": "Authentication failed. Please login again.",
    "admin.permissionError":
      "You don't have permission to perform this action.",
    "admin.notFoundError": "Request not found.",
    "admin.aiSummary": "AI Summary",
    "admin.manageSubscriptions": "Manage Subscriptions",
    "admin.pendingSubscriptions": "Pending Subscriptions",
    "admin.pendingSubscriptionsDesc":
      "Review and approve pending subscription requests",
    "admin.noPendingSubscriptions": "No Pending Subscriptions",
    "admin.noPendingSubscriptionsDesc":
      "All subscription requests have been processed",
    "admin.subscriptionApproved": "Subscription approved successfully",
    "admin.subscriptionRejected": "Subscription rejected successfully",
    "admin.subscriptionDetails": "Subscription Details",
    "admin.officeInfo": "Office Information",
    "admin.officeName": "Office Name",
    "admin.officeStatus": "Office Status",
    "admin.freeAds": "Free Ads",
    "admin.followers": "Followers",
    "admin.views": "Views",
    "admin.awaitingSubscriptionReview": "Awaiting Subscription Review",
    "subscription.monthly": "Monthly",
    "subscription.yearly": "Yearly",
    "subscription.premium": "Premium",
    "subscription.price": "Subscription Price",
    "subscription.type": "Subscription Type",

    // AI Chat
    "aiChat.title": "AI Assistant",
    "aiChat.globalDescription": "Ask me about our properties!",
    "aiChat.apiKeyPlaceholder": "Enter your Gemini API key",
    "aiChat.startConversation": "Start a conversation by typing a message",
    "aiChat.inputPlaceholder": "Ask about properties...",
    "aiChat.error": "Sorry, I encountered an error. Please try again.",
    "aiChat.propertyVoiceChat": "Property Voice Chat",
    "aiChat.globalVoiceChat": "AI Voice Assistant",
    "aiChat.propertyVoiceChatDescription": "Ask questions about this property",
    "aiChat.globalVoiceChatDescription":
      "Ask about our properties and real estate services",
    "aiChat.enterApiKey": "Enter your Gemini API Key",
    "aiChat.apiKeyRequired": "API key is required to start voice chat",
    "aiChat.liveVoiceChat": "Live Voice Chat",
    "aiChat.liveVoiceChatDescription":
      "Real-time voice conversation with AI assistant",
    "aiChat.connected": "Connected",
    "aiChat.disconnected": "Disconnected",
    "aiChat.speakNow":
      "Speak now... The AI is listening and will respond with voice.",
    "aiChat.clickToStart":
      "Click the microphone to start a voice conversation with the AI assistant.",

    // Add Property
    "add.title": "Add New Property",
    "add.propertyTitle": "Property Title",
    "add.propertyType": "Property Type",
    "add.listingType": "Listing Type",
    "add.price": "Price",
    "add.city": "City",
    "add.area": "Area",
    "add.address": "Full Address",
    "add.bedrooms": "Number of Bedrooms",
    "add.bathrooms": "Number of Bathrooms",
    "add.size": "Size (m²)",
    "add.description": "Property Description",
    "add.images": "Property Images",
    "add.uploadImages": "Upload Images",

    //props
    "props.empty": "No properties available",
    "props.featured": "Featured Properties",
    "props.discover": "Discover the best properties available",
    "props.viewAll": "View All Properties",
    "props.changeFilters": "Try adjusting your filters for better results",

    "m.month": "/month",

    // Search & Filters
    "search.results": "Search Results",
    "search.filters": "Filters",
    "search.priceRange": "Price Range",
    "search.minPrice": "Min Price",
    "search.maxPrice": "Max Price",
    "search.applyFilters": "Apply Filters",
    "search.clearFilters": "Clear Filters",
    "search.sortBy": "Sort By",
    "search.newest": "Newest First",
    "search.oldest": "Oldest First",
    "search.priceLow": "Price: Low to High",
    "search.priceHigh": "Price: High to Low",

    //Fav
    "fav.loading": "Loading favorites...",
    "fav.error": "Failed to load favorites:",
    "fav.error.update": "Error updating favorites",
    "fav.properties": "Favorite Properties",
    "fav.emtpy.title": "No Favorite Properties",
    "fav.empty": "You haven't added any properties to your favorites yet.",
    "fav.added": "Added to favorites",
    "fav.removed": "Removed from favorites",
    "fav.updated": "Updated",
    "brs.browse": "Browse Properties",

    // Map and Route
    "map.calculatingRoute": "Calculating route...",
    "map.locationPermissionRequired": "Location Permission Required",
    "map.enableLocationMessage":
      "Please enable location access to see the route to this property.",
    "map.tryAgain": "Try Again",
    "map.routeError": "Route Error",
    "map.retry": "Retry",
    "map.yourLocation": "Your Location",
    "map.destination": "Property Location",
    "map.geolocationNotSupported":
      "Geolocation is not supported by this browser.",
    "map.noRouteFound": "No route could be found.",
    "map.networkError":
      "Network Error: Could not connect to the routing service. Please check your internet connection.",
    "map.unknownError": "An unknown error occurred.",
    "map.locationRequired": "Your location is required to get directions.",
    "map.propertyLocation": "Property Location",

    // Form validation and messages
    "form.passwordMismatch": "Password mismatch",
    "form.passwordsDoNotMatch": "Passwords do not match",
    "form.registrationFailed": "Registration failed",
    "form.checkInputAndTryAgain": "Please check your input and try again",
    "form.propertyAddedSuccessfully": "Property added successfully",
    "form.propertyListingPublished": "Your property listing has been published",
    "form.failedToAddProperty": "Failed to add property",
    "form.errorOccurredTryAgain": "An error occurred, please try again",
    "form.basicInformation": "Basic Information",
    "form.enterPropertyTitleEnglish": "Enter property title in English",
    "form.english": "English",
    "form.arabic": "Arabic",

    // Currency and loading states
    "currency.converting": "Converting...",
    "currency.loading": "...",

    // Voice chat
    "voice.thinking": "Thinking...",
    "voice.aiSpeaking": "AI Speaking...",
    "voice.listening": "Listening...",
    "voice.clickToSpeak": "Click to speak",
    "voice.startVoiceChat": "Start Voice Chat",
    "voice.endConversation": "End",
    "voice.testVoice": "Test Voice",

    // Amenities
    "amenities.swimmingPool": "Swimming Pool",
    "amenities.gymFitness": "Gym & Fitness Center",
    "amenities.coveredParking": "Covered Parking",
    "amenities.security24": "24/7 Security",
    "amenities.balconyView": "Balcony with View",
    "amenities.builtInWardrobes": "Built-in Wardrobes",
    "amenities.centralAC": "Central AC",
    "amenities.conciergeService": "Concierge Service",

    // Property stats
    "property.views": "Views",
    "property.active": "Active",
    "property.listed": "Listed",
    "property.subscriptionRequired": "Subscription Required",

    // Search and filters
    "search.adType": "Ad Type",
    "search.selectAdType": "Select ad type",
    "search.allAdTypes": "All Ad Types",
    "search.mostViewed": "Most Viewed",

    // Syrian Governorates
    "location.damascus": "Damascus",
    "location.aleppo": "Aleppo",
    "location.homs": "Homs",
    "location.hama": "Hama",
    "location.lattakia": "Lattakia",
    "location.tartus": "Tartus",
    "location.idlib": "Idlib",
    "location.daraa": "Daraa",
    "location.sweida": "As-Sweida",
    "location.quneitra": "Quneitra",
    "location.raqqa": "Raqqa",
    "location.deir_ez_zor": "Deir ez-Zor",
    "location.hasakah": "Al-Hasakah",
    "location.damascus_countryside": "Damascus Countryside",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.properties": "العقارات",
    "nav.dashboard": "لوحة التحكم",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",
    "nav.language": "العربية",
    "nav.profile": "الملف الشخصي",
    "nav.settings": "الإعدادات",
    "nav.profileActions": "إجراءات الملف الشخصي",
    "nav.mainNavigation": "التنقل الرئيسي",
    "nav.createProperty": "إضافة عقار",
    "nav.subscriptions": "الاشتراكات",
    "nav.light": "الوضع الفاتح",
    "nav.dark": "الوضع الداكن",
    "nav.currency": "العملة",
    "nav.favorites": "المفضلة",
    "nav.owner": "لوحة تحكم المالك",

    //Owner
    "owner.subtitle": "إدارة الممتلكات الخاصة بك وتتبع الأداء",
    "owner.addProperty": "أضف عقار",
    "owner.totalProperties": "العقارات الكلية",
    "owner.activeListings": "القوائم النشطة",
    "owner.totalValue": "القيمة الكلية",
    "owner.error.statsLoadFailed": "فشل في تحميل إحصائيات لوحة التحكم",
    "owner.noProperties": "لا توجد عقارات بعد",
    "owner.noPropertiesDescription": "ابدأ بإضافة أول عقار لك",
    "owner.addFirstProperty": "أضف عقارك الأول",

    // Toast messages
    "toast.logoutSuccess": "تم تسجيل الخروج بنجاح",
    "toast.seeYouAgain": "نراك قريباً!",
    "toast.logoutFailed": "فشل في تسجيل الخروج",
    "toast.error": "حدث خطأ",

    // Error messages
    "error.loadFailed": "فشل تحميل العقار",
    "error.loadProfile": "فشل تحميل ملفك الشخصي",
    "error.tryAgain":
      "حدثت مشكلة في جلب العقارات. يرجى المحاولة مرة أخرى في وقت لاحق.",
    "error.access": "يجب تسجيل الدخول للوصول إلى هذه الصفحة.",
    "error.access.feature": "يجب عليك تسجيل الدخول.",
    "error.failed": "خطأ",
    "error.favoriteActionFailed": "فشل في تحديث حالة المفضلة",
    "error.specificLoadFailed": "خطأ: {message}",
    "err.error": "حدث خطأ",
    "rt.retry": "أعد المحاولة",
    "accss.denied": "الوصول مرفوض",
    "error.notFound": "أسف! الصفحة غير موجودة",

    // Hero Section
    "hero.title": "اعثر على العقار المثالي",
    "hero.subtitle":
      "سواء كنت تبحث عن الشراء أو البيع أو الإيجار، فلدينا العقار المثالي لك.",
    "hero.search": "البحث عن العقارات...",
    "hero.location": "الموقع",
    "hero.type": "نوع العقار",
    "hero.price": "نطاق السعر",
    "hero.searchBtn": "البحث عن العقارات",

    // Property Types
    "type.apartment": "شقة",
    "type.villa": "فيلا",
    "type.land": "أرض",
    "type.office": "مكتب",
    "type.shop": "محل تجاري",

    // Common
    "common.sale": "للبيع",
    "common.rent": "للإيجار",
    "common.bedrooms": "غرف النوم",
    "common.bathrooms": "دورات المياه",
    "common.area": "المساحة",
    "common.price": "السعر",
    "common.location": "الموقع",
    "common.description": "الوصف",
    "common.images": "الصور",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.view": "عرض التفاصيل",
    "common.contact": "اتصل بالبائع",
    "common.close": "إغلاق",
    "common.loading": "جار التحميل...",
    "common.loadingProperty": "جاري تحميل معلومات العقار ...",
    "common.back": "العودة",
    "common.search": "بحث",
    "common.loading.profile": "تحميل ملفك الشخصي ...",
    "common.returnHome": "العودة إلى الصفحة الرئيسية",
    "common.loadingProperties": "جاري تحميل بيانات العقارات...",
    "common.retry": "أعد المحاولة",
    "common.all": "الكل",
    "common.step": "خطوة",
    "common.of": "من",
    "common.user": "مستخدم",
    "common.next": "التالي",
    "common.clearSearch": "مسح البحث",
    "common.yes": "نعم",
    "common.no": "لا",
    "common.error": "خطأ",
    "common.success": "تم بنجاح",
    "common.processing": "تتم المعالجة...",

    // Authentication
    "auth.email": "البريد الإلكتروني",
    "auth.required": "تسجيل الدخول مطلوب",
    "auth.phone": "رقم الهاتف",
    "auth.password": "كلمة المرور",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.name": "الاسم",
    "auth.userType": "نوع الحساب",
    "auth.buyer": "مشتري",
    "auth.seller": "بائع",
    "auth.login": "تسجيل الدخول",
    "auth.register": "إنشاء حساب",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.resetPassword": "إعادة تعيين كلمة المرور",
    "auth.loginTitle": "مرحباً بعودتك",
    "auth.registerTitle": "إنشاء حساب جديد",
    "auth.loginSubtitle": "تسجيل الدخول إلى حسابك",
    "auth.registerSubtitle": "انضم إلى منصة العقارات الخاصة بنا",
    "auth.noAccount": "ليس لديك حساب؟   ",
    "auth.haveAccount": "ألديك حساب؟   ",
    "auth.accountType": "نوع الحساب",
    "auth.userAccount": "حساب مستخدم",
    "auth.officeAccount": "حساب مكتب عقاري",
    "auth.userAccountDesc": "تسجيل الدخول كمستخدم لتصفح والبحث عن العقارات",
    "auth.officeAccountDesc": "تسجيل الدخول كمكتب عقاري لإدارة العقارات",
    "auth.selectAccountTypeDesc": "اختر نوع الحساب الذي تريد إنشاؤه",
    "auth.enterYourName": "أدخل اسمك",
    "auth.enterCredentials": "أدخل بيانات الاعتماد الخاصة بك",
    "auth.uploadDocument": "رفع الوثيقة المطلوبة",
    "auth.successMessage": "تم إكمال التسجيل الخاص بك",
    "auth.registrationComplete": "اكتمل التسجيل",
    "auth.officeRegistration": "تسجيل المكتب العقاري",
    "auth.userRegistration": "تسجيل المستخدم",
    "auth.enterPhone": "أدخل رقم هاتفك",
    "auth.phonePlaceholder": "أدخل رقم الهاتف",
    "auth.phoneRequired": "رقم الهاتف مطلوب",
    "auth.phoneInvalid": "يرجى إدخال رقم هاتف صحيح",
    "auth.phoneHint": "أدخل رقم هاتفك مع رمز البلد",
    "auth.enterPassword": "أدخل كلمة المرور الخاصة بك",
    "auth.loginToAccess":
      "يرجى تسجيل الدخول أو إنشاء حساب للوصول إلى هذه الميزة",
    "auth.featureAccess": "الميزة",
    "auth.getStarted": "ابدأ الآن",
    "auth.chooseAccountType": "اختر نوع الحساب",
    "auth.free": "مجاني",
    "auth.professional": "احترافي",
    "auth.userWelcome": "انضم إلى آلاف الباحثين عن العقارات",
    "auth.officeWelcome": "ابدأ في إدراج عقاراتك اليوم",
    "auth.createAccount": "إنشاء حساب",
    "auth.loginExisting": "تسجيل الدخول إلى حساب موجود",
    "auth.userBenefit1": "تصفح آلاف العقارات",
    "auth.userBenefit2": "احفظ قوائمك المفضلة",
    "auth.userBenefit3": "احصل على معلومات عقارية موثقة",
    "auth.officeBenefit1": "أدرج عقارات غير محدودة",
    "auth.officeBenefit2": "اوصل إلى آلاف المشترين",
    "auth.officeBenefit3": "شارة التحقق المهنية",
    "auth.selected": "محدد",
    "auth.confirmYourPassword": "تأكيد كلمة المرور",
    "auth.uploadDocumentDesc": "يرجى رفع وثيقة PDF للتحقق من المكتب",
    "auth.selectPdfFile": "اختر ملف PDF",
    "auth.submitRegistration": "إرسال التسجيل",
    "auth.registrationSubmitted": "تم إرسال التسجيل!",
    "auth.officeRegistrationMessage": "تم إرسال طلب تسجيل المكتب الخاص بك.",
    "auth.waitForApproval": "يرجى انتظار موافقة المدير.",
    "auth.goToLogin": "الذهاب إلى تسجيل الدخول",
    "auth.officeRequired": "مطلوب مصادقة المكتب لتحديث حالة العقار.",

    // Office registration
    "office.photo": "صورة المكتب",
    "office.photoDesc": "ارفع صورة لمكتبك (اختياري)",
    "office.uploadPhoto": "رفع صورة المكتب",
    "office.photoFormats": "PNG، JPG حتى 10 ميجابايت",
    "office.fileTooLarge": "الملف كبير جداً",
    "office.fileTooLargeDesc": "يرجى اختيار ملف أصغر من 10 ميجابايت",
    "office.selectPhoto": "اختر صورة",
    "office.description": "وصف المكتب",
    "office.descriptionDesc": "اوصف مكتبك وخدماتك (اختياري)",
    "office.descriptionPlaceholder":
      "أخبر العملاء المحتملين عن مكتبك وخدماتك وخبرتك...",
    "office.location": "موقع المكتب",
    "office.locationDesc": "قدم موقع مكتبك (مطلوب)",
    "office.locationPlaceholder": "أدخل عنوان مكتبك أو الإحداثيات",
    "office.manageProperties": "إدارة ومراقبة قوائم العقارات الخاصة بك",

    // Office Followers
    "office.followers": "المتابعون",
    "office.followersDesc": "إدارة متابعي مكتبك",
    "office.followersError": "خطأ",
    "office.followersErrorDesc": "فشل في جلب المتابعين",
    "office.totalFollowers": "إجمالي المتابعين",
    "office.filteredResults": "النتائج المفلترة",
    "office.latestFollower": "آخر متابع",
    "office.searchFollowers": "البحث في المتابعين بالاسم أو الهاتف...",
    "office.noSearchResults": "لم يتم العثور على متابعين",
    "office.noSearchResultsDesc": "حاول تعديل مصطلحات البحث",
    "office.noFollowers": "لا يوجد متابعون بعد",
    "office.noFollowersDesc": "سيظهر المستخدمون هنا عندما يتابعون مكتبك",
    "office.followedOn": "تابع في",

    // Office Requests
    "requests.title": "طلبات العقارات",
    "requests.subtitle": "إدارة طلبات تقديم العقارات الخاصة بك",
    "requests.pending": "قيد الانتظار",
    "requests.accepted": "مقبولة",
    "requests.rejected": "مرفوضة",
    "requests.fetchError": "خطأ",
    "requests.fetchErrorDesc": "فشل في جلب طلبات العقارات",
    "requests.submittedOn": "تم التقديم في",
    "requests.lastUpdated": "آخر تحديث",
    "requests.noPending": "لا توجد طلبات قيد الانتظار",
    "requests.noPendingDesc": "ليس لديك أي طلبات عقارات قيد الانتظار حتى الآن.",
    "requests.noAccepted": "لا توجد طلبات مقبولة",
    "requests.noAcceptedDesc": "ليس لديك أي طلبات عقارات مقبولة حتى الآن.",
    "requests.noRejected": "لا توجد طلبات مرفوضة",
    "requests.noRejectedDesc": "ليس لديك أي طلبات عقارات مرفوضة حتى الآن.",

    // Location
    "location.required": "الموقع مطلوب",
    "location.requiredDesc": "يرجى تقديم موقعك",
    "location.notSupported": "الموقع غير مدعوم",
    "location.notSupportedDesc":
      "تحديد الموقع الجغرافي غير مدعوم في هذا المتصفح",
    "location.success": "تم الحصول على الموقع",
    "location.successDesc": "تم تعيين موقعك الحالي",
    "location.error": "خطأ في الموقع",
    "location.permissionDenied": "تم رفض الوصول للموقع",
    "location.unavailable": "معلومات الموقع غير متاحة",
    "location.timeout": "انتهت مهلة طلب الموقع",
    "location.getting": "جاري الحصول على الموقع...",
    "location.current": "استخدم الموقع الحالي",
    "location.pickOnMap": "اختر على الخريطة",
    "location.mapPicker": "منتقي الخريطة",
    "location.mapPickerDesc": "منتقي الخريطة سيكون متاحاً قريباً",

    // Property creation
    "property.createProperty": "إنشاء عقار",
    "property.createPropertyDesc": "اتبع الخطوات لإنشاء قائمة عقارك",
    "property.uploadMedia": "رفع الوسائط",
    "property.propertyDetails": "تفاصيل العقار",
    "property.specifications": "المواصفات",
    "property.pricingInfo": "معلومات التسعير",
    "property.locationInfo": "معلومات الموقع",
    "property.propertyCreated": "تم إنشاء العقار",

    // Media upload
    "property.uploadMediaTitle": "رفع وسائط العقار",
    "property.uploadMediaDesc": "أضف صور ومقاطع فيديو لعرض عقارك (اختياري)",
    "property.images": "الصور",
    "property.videos": "مقاطع الفيديو",
    "property.addImages": "إضافة صور",
    "property.addVideos": "إضافة مقاطع فيديو",
    "property.uploadGuidelines": "إرشادات الرفع",
    "property.guideline1":
      "الصور: JPG, PNG, WebP (حد أقصى 10 ميجابايت لكل صورة)",
    "property.guideline2":
      "مقاطع الفيديو: MP4, MOV, AVI (حد أقصى 100 ميجابايت لكل مقطع)",
    "property.guideline3": "حد أقصى 20 صورة و 5 مقاطع فيديو",
    "property.guideline4":
      "الوسائط عالية الجودة تساعد في جذب المزيد من المشترين",

    // Property details
    "property.propertyDetailsTitle": "تفاصيل العقار",
    "property.propertyDetailsDesc": "أضف عنوان ووصف لعقارك",
    "property.title": "عنوان العقار",
    "property.description": "وصف العقار",
    "property.generateTitle": "إنشاء عنوان",
    "property.generateDescription": "إنشاء وصف",
    "property.generating": "جاري الإنشاء...",
    "property.aiGenerationNote":
      "ارفع صور أو مقاطع فيديو لتمكين الإنشاء بالذكاء الاصطناعي",
    "property.titlePlaceholder": "أدخل عنوان العقار",
    "property.descriptionPlaceholder": "اوصف عقارك بالتفصيل...",
    "property.writingTips": "نصائح الكتابة",
    "property.tip1": "استخدم كلمات وصفية تبرز الميزات الفريدة",
    "property.tip2": "اذكر المرافق القريبة ووسائل النقل",
    "property.tip3": "قم بتضمين معلومات حول الحي",
    "property.tip4": "كن صادقاً ودقيقاً في وصفك",

    // Property specifications
    "property.specificationsTitle": "مواصفات العقار",
    "property.specificationsDesc": "قدم مواصفات مفصلة لعقارك",
    "property.propertyType": "نوع العقار",
    "property.selectPropertyType": "اختر نوع العقار",
    "property.apartment": "شقة",
    "property.villa": "فيلا",
    "property.office": "مكتب",
    "property.land": "أرض",
    "property.commercial": "تجاري",
    "property.farm": "مزرعة",
    "property.building": "مبنى",
    "property.chalet": "شاليه",
    "property.area": "المساحة",
    "property.rooms": "عدد الغرف",
    "property.bathrooms": "عدد الحمامات",
    "property.floorNumber": "رقم الطابق",
    "property.features": "المميزات",
    "property.featuresPlaceholder": "مثال: مسبح، حديقة، موقف سيارات، شرفة",
    "property.featuresNote": "افصل المميزات بفواصل",
    "property.furnishing": "الأثاث",
    "property.selectFurnishing": "اختر حالة الأثاث",
    "property.furnished": "مفروش",
    "property.unfurnished": "غير مفروش",
    "property.semiFurnished": "مفروش جزئياً",
    "property.commonFeatures": "المميزات الشائعة",

    // Pricing
    "property.pricingTitle": "معلومات التسعير",
    "property.pricingDesc": "حدد السعر والشروط لعقارك",
    "property.price": "السعر",
    "property.currency": "العملة",
    "property.selectCurrency": "اختر العملة",
    "property.adType": "نوع الإعلان",
    "property.selectAdType": "اختر نوع الإعلان",
    "property.rent": "للإيجار",
    "property.sale": "للبيع",
    "property.status": "حالة العقار",
    "property.selectStatus": "اختر الحالة",
    "property.available": "متاح",
    "property.rented": "مؤجر",
    "property.sold": "مباع",
    "property.month": "شهر",
    "property.pricingTips": "نصائح التسعير",
    "property.pricingTip1": "ابحث عن عقارات مماثلة في منطقتك",
    "property.pricingTip2": "اعتبر الميزات الفريدة وحالة العقار",
    "property.pricingTip3": "كن واقعياً بشأن ظروف السوق",
    "property.pricingTip4": "يمكنك دائماً تعديل السعر لاحقاً",
    "property.pricingSummary": "ملخص التسعير",
    "property.listingType": "نوع القائمة",
    "property.sellerType": "نوع البائع",
    "property.selectSellerType": "اختر نوع البائع",
    "property.owner": "مالك",
    "property.agent": "وسيط",
    "property.developer": "مطور",

    // Location
    "property.locationTitle": "معلومات الموقع",
    "property.locationDesc": "حدد الموقع الدقيق لعقارك",
    "property.address": "عنوان العقار",
    "property.addressPlaceholder": "أدخل العنوان الكامل",
    "property.governorate": "المحافظة",
    "property.selectGovernorate": "اختر المحافظة",
    "property.latitude": "خط العرض",
    "property.longitude": "خط الطول",
    "property.useCurrentLocation": "استخدم الموقع الحالي",
    "property.gettingLocation": "جاري الحصول على الموقع...",
    "property.pickOnMap": "اختر على الخريطة",
    "property.coordinates": "الإحداثيات",
    "property.locationTips": "نصائح الموقع",
    "property.locationTip1": "قدم العنوان الدقيق لرؤية أفضل",
    "property.locationTip2": "اذكر المعالم القريبة أو محطات المترو",
    "property.locationTip3":
      "الإحداثيات الدقيقة تساعد المشترين في العثور على عقارك",
    "property.locationTip4": "تحقق من الموقع قبل الإرسال",
    "property.creating": "جاري الإنشاء...",

    // Final description step
    "property.finalDescription": "وصف العقار",
    "property.finalDescriptionTitle": "وصف العقار والملخص",
    "property.finalDescriptionDesc": "راجع تفاصيل عقارك وأنشئ وصفاً جذاباً",
    "property.propertySummary": "ملخص العقار",
    "property.pricing": "التسعير",
    "property.media": "الوسائط",
    "property.descriptionTips": "نصائح الوصف",
    "property.descTip1": "أبرز الميزات الفريدة ونقاط البيع",
    "property.descTip2": "اذكر المرافق القريبة ووسائل النقل",
    "property.descTip3": "اوصف نمط الحياة والفوائد",
    "property.descTip4": "استخدم لغة جذابة لجذب المشترين",

    // Summary step
    "property.finalReview": "المراجعة النهائية",
    "property.finalReviewDesc": "راجع تفاصيل عقارك قبل الإرسال",
    "property.basicDetails": "التفاصيل الأساسية",
    "property.files": "ملفات",
    "property.confirmationChecklist": "قائمة التأكيد",
    "property.checklistMedia": "تم رفع ملفات الوسائط",
    "property.checklistDetails": "تم توفير تفاصيل العقار",
    "property.checklistPricing": "تم تحديد معلومات التسعير",
    "property.checklistLocation": "تم إضافة معلومات الموقع",
    "property.checklistDescription": "تم إكمال الوصف",
    "property.readyToSubmit": "قائمة عقارك جاهزة للإرسال لموافقة المدير.",
    "property.descriptionStepDesc": "أنشئ وصفاً جذاباً لعقارك",

    // Success step
    "property.propertyCreatedDesc":
      "تم إرسال عقارك وهو الآن في انتظار موافقة المدير.",
    "property.pendingApproval": "في انتظار موافقة المدير",
    "property.approvalMessage":
      "سيتم مراجعة قائمة عقارك من قبل فريق الإدارة ونشرها بمجرد الموافقة عليها. يستغرق هذا عادة 24-48 ساعة.",
    "property.whatsNext": "ما التالي؟",
    "property.adminReview": "مراجعة المدير",
    "property.adminReviewDesc":
      "سيراجع فريقنا تفاصيل عقارك ووسائطه للجودة والامتثال.",
    "property.approval": "الموافقة",
    "property.approvalDesc":
      "بمجرد الموافقة، سيتم نشر عقارك وسيكون مرئياً للمشترين/المستأجرين المحتملين.",
    "property.inquiries": "الاستفسارات",
    "property.inquiriesDesc":
      "ابدأ في تلقي استفسارات من المشترين والمستأجرين المهتمين من خلال منصتنا.",
    "property.notifications": "ابق محدثاً",
    "property.notificationsDesc":
      "سنخطرك عبر البريد الإلكتروني والرسائل النصية حول حالة الموافقة وأي استفسارات.",
    "property.emailNotifications": "إشعارات البريد الإلكتروني مفعلة",
    "property.smsNotifications": "إشعارات الرسائل النصية مفعلة",
    "property.goToDashboard": "الذهاب إلى لوحة التحكم",
    "property.addAnotherProperty": "إضافة عقار آخر",
    "property.viewAllProperties": "عرض جميع عقاراتي",
    "property.needHelp": "تحتاج مساعدة أو لديك أسئلة؟",
    "property.contactSupport": "اتصل بالدعم",

    // Property Status Modal
    "property.updateStatus": "تحديث حالة العقار",
    "property.updateStatusDesc": "غيّر حالة هذا العقار لتعكس توفره الحالي.",
    "property.propertyInfo": "معلومات العقار",
    "property.currentStatus": "الحالة الحالية",
    "property.newStatus": "الحالة الجديدة",
    "property.newStatusPreview": "الحالة الجديدة ستكون",
    "property.statusUpdated": "تم تحديث الحالة",
    "property.statusUpdatedDesc": "تم تحديث حالة العقار بنجاح.",
    "property.statusUpdateError":
      "فشل في تحديث حالة العقار. يرجى المحاولة مرة أخرى.",
    "property.updating": "جاري التحديث...",

    //Settings
    "stt.manageTitle": "إدارة حسابك وتفضيلاتك",
    "stt.appearance": "المظهر",
    "stt.dangerZone": "منطقة خطيرة",

    // Dashboard
    "dashboard.welcome": "مرحباً بعودتك",
    "dashboard.stats": "إحصائياتك",
    "dashboard.properties": "العقارات",
    "dashboard.views": "إجمالي المشاهدات",
    "dashboard.inquiries": "الاستفسارات",
    "dashboard.addProperty": "إضافة عقار جديد",
    "dashboard.myProperties": "عقاراتي",
    "dashboard.recentProperties": "العقارات الحديثة",
    "dashboard.manageProperties": "إدارة عقاراتك ومراقبة الأداء",
    "dashboard.quickActions": "إجراءات سريعة",
    "dashboard.viewAnalytics": "عرض الإحصائيات",

    // Dashboard Charts
    "dashboard.analytics": "التحليلات والإحصائيات",
    "dashboard.viewsTrend": "اتجاه المشاهدات والاستفسارات",
    "dashboard.propertyTypes": "توزيع أنواع العقارات",
    "dashboard.revenueTrend": "اتجاه الإيرادات",
    "dashboard.propertyStatus": "نظرة عامة على حالة العقارات",
    "dashboard.inquirySources": "مصادر الاستفسارات",
    "dashboard.kpiMetrics": "مؤشرات الأداء الرئيسية",
    "dashboard.viewsLabel": "المشاهدات",
    "dashboard.inquiriesLabel": "الاستفسارات",
    "dashboard.revenue": "الإيرادات",
    "dashboard.commission": "العمولة",
    "dashboard.messages": "الرسائل",
    "dashboard.responseRate": "معدل الاستجابة",
    "dashboard.excellent": "ممتاز",
    "dashboard.thisWeek": "هذا الأسبوع",
    "dashboard.active": "نشط",
    "dashboard.subscriptionRequired":
      "تحتاج إلى اشتراك نشط لإضافة عقارات جديدة",
    "dashboard.freeAdsRemaining": "الإعلانات المجانية المتبقية",
    "dashboard.subscriptions": "الاشتراكات",
    "dashboard.subscriptionExpiresSoon": "اشتراكك سينتهي قريباً",
    "dashboard.expiresOn": "تاريخ الانتهاء",
    "dashboard.renewSubscription": "تجديد الاشتراك",
    "dashboard.notSpecified": "غير محدد",
    "dashboard.error": "خطأ",
    "dashboard.errorPropertyCount":
      "فشل في الحصول على عدد العقارات. يرجى المحاولة مرة أخرى.",
    "dashboard.errorViews":
      "فشل في الحصول على المشاهدات. يرجى المحاولة مرة أخرى.",
    "dashboard.editProperty": "تعديل العقار",
    "dashboard.editingProperty": "تعديل العقار",
    "dashboard.propertyDeleted": "تم حذف العقار",
    "dashboard.deletedSuccessfully": "تم حذفه بنجاح",
    "dashboard.deleteFailed": "فشل الحذف",
    "dashboard.deleteFailedDesc": "فشل في حذف العقار. يرجى المحاولة مرة أخرى.",
    "dashboard.clickToView": "انقر للعرض",

    // Subscriptions
    "subscriptions.title": "الاشتراكات",
    "subscriptions.manage": "إدارة اشتراكاتك وطلبات الاشتراك",
    "subscriptions.requestNew": "طلب اشتراك جديد",
    "subscriptions.monthly": "اشتراك شهري",
    "subscriptions.yearly": "اشتراك سنوي",
    "subscriptions.oneMonth": "اشتراك لمدة شهر واحد",
    "subscriptions.oneYear": "اشتراك لمدة سنة كاملة",
    "subscriptions.perMonth": "شهرياً",
    "subscriptions.perYear": "سنوياً",
    "subscriptions.active": "النشطة",
    "subscriptions.pending": "قيد الانتظار",
    "subscriptions.rejected": "المرفوضة",
    "subscriptions.expires": "ينتهي في",
    "subscriptions.requested": "تاريخ الطلب",
    "subscriptions.rejectedOn": "تاريخ الرفض",
    "subscriptions.noActive": "لا توجد اشتراكات نشطة",
    "subscriptions.noActiveDesc": "ليس لديك أي اشتراكات نشطة حالياً",
    "subscriptions.noPending": "لا توجد طلبات معلقة",
    "subscriptions.noPendingDesc": "ليس لديك أي طلبات اشتراك معلقة",
    "subscriptions.noRejected": "لا توجد طلبات مرفوضة",
    "subscriptions.noRejectedDesc": "ليس لديك أي طلبات اشتراك مرفوضة",
    "subscriptions.requestSent": "تم إرسال الطلب",
    "subscriptions.requestSentDesc":
      "تم إرسال طلب الاشتراك بنجاح. انتظر موافقة الإدارة.",
    "subscriptions.requestError": "فشل في إرسال طلب الاشتراك",
    "subscriptions.loading": "جاري التحميل...",
    "subscriptions.notSpecified": "غير محدد",
    "subscriptions.invalidDate": "تاريخ غير صالح",

    // Office Profile
    "office.verified": "موثق",
    "office.pending": "قيد المراجعة",
    "office.follow": "متابعة",
    "office.following": "متابع",
    "office.followersCount": "متابع",
    "office.views": "مشاهدة",
    "office.memberSince": "عضو منذ",
    "office.properties": "العقارات",
    "office.propertiesDesc": "سيتم عرض عقارات هذا المكتب هنا.",
    "office.notFound": "المكتب غير موجود",
    "office.notFoundDesc": "المكتب الذي تبحث عنه غير موجود أو تم حذفه.",
    "office.followSuccess": "نجح",
    "office.followSuccessDesc": "أنت الآن تتابع هذا المكتب",
    "office.followError": "فشل في متابعة المكتب",
    "office.propertiesError": "خطأ في تحميل العقارات",
    "office.propertiesErrorDesc": "فشل في تحميل العقارات من هذا المكتب",
    "office.noProperties": "لا توجد عقارات بعد",
    "office.noPropertiesDesc": "لم يقم هذا المكتب بإدراج أي عقارات بعد.",
    "office.userOnly": "للمستخدمين فقط",
    "office.userOnlyDesc": "يمكن للمستخدمين فقط متابعة المكاتب",

    // Admin Panel
    "admin.panel": "لوحة الإدارة",
    "admin.welcome": "مرحباً بعودتك",
    "admin.online": "متصل",
    "admin.totalUsers": "إجمالي المستخدمين",
    "admin.totalOffices": "إجمالي المكاتب",
    "admin.totalProperties": "إجمالي العقارات",
    "admin.pendingApprovals": "الموافقات المعلقة",
    "admin.activeSubscriptions": "الاشتراكات النشطة",
    "admin.monthlyRevenue": "الإيرادات الشهرية",
    "admin.fromLastMonth": "من الشهر الماضي",
    "admin.quickActions": "إجراءات سريعة",
    "admin.recentActivity": "النشاط الأخير",
    "admin.manageUsers": "إدارة المستخدمين",
    "admin.manageUsersDesc": "عرض وإدارة حسابات المستخدمين",
    "admin.manageOffices": "إدارة المكاتب",
    "admin.manageOfficesDesc": "الموافقة على وإدارة حسابات المكاتب",
    "admin.manageProperties": "إدارة العقارات",
    "admin.managePropertiesDesc": "مراجعة وإشراف على قوائم العقارات",
    "admin.subscriptions": "الاشتراكات",
    "admin.subscriptionsDesc": "إدارة خطط الاشتراك والطلبات",
    "admin.analytics": "التحليلات",
    "admin.analyticsDesc": "عرض التحليلات والتقارير التفصيلية",
    "admin.settings": "إعدادات النظام",
    "admin.settingsDesc": "تكوين إعدادات النظام والتفضيلات",
    "admin.userRegistered": "مستخدم جديد مسجل",
    "admin.officeApproved": "تم الموافقة على حساب المكتب",
    "admin.propertySubmitted": "عقار جديد مقدم للمراجعة",
    "admin.subscriptionPurchased": "تم شراء اشتراك",
    "admin.pending": "معلق",
    "admin.approve": "موافقة",
    "admin.reject": "رفض",
    "admin.description": "الوصف",
    "admin.submittedOn": "تم التقديم في",
    "admin.downloadDocument": "تحميل الوثيقة",
    "admin.fetchError": "فشل في جلب البيانات",
    "admin.approveError": "فشل في الموافقة",
    "admin.rejectError": "فشل في الرفض",
    "admin.officeRejected": "تم رفض المكتب بنجاح",
    "admin.propertyApproved": "تم الموافقة على العقار بنجاح",
    "admin.propertyRejected": "تم رفض العقار بنجاح",
    "admin.noPendingOffices": "لا توجد مكاتب معلقة",
    "admin.noPendingOfficesDesc": "تم معالجة جميع طلبات المكاتب",
    "admin.noPendingProperties": "لا توجد عقارات معلقة",
    "admin.noPendingPropertiesDesc": "تم معالجة جميع طلبات العقارات",
    "admin.pendingOfficeRequests": "مراجعة والموافقة على طلبات المكاتب المعلقة",
    "admin.pendingPropertyRequests":
      "مراجعة والموافقة على طلبات العقارات المعلقة",
    "admin.contactInfo": "معلومات الاتصال",
    "admin.phoneNumber": "رقم الهاتف",
    "admin.location": "الموقع",
    "admin.documentation": "الوثائق",
    "admin.verificationDocument": "وثيقة التحقق",
    "admin.awaitingReview": "في انتظار مراجعة المدير",

    // AI Suggestions for Offices
    "admin.aiAnalyzing": "الذكاء الاصطناعي يحلل تسجيل هذا المكتب...",
    "admin.aiSuggestion": "تحليل الذكاء الاصطناعي",
    "admin.aiError": "خطأ",
    "admin.confidence": "الثقة",
    "admin.aiReasons": "أسباب التحليل",
    "admin.documentAnalysis": "تحليل الوثيقة",
    "admin.documentValid": "الوثيقة صحيحة",
    "admin.documentType": "نوع الوثيقة",
    "admin.documentIssues": "المشاكل",
    "admin.locationAnalysis": "تحليل الموقع",
    "admin.locationValid": "الموقع صحيح",
    "admin.locationType": "نوع الموقع",
    "admin.locationIssues": "مشاكل الموقع",
    "admin.profileAnalysis": "تحليل الملف الشخصي",
    "admin.profileCompleteness": "اكتمال الملف الشخصي",
    "admin.missingFields": "الحقول المفقودة",
    "admin.suggestions": "الاقتراحات",
    "admin.aiReject": "رفض",
    "admin.confident": "الثقة",
    "admin.priceAnalysis": "تحليل السعر",
    "admin.currentPrice": "السعر الحالي",
    "admin.suggestedPrice": "السعر المقترح",
    "admin.priceDifference": "الفرق",
    "admin.marketComparison": "مقارنة بالأسواق",

    "admin.propertyDetails": "تفاصيل العقار",
    "admin.specifications": "المواصفات",
    "admin.authError": "فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.",
    "admin.permissionError": "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
    "admin.notFoundError": "الطلب غير موجود.",
    "admin.aiSummary": "ملخص الذكاء الاصطناعي",
    "admin.manageSubscriptions": "إدارة الاشتراكات",
    "admin.pendingSubscriptions": "الاشتراكات المعلقة",
    "admin.pendingSubscriptionsDesc":
      "مراجعة والموافقة على طلبات الاشتراك المعلقة",
    "admin.noPendingSubscriptions": "لا توجد اشتراكات معلقة",
    "admin.noPendingSubscriptionsDesc": "تم معالجة جميع طلبات الاشتراك",
    "admin.subscriptionApproved": "تم الموافقة على الاشتراك بنجاح",
    "admin.subscriptionRejected": "تم رفض الاشتراك بنجاح",
    "admin.subscriptionDetails": "تفاصيل الاشتراك",
    "admin.officeInfo": "معلومات المكتب",
    "admin.officeName": "اسم المكتب",
    "admin.officeStatus": "حالة المكتب",
    "admin.freeAds": "الإعلانات المجانية",
    "admin.followers": "المتابعون",
    "admin.views": "المشاهدات",
    "admin.awaitingSubscriptionReview": "في انتظار مراجعة الاشتراك",
    "subscription.monthly": "شهري",
    "subscription.yearly": "سنوي",
    "subscription.premium": "مميز",
    "subscription.price": "سعر الاشتراك",
    "subscription.type": "نوع الاشتراك",

    // AI Chat
    "aiChat.title": "المساعد الذكي",
    "aiChat.globalDescription": "اسألني عن عقاراتنا!",
    "aiChat.apiKeyPlaceholder": "أدخل مفتاح Gemini API الخاص بك",
    "aiChat.startConversation": "ابدأ محادثة بكتابة رسالة",
    "aiChat.inputPlaceholder": "اسأل عن العقارات...",
    "aiChat.error": "عذراً، واجهت خطأ. يرجى المحاولة مرة أخرى.",
    "aiChat.propertyVoiceChat": "محادثة صوتية للعقار",
    "aiChat.globalVoiceChat": "المساعد الصوتي الذكي",
    "aiChat.propertyVoiceChatDescription": "اسأل أسئلة حول هذا العقار",
    "aiChat.globalVoiceChatDescription": "اسأل عن عقاراتنا وخدماتنا العقارية",
    "aiChat.enterApiKey": "أدخل مفتاح Gemini API الخاص بك",
    "aiChat.apiKeyRequired": "مفتاح API مطلوب لبدء المحادثة الصوتية",
    "aiChat.liveVoiceChat": "محادثة صوتية مباشرة",
    "aiChat.liveVoiceChatDescription":
      "محادثة صوتية في الوقت الفعلي مع المساعد الذكي",
    "aiChat.connected": "متصل",
    "aiChat.disconnected": "غير متصل",
    "aiChat.speakNow": "تحدث الآن... الذكاء الاصطناعي يستمع وسيرد بالصوت.",
    "aiChat.clickToStart":
      "انقر على الميكروفون لبدء محادثة صوتية مع المساعد الذكي.",

    // Add Property
    "add.title": "إضافة عقار جديد",
    "add.propertyTitle": "عنوان العقار",
    "add.propertyType": "نوع العقار",
    "add.listingType": "نوع الإعلان",
    "add.price": "السعر",
    "add.city": "المدينة",
    "add.area": "المنطقة",
    "add.address": "العنوان الكامل",
    "add.bedrooms": "عدد غرف النوم",
    "add.bathrooms": "عدد دورات المياه",
    "add.size": "المساحة (م²)",
    "add.description": "وصف العقار",
    "add.images": "صور العقار",
    "add.uploadImages": "رفع الصور",

    //props
    "props.empty": "لا توجد عقارات متاحة",
    "props.featured": "العقارات المميزة",
    "props.discover": "اكتشف أفضل العقارات المتاحة",
    "props.viewAll": "عرض جميع العقارات",
    "props.changeFilters": "جرب تعديل المرشحات للحصول على نتائج أفضل",
    "m.month": "/شهر",

    // Search & Filters
    "search.results": "نتائج البحث",
    "search.filters": "المرشحات",
    "search.priceRange": "نطاق السعر",
    "search.minPrice": "أقل سعر",
    "search.maxPrice": "أعلى سعر",
    "search.applyFilters": "تطبيق المرشحات",
    "search.clearFilters": "مسح المرشحات",
    "search.sortBy": "ترتيب حسب",
    "search.newest": "الأحدث أولاً",
    "search.oldest": "الأقدم أولاً",
    "search.priceLow": "السعر: من الأقل للأعلى",
    "search.priceHigh": "السعر: من الأعلى للأقل",

    // AI Chat
    "aiChat.askAi": "اسأل كاسا الذكاء الاصطناعي",

    //Fav
    "fav.loading": "جاري تحميل المفضلة...",
    "fav.error": "فشل في تحميل المفضلة:",
    "fav.error.update": "حدث خطأ في تحديث المفضلة",
    "fav.properties": "العقارات المفضلة",
    "fav.emtpy.title": "لا توجد عقارات مفضلة",
    "fav.empty": "لم تقم بإضافة أي عقارات إلى المفضلة بعد.",
    "fav.added": "تمت إضافة العقار إلى المفضلة",
    "fav.updated": "تم التحديث",
    "fav.removed": "تمت إزالة العقار من المفضلة",
    "brs.browse": "تصفح العقارات",

    // Map and Route
    "map.calculatingRoute": "جاري حساب المسار...",
    "map.locationPermissionRequired": "إذن الموقع مطلوب",
    "map.enableLocationMessage":
      "يرجى تمكين الوصول إلى الموقع لرؤية المسار إلى هذا العقار.",
    "map.tryAgain": "حاول مرة أخرى",
    "map.routeError": "خطأ في المسار",
    "map.retry": "إعادة المحاولة",
    "map.yourLocation": "موقعك",
    "map.destination": "موقع العقار",
    "map.geolocationNotSupported":
      "تحديد الموقع الجغرافي غير مدعوم في هذا المتصفح.",
    "map.noRouteFound": "لم يتم العثور على مسار.",
    "map.networkError":
      "خطأ في الشبكة: لا يمكن الاتصال بخدمة المسار. يرجى التحقق من اتصال الإنترنت.",
    "map.unknownError": "حدث خطأ غير معروف.",
    "map.locationRequired": "موقعك مطلوب للحصول على الاتجاهات.",
    "map.propertyLocation": "موقع العقار",

    // Form validation and messages
    "form.passwordMismatch": "كلمات المرور غير متطابقة",
    "form.passwordsDoNotMatch": "كلمات المرور غير متطابقة",
    "form.registrationFailed": "فشل التسجيل",
    "form.checkInputAndTryAgain": "يرجى التحقق من المدخلات والمحاولة مرة أخرى",
    "form.propertyAddedSuccessfully": "تم إضافة العقار بنجاح",
    "form.propertyListingPublished": "تم نشر إعلان العقار الخاص بك",
    "form.failedToAddProperty": "فشل في إضافة العقار",
    "form.errorOccurredTryAgain": "حدث خطأ، يرجى المحاولة مرة أخرى",
    "form.basicInformation": "المعلومات الأساسية",
    "form.enterPropertyTitleEnglish": "أدخل عنوان العقار بالإنجليزية",
    "form.english": "بالإنجليزية",
    "form.arabic": "بالعربية",

    // Currency and loading states
    "currency.converting": "جاري التحويل...",
    "currency.loading": "...",

    // Voice chat
    "voice.thinking": "جاري التفكير...",
    "voice.aiSpeaking": "يتحدث المساعد...",
    "voice.listening": "أستمع إليك...",
    "voice.clickToSpeak": "اضغط للتحدث",
    "voice.startVoiceChat": "ابدأ المحادثة الصوتية",
    "voice.endConversation": "إنهاء",
    "voice.testVoice": "اختبار الصوت",

    // Amenities
    "amenities.swimmingPool": "حمام سباحة",
    "amenities.gymFitness": "صالة رياضية ومركز لياقة",
    "amenities.coveredParking": "موقف مغطى",
    "amenities.security24": "أمن على مدار الساعة",
    "amenities.balconyView": "شرفة بإطلالة",
    "amenities.builtInWardrobes": "خزائن مدمجة",
    "amenities.centralAC": "تكييف مركزي",
    "amenities.conciergeService": "خدمة الكونسيرج",

    // Property stats
    "property.views": "المشاهدات",
    "property.active": "نشط",
    "property.listed": "مدرج",
    "property.subscriptionRequired": "اشتراك مطلوب",

    // Search and filters
    "search.adType": "نوع الإعلان",
    "search.selectAdType": "اختر نوع الإعلان",
    "search.allAdTypes": "جميع أنواع الإعلانات",
    "search.mostViewed": "الأكثر مشاهدة",

    // Syrian Governorates
    "location.damascus": "دمشق",
    "location.aleppo": "حلب",
    "location.homs": "حمص",
    "location.hama": "حماة",
    "location.lattakia": "اللاذقية",
    "location.tartus": "طرطوس",
    "location.idlib": "إدلب",
    "location.daraa": "درعا",
    "location.sweida": "السويداء",
    "location.quneitra": "القنيطرة",
    "location.raqqa": "الرقة",
    "location.deir_ez_zor": "دير الزور",
    "location.hasakah": "الحسكة",
    "location.damascus_countryside": "ريف دمشق",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [user, setUser] = useState<IUser | IOffice | null>(null);
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    const savedUser = localStorage.getItem("user");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.log("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const triggerLanguageAnimation = () => {
    setIsLanguageTransitioning(true);

    // Add language transition class to body
    document.body.classList.add("language-transition");

    // Add content fade effect
    const contentElements = document.querySelectorAll("main, .content-fade");
    contentElements.forEach((el) => {
      el.classList.add("content-fade", "transitioning");
    });

    setTimeout(() => {
      // Remove transition classes
      document.body.classList.remove("language-transition");
      contentElements.forEach((el) => {
        el.classList.remove("transitioning");
      });
      setIsLanguageTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;

    // Add smooth transition classes
    document.body.classList.add("smooth-colors");
    document.documentElement.classList.add("rtl-transition");

    if (language === "ar") {
      document.body.style.fontFamily = "Rubik, sans-serif";
    } else {
      document.body.style.fontFamily = "Poppins, sans-serif";
    }
  }, [language]);

  const t = (
    key: string,
    options?: { [key: string]: string | number }
  ): string => {
    let text = translations[language][key] || key;
    if (options && text) {
      Object.keys(options).forEach((v) => {
        const regex = new RegExp(`{${v}}`, "g");
        text = text.replace(regex, String(options[v]));
      });
    }
    return text;
  };

  const login = (newUser: IUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hasToken = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return !!parsedUser?.token;
      }
      return false;
    } catch {
      return false;
    }
  };

  const isRTL = language === "ar";
  const isAuthenticated = !!user;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        user,
        login,
        logout,
        isAuthenticated,
        hasToken,
        isLanguageTransitioning,
        triggerLanguageAnimation,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
