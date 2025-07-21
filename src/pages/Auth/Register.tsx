import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  Lock,
  User,
  Eye,
  EyeOff,
  Upload,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { office } from "@/services/api";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input.css';

type RegistrationStep =
  | "type-selection"
  | "name"
  | "credentials"
  | "file-upload"
  | "success";

const Register = () => {
  const { t, login } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step management
  const [currentStep, setCurrentStep] =
    useState<RegistrationStep>("type-selection");
  const [isOffice, setIsOffice] = useState(false);

  // Form data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"user" | "office" | null>(
    null
  );
  const [phoneError, setPhoneError] = useState("");

  // Phone validation function
  const validatePhone = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneError(t("auth.phoneRequired") || "Phone number is required");
      return false;
    }
    if (phoneNumber.length < 12) {
      setPhoneError(t("auth.phoneInvalid") || "Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Progress bar logic
  const steps: RegistrationStep[] = [
    "type-selection",
    "name",
    "credentials",
    "file-upload",
    "success",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const { language } = useLanguage();
  const isRTL = language === "ar";



  const getStepTitle = () => {
    switch (currentStep) {
      case "type-selection":
        return t("auth.accountType");
      case "name":
        return t("auth.enterYourName");
      case "credentials":
        return t("auth.enterCredentials");
      case "file-upload":
        return t("auth.uploadDocument");
      case "success":
        return t("auth.successMessage");
      default:
        return "";
    }
  };

  const benefits = {
    user: [
      {
        icon: Star,
        text: t("auth.userBenefit1") || "Browse thousands of properties",
      },
      {
        icon: CheckCircle,
        text: t("auth.userBenefit2") || "Save your favorite listings",
      },
      {
        icon: Shield,
        text: t("auth.userBenefit3") || "Get verified property information",
      },
    ],
    office: [
      {
        icon: Building,
        text: t("auth.officeBenefit1") || "List unlimited properties",
      },
      {
        icon: Star,
        text: t("auth.officeBenefit2") || "Reach thousands of buyers",
      },
      {
        icon: CheckCircle,
        text: t("auth.officeBenefit3") || "Professional verification badge",
      },
    ],
  };

  // Step navigation handlers
  const handleTypeSelection = (isOfficeType: boolean) => {
    setIsOffice(isOfficeType);
    setCurrentStep("name");
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep("credentials");
  };

  const handleCredentialsSubmit = async () => {
    if (!phone.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "All fields required",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (isOffice) {
      setCurrentStep("file-upload");
    } else {
      await registerUser();
    }
  };

  const registerUser = async () => {
    // Validate phone number
    if (!validatePhone(phone)) {
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await authService.register({
        name: name,
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        password: password,
        password_confirmation: confirmPassword,
        type: "user",
      });

      login(user);
      toast({
        title: "Registration successful",
        description: "Welcome to Casa Lingua!",
      });
      navigate("/");
    } catch (error: unknown) {
      handleRegistrationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerOffice = async () => {
    if (!pdfFile) {
      toast({
        title: "PDF file required",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    if (!validatePhone(phone)) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone.startsWith('+') ? phone : `+${phone}`);
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword);
      formData.append("type", "office");
      formData.append("document", pdfFile);

      // Use the office API service
      const response = await office.registerOffice(formData);

      console.log("Office registration successful:", response.data);
      setCurrentStep("success");
    } catch (error: unknown) {
      handleRegistrationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationError = (error: unknown) => {
    let errorMessage = "Please check your input and try again";
    if (typeof error === "object" && error !== null && "response" in error) {
      const errResponse = error.response as {
        data?: { message?: string; error?: string };
      };
      if (errResponse.data?.message) {
        errorMessage = errResponse.data.message;
      } else if (errResponse.data?.error) {
        errorMessage = errResponse.data.error;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast({
      title: "Registration failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    switch (currentStep) {
      case "name":
        setCurrentStep("type-selection");
        break;
      case "credentials":
        setCurrentStep("name");
        break;
      case "file-upload":
        setCurrentStep("credentials");
        break;
      default:
        break;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "type-selection":
        return renderTypeSelection();
      case "name":
        return renderNameStep();
      case "credentials":
        return renderCredentialsStep();
      case "file-upload":
        return renderFileUploadStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderTypeSelection();
    }
  };

  const renderTypeSelection = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* User Account Card */}
        <Card
          className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 ${
            selectedType === "user"
              ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => handleTypeSelection(false)}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div
                className={`p-3 rounded-xl transition-all duration-300 ${
                  selectedType === "user"
                    ? "bg-blue-500 shadow-lg"
                    : "bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800"
                }`}
              >
                <User
                  className={`h-6 w-6 transition-colors duration-300 ${
                    selectedType === "user"
                      ? "text-white"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {t("auth.userAccount") || "User Account"}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`transition-all duration-300 ${
                      selectedType === "user"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : ""
                    }`}
                  >
                    {t("auth.free") || "Free"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("auth.userAccountDesc") ||
                    "Browse and search properties, save favorites"}
                </p>
                <div className="space-y-2">
                  {benefits.user.map((benefit, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 rtl:space-x-reverse text-xs transition-all duration-300 ${
                        selectedType === "user"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <benefit.icon className="h-3 w-3 flex-shrink-0" />
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
                {selectedType === "user" && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-primary font-medium animate-in slide-in-from-left-2 duration-300">
                    <CheckCircle className="h-3 w-3" />
                    <span>{t("auth.selected") || "Selected"}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Office Account Card */}
        <Card
          className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 ${
            selectedType === "office"
              ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => handleTypeSelection(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div
                className={`p-3 rounded-xl transition-all duration-300 ${
                  selectedType === "office"
                    ? "bg-green-500 shadow-lg"
                    : "bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800"
                }`}
              >
                <Building
                  className={`h-6 w-6 transition-colors duration-300 ${
                    selectedType === "office"
                      ? "text-white"
                      : "text-green-600 dark:text-green-400"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {t("auth.officeAccount") || "Office Account"}
                  </h3>
                  <Badge
                    variant="default"
                    className={`transition-all duration-300 ${
                      selectedType === "office"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : ""
                    }`}
                  >
                    {t("auth.professional") || "Professional"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("auth.officeAccountDesc") ||
                    "List properties and manage your real estate business"}
                </p>
                <div className="space-y-2">
                  {benefits.office.map((benefit, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 rtl:space-x-reverse text-xs transition-all duration-300 ${
                        selectedType === "office"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <benefit.icon className="h-3 w-3 flex-shrink-0" />
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
                {selectedType === "office" && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-primary font-medium animate-in slide-in-from-left-2 duration-300">
                    <CheckCircle className="h-3 w-3" />
                    <span>{t("auth.selected") || "Selected"}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Section */}
      <div className="space-y-4 py-4">
        <div className="text-center text-sm text-muted-foreground">
          {t("auth.haveAccount") || "Already have an account?"}{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium transition-colors"
          >
            {t("auth.login") || "Login"}
          </Link>
        </div>
      </div>
    </div>
  );

  const renderNameStep = () => (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("auth.name")}</Label>
          <div className="relative">
            <User className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 rtl:pl-3 rtl:pr-10"
              placeholder={t("auth.enterYourName") || "Enter your full name"}
              required
            />
          </div>
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleNameSubmit}
        disabled={!name.trim()}
      >
        {t("common.next") || "Next"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  );

  const renderCredentialsStep = () => (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("auth.phone")}</Label>
          <div className="relative">
            <PhoneInput
              country={'sy'}
              value={phone}
              onChange={(phone) => {
                setPhone(phone);
                if (phoneError) {
                  validatePhone(phone);
                }
              }}
              inputProps={{
                name: 'phone',
                required: true,
                onBlur: () => validatePhone(phone),
                autoComplete: 'tel',
                'aria-describedby': phoneError ? 'phone-error' : undefined,
                'aria-invalid': phoneError ? 'true' : 'false'
              }}
              containerClass={`w-full ${phoneError ? 'error' : ''}`}
              placeholder={t("auth.enterPhone") || "Enter your phone number"}
              enableSearch={true}
              disableSearchIcon={false}
              countryCodeEditable={false}
              specialLabel=""
              searchPlaceholder={t("common.search") || "Search countries..."}
              preferredCountries={['sy', 'sa', 'ae', 'jo', 'lb', 'eg']}
              excludeCountries={[]}
              onlyCountries={[]}
              priority={{
                sy: 0,
                sa: 1,
                ae: 2,
                jo: 3,
                lb: 4,
                eg: 5
              }}
            />
          </div>
          {phoneError && (
            <p id="phone-error" className="text-sm text-red-500 mt-1" role="alert">
              {phoneError}
            </p>
          )}
          {/* Hint Text */}
          <p className="text-xs text-muted-foreground">
            {t("auth.phoneHint") ||
              "Enter your phone number with country code"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
              placeholder={t("auth.enterPassword") || "Enter your password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
              placeholder={
                t("auth.confirmYourPassword") || "Confirm your password"
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleCredentialsSubmit}
        disabled={
          !phone.trim() ||
          !password.trim() ||
          !confirmPassword.trim() ||
          isLoading
        }
      >
        {isLoading
          ? t("common.loading") || "Loading..."
          : isOffice
          ? t("common.next") || "Next"
          : t("auth.register") || "Register"}
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </CardContent>
  );

  const renderFileUploadStep = () => (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            {t("auth.uploadDocument") || "Upload Required Document"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("auth.uploadDocumentDesc") ||
              "Please upload a PDF document for office verification"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdf-upload">
            {t("auth.selectPdfFile") || "Select PDF File"}
          </Label>
          <div className="relative">
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          {pdfFile && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              {pdfFile.name}
            </p>
          )}
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={registerOffice}
        disabled={!pdfFile || isLoading}
      >
        {isLoading
          ? t("common.loading") || "Loading..."
          : t("auth.submitRegistration") || "Submit Registration"}
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </CardContent>
  );

  const renderSuccessStep = () => (
    <CardContent className="space-y-6">
      <div className="text-center space-y-4">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
        <h3 className="text-xl font-semibold text-green-700">
          {t("auth.registrationSubmitted") || "Registration Submitted!"}
        </h3>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            {t("auth.officeRegistrationMessage") ||
              "Your office registration request has been sent."}
          </p>
          <p className="text-muted-foreground">
            {t("auth.waitForApproval") || "Please wait for admin approval."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          {t("auth.goToLogin") || "Go to Login"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate("/")}
        >
          {t("common.returnHome") || "Return to Home"}
        </Button>
      </div>
    </CardContent>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex relative">
          {/* Vertical Progress Bar */}
          {currentStep !== "success" && (
            <div
              className={`fixed top-16 ${
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

          <div className="max-w-md mx-auto w-full">
            <Card className="animate-scale-in relative">
              <CardHeader className="text-center relative">
                {/* Back Button */}
                {currentStep !== "success" && currentStep !== "type-selection" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    className={`absolute top-4 ${
                      isRTL ? "right-4" : "left-4"
                    } h-8 w-8 p-0 hover:bg-muted/50 transition-colors`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}

                <CardTitle className="text-2xl font-bold">
                  {currentStep === "type-selection"
                    ? t("auth.chooseAccountType") || "Choose Account Type"
                    : currentStep === "success"
                    ? t("auth.registrationComplete") || "Registration Complete"
                    : isOffice
                    ? t("auth.officeRegistration") || "Office Registration"
                    : t("auth.userRegistration") || "User Registration"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {currentStep === "type-selection"
                    ? t("auth.selectAccountTypeDesc") ||
                      "Select the type of account you want to create"
                    : currentStep === "name"
                    ? t("auth.enterYourName") || "Enter your name"
                    : currentStep === "credentials"
                    ? t("auth.enterCredentials") || "Enter your credentials"
                    : currentStep === "file-upload"
                    ? t("auth.uploadDocument") || "Upload required document"
                    : t("auth.successMessage") ||
                      "Your registration is complete"}
                </p>
              </CardHeader>
              {renderStepContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
