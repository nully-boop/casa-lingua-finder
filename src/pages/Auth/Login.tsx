import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, Lock, Users, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input.css';

const Login = () => {
  const { t, login } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOffice, setIsOffice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate phone number
    if (!validatePhone(phone)) {
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await authService.login({
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        type: isOffice ? "office" : "user",
        password: password,
      });

      login(user);
      console.log(user);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Route based on user type
      if (user["type"] === "admin") {
        navigate("/admin");
      } else if (user["type"] === "office") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {t("auth.loginTitle")}
              </CardTitle>
              <p className="text-muted-foreground">{t("auth.loginSubtitle")}</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder={t("auth.phonePlaceholder") || "Enter phone number"}
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
                  <p className="text-xs text-muted-foreground">
                    {t("auth.phoneHint") || "Enter your phone number with country code"}
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
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right rtl:text-left">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>

                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {t("auth.accountType") || "Account Type"}
                  </Label>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Checkbox
                      id="office-type"
                      checked={isOffice}
                      onCheckedChange={(checked) => setIsOffice(checked as boolean)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label
                        htmlFor="office-type"
                        className="text-sm font-normal cursor-pointer"
                      >
                        {isOffice
                          ? (t("auth.officeAccount") || "Office Account")
                          : (t("auth.userAccount") || "User Account")
                        }
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isOffice
                      ? (t("auth.officeAccountDesc") || "Login as a real estate office to manage properties")
                      : (t("auth.userAccountDesc") || "Login as a user to browse and search properties")
                    }
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : t("auth.login")}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {t("auth.noAccount")}
                  <Link to="/register" className="text-primary hover:underline">
                    {t("auth.register")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
