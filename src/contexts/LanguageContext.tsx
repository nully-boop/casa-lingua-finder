import IUser from "@/interfaces/IUser";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";
export type UserType = "buyer" | "seller";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  user: IUser | null;
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
    "owner.noPropertiesDescription": "Start by adding your first property listing",
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
    "common.loading.profile": "Loading profile...",
    "common.returnHome": "Return to home",
    "common.loadingProperties": "Loading properties data...",
    "common.retry": "Retry",
    "common.all": "All",

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

    // AI Chat
    "aiChat.title": "Casa AI",
    "aiChat.description": 'Ask anything about "{title}".',
    "aiChat.apiKeyPlaceholder": "Enter your Gemini API Key here (for testing)",
    "aiChat.startConversation": "Ask a question to get started!",
    "aiChat.inputPlaceholder": "Ask about amenities, neighborhood, etc.",
    "aiChat.askAi": "Ask Casa AI",
    "aiChat.globalDescription": "Ask me about our properties!",

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
    "map.enableLocationMessage": "Please enable location access to see the route to this property.",
    "map.tryAgain": "Try Again",
    "map.routeError": "Route Error",
    "map.retry": "Retry",
    "map.yourLocation": "Your Location",
    "map.destination": "Property Location",
    "map.geolocationNotSupported": "Geolocation is not supported by this browser.",
    "map.noRouteFound": "No route could be found.",
    "map.networkError": "Network Error: Could not connect to the routing service. Please check your internet connection.",
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

    // Search and filters
    "search.adType": "Ad Type",
    "search.selectAdType": "Select ad type",
    "search.allAdTypes": "All Ad Types",
    "search.mostViewed": "Most Viewed",
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
    "common.loading.profile": "تحميل ملفك الشخصي ...",
    "common.returnHome": "العودة إلى الصفحة الرئيسية",
    "common.loadingProperties": "جاري تحميل بيانات العقارات...",
    "common.retry": "أعد المحاولة",
    "common.all": "الكل",

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
    "aiChat.title": "كاسا الذكاء الاصطناعي",
    "aiChat.description": 'اسأل أي شيء عن "{title}".',
    "aiChat.apiKeyPlaceholder": "أدخل مفتاح Gemini API الخاص بك هنا (للاختبار)",
    "aiChat.startConversation": "اطرح سؤالً للبدء!",
    "aiChat.inputPlaceholder": "اسأل عن وسائل الراحة، الحي، إلخ.",
    "aiChat.askAi": "اسأل كاسا الذكاء الاصطناعي",
    "aiChat.globalDescription": "اسألني عن عقاراتنا!",

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
    "map.enableLocationMessage": "يرجى تمكين الوصول إلى الموقع لرؤية المسار إلى هذا العقار.",
    "map.tryAgain": "حاول مرة أخرى",
    "map.routeError": "خطأ في المسار",
    "map.retry": "إعادة المحاولة",
    "map.yourLocation": "موقعك",
    "map.destination": "موقع العقار",
    "map.geolocationNotSupported": "تحديد الموقع الجغرافي غير مدعوم في هذا المتصفح.",
    "map.noRouteFound": "لم يتم العثور على مسار.",
    "map.networkError": "خطأ في الشبكة: لا يمكن الاتصال بخدمة المسار. يرجى التحقق من اتصال الإنترنت.",
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

    // Search and filters
    "search.adType": "نوع الإعلان",
    "search.selectAdType": "اختر نوع الإعلان",
    "search.allAdTypes": "جميع أنواع الإعلانات",
    "search.mostViewed": "الأكثر مشاهدة",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [user, setUser] = useState<IUser | null>(null);
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
    document.body.classList.add('language-transition');

    // Add content fade effect
    const contentElements = document.querySelectorAll('main, .content-fade');
    contentElements.forEach(el => {
      el.classList.add('content-fade', 'transitioning');
    });

    setTimeout(() => {
      // Remove transition classes
      document.body.classList.remove('language-transition');
      contentElements.forEach(el => {
        el.classList.remove('transitioning');
      });
      setIsLanguageTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;

    // Add smooth transition classes
    document.body.classList.add('smooth-colors');
    document.documentElement.classList.add('rtl-transition');

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
