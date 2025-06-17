import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Phone, MapPin, Building, FileText, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface SellerProfileData {
  phone?: string;
  location?: string;
  company_name?: string;
  license_number?: string;
  user_id: number;
}

const SellerProfileSetup = () => {
  const { t: _t } = useLanguage(); // Renamed t to _t as it's not used
  const navigate = useNavigate();
  const { toast } = useToast();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [license, setLicense] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData: SellerProfileData = { user_id: 0 }; // Initialize with user_id

      if (phone.trim()) profileData.phone = phone.trim();
      if (location.trim()) profileData.location = location.trim();
      if (workplace) {
        if (workplace === "company" && companyName.trim()) {
          profileData.company_name = companyName.trim();
        } else if (workplace === "freelance") {
          profileData.company_name = "freelance";
        }
      }
      if (license.trim()) profileData.license_number = license.trim();

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("User not found");
      }
      profileData.user_id = currentUser.id;

      console.log("Submitting profile data:", profileData);

      const response = await authService.createSellerProfile(profileData);
      console.log("API Response:", response);

      toast({
        title: "Profile updated successfully",
        description: "Welcome to Casa Lingua!",
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      let errorMessage = "Please check your input and try again";

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const errResponse = error.response as { data?: { message?: string; error?: string }, status?: number };
        console.error("Error response:", errResponse.data);
        console.error("Error status:", errResponse.status);
        if (errResponse.data?.message) {
          errorMessage = errResponse.data.message;
        } else if (errResponse.data?.error) {
          errorMessage = errResponse.data.error;
        }
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        errorMessage = error.message;
      }

      toast({
        title: "Error updating profile",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Complete Your Seller Profile
              </CardTitle>
              <p className="text-muted-foreground">
                Add more details to help buyers connect with you
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Photo</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      {avatar ? (
                        <img
                          src={URL.createObjectURL(avatar)}
                          alt="Avatar preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="avatar"
                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Photo
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 rtl:pl-3 rtl:pr-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 rtl:pl-3 rtl:pr-10"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                {/* Workplace */}
                <div className="space-y-2">
                  <Label htmlFor="workplace">Work Type</Label>
                  <Select
                    value={workplace}
                    onValueChange={(value) => {
                      setWorkplace(value);
                      if (value !== "company") {
                        setCompanyName("");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select your work type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="company">
                        Work for a company
                      </SelectItem>
                      <SelectItem value="freelance">Work for myself</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Name - Only show if work for company is selected */}
                {workplace === "company" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 rtl:pl-3 rtl:pr-10"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                )}

                {/* License Number */}
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="license"
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="pl-10 rtl:pl-3 rtl:pr-10"
                      placeholder="Enter your license number"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip for now
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Complete Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileSetup;
