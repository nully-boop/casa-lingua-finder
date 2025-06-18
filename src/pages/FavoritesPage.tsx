
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import PropertyList from "@/components/properties/PropertyList";

interface FavoriteItem {
  id: number;
  user_id: number;
  favoriteable_type: string;
  favoriteable_id: number;
  created_at: string;
  updated_at: string;
  favoriteable: {
    id: number;
    owner_type: string;
    owner_id: number;
    ad_number: string;
    title: string;
    description: string;
    price: string;
    location: string;
    latitude: string;
    longitude: string;
    area: string;
    floor_number: number;
    ad_type: string;
    type: string;
    status: string;
    is_offer: number;
    offer_expires_at: string;
    currency: string;
    views: number;
    bathrooms: number;
    rooms: number;
    seller_type: string;
    direction: string;
    furnishing: string;
    features: string | null;
    is_available: number;
    created_at: string;
    updated_at: string;
  };
}

const FavoritesPage = () => {
  const { language, isAuthenticated } = useLanguage();

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

  const {
    data: favoritesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      const response = await propertiesAPI.getFavorites();
      return response.data;
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  if (!isAuthenticated || !hasToken()) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === "ar" ? "الوصول مرفوض" : "Access Denied"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === "ar" 
              ? "يجب تسجيل الدخول للوصول إلى هذه الصفحة."
              : "You need to be logged in to access this page."}
          </p>
          <Link to="/login">
            <Button>{language === "ar" ? "تسجيل الدخول" : "Login"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === "ar" ? "جاري تحميل المفضلة..." : "Loading favorites..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === "ar" ? "خطأ" : "Error"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === "ar" 
              ? `فشل في تحميل المفضلة: ${errorMessage}`
              : `Failed to load favorites: ${errorMessage}`}
          </p>
          <Button onClick={() => window.location.reload()}>
            {language === "ar" ? "إعادة المحاولة" : "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  // Transform favorites data to property format
  const favoriteProperties = favoritesData?.data?.map((favorite: FavoriteItem) => ({
    ...favorite.favoriteable,
    price: parseFloat(favorite.favoriteable.price),
    area: parseFloat(favorite.favoriteable.area),
    images: [], // Will be handled by PropertyCard with placeholder
    video: null,
    relaitedproperties: [],
    owner: null,
    bedrooms: favorite.favoriteable.rooms,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Heart className="h-6 w-6 text-red-500 mr-3 rtl:mr-0 rtl:ml-3" />
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "العقارات المفضلة" : "Favorite Properties"}
            </h1>
          </div>

          {favoriteProperties.length === 0 ? (
            <Card>
              <CardContent className="p-16 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {language === "ar" ? "لا توجد عقارات مفضلة" : "No Favorite Properties"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {language === "ar" 
                    ? "لم تقم بإضافة أي عقارات إلى المفضلة بعد."
                    : "You haven't added any properties to your favorites yet."}
                </p>
                <Link to="/properties">
                  <Button>
                    {language === "ar" ? "تصفح العقارات" : "Browse Properties"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {language === "ar" 
                  ? `لديك ${favoriteProperties.length} عقار مفضل`
                  : `You have ${favoriteProperties.length} favorite ${favoriteProperties.length === 1 ? 'property' : 'properties'}`}
              </p>
              <PropertyList properties={favoriteProperties} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
