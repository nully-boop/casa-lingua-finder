
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type UserType = 'buyer' | 'seller';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  token: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.language': 'العربية',
    
    // Hero Section
    'hero.title': 'Find Your Perfect Property',
    'hero.subtitle': 'Discover amazing properties for sale and rent in your preferred location',
    'hero.search': 'Search properties...',
    'hero.location': 'Location',
    'hero.type': 'Property Type',
    'hero.price': 'Price Range',
    'hero.searchBtn': 'Search Properties',
    
    // Property Types
    'type.apartment': 'Apartment',
    'type.villa': 'Villa',
    'type.land': 'Land',
    'type.office': 'Office',
    'type.shop': 'Shop',
    
    // Common
    'common.sale': 'For Sale',
    'common.rent': 'For Rent',
    'common.bedrooms': 'Bedrooms',
    'common.bathrooms': 'Bathrooms',
    'common.area': 'Area',
    'common.price': 'Price',
    'common.location': 'Location',
    'common.description': 'Description',
    'common.images': 'Images',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View Details',
    'common.contact': 'Contact Seller',
    
    // Authentication
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Name',
    'auth.userType': 'Account Type',
    'auth.buyer': 'Buyer',
    'auth.seller': 'Seller',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.loginTitle': 'Welcome Back',
    'auth.registerTitle': 'Create Account',
    'auth.loginSubtitle': 'Sign in to your account',
    'auth.registerSubtitle': 'Join our property platform',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.stats': 'Your Statistics',
    'dashboard.properties': 'Properties',
    'dashboard.views': 'Total Views',
    'dashboard.inquiries': 'Inquiries',
    'dashboard.addProperty': 'Add New Property',
    'dashboard.myProperties': 'My Properties',
    'dashboard.recentProperties': 'Recent Properties',
    
    // Add Property
    'add.title': 'Add New Property',
    'add.propertyTitle': 'Property Title',
    'add.propertyType': 'Property Type',
    'add.listingType': 'Listing Type',
    'add.price': 'Price',
    'add.city': 'City',
    'add.area': 'Area',
    'add.address': 'Full Address',
    'add.bedrooms': 'Number of Bedrooms',
    'add.bathrooms': 'Number of Bathrooms',
    'add.size': 'Size (m²)',
    'add.description': 'Property Description',
    'add.images': 'Property Images',
    'add.uploadImages': 'Upload Images',
    
    // Search & Filters
    'search.results': 'Search Results',
    'search.filters': 'Filters',
    'search.priceRange': 'Price Range',
    'search.minPrice': 'Min Price',
    'search.maxPrice': 'Max Price',
    'search.applyFilters': 'Apply Filters',
    'search.clearFilters': 'Clear Filters',
    'search.sortBy': 'Sort By',
    'search.newest': 'Newest First',
    'search.oldest': 'Oldest First',
    'search.priceLow': 'Price: Low to High',
    'search.priceHigh': 'Price: High to Low',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.dashboard': 'لوحة التحكم',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.language': 'English',
    
    // Hero Section
    'hero.title': 'اعثر على العقار المثالي',
    'hero.subtitle': 'اكتشف عقارات مذهلة للبيع والإيجار في موقعك المفضل',
    'hero.search': 'البحث عن العقارات...',
    'hero.location': 'الموقع',
    'hero.type': 'نوع العقار',
    'hero.price': 'نطاق السعر',
    'hero.searchBtn': 'البحث عن العقارات',
    
    // Property Types
    'type.apartment': 'شقة',
    'type.villa': 'فيلا',
    'type.land': 'أرض',
    'type.office': 'مكتب',
    'type.shop': 'محل تجاري',
    
    // Common
    'common.sale': 'للبيع',
    'common.rent': 'للإيجار',
    'common.bedrooms': 'غرف النوم',
    'common.bathrooms': 'دورات المياه',
    'common.area': 'المساحة',
    'common.price': 'السعر',
    'common.location': 'الموقع',
    'common.description': 'الوصف',
    'common.images': 'الصور',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض التفاصيل',
    'common.contact': 'اتصل بالبائع',
    
    // Authentication
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.name': 'الاسم',
    'auth.userType': 'نوع الحساب',
    'auth.buyer': 'مشتري',
    'auth.seller': 'بائع',
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.resetPassword': 'إعادة تعيين كلمة المرور',
    'auth.loginTitle': 'مرحباً بعودتك',
    'auth.registerTitle': 'إنشاء حساب جديد',
    'auth.loginSubtitle': 'تسجيل الدخول إلى حسابك',
    'auth.registerSubtitle': 'انضم إلى منصة العقارات الخاصة بنا',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بعودتك',
    'dashboard.stats': 'إحصائياتك',
    'dashboard.properties': 'العقارات',
    'dashboard.views': 'إجمالي المشاهدات',
    'dashboard.inquiries': 'الاستفسارات',
    'dashboard.addProperty': 'إضافة عقار جديد',
    'dashboard.myProperties': 'عقاراتي',
    'dashboard.recentProperties': 'العقارات الحديثة',
    
    // Add Property
    'add.title': 'إضافة عقار جديد',
    'add.propertyTitle': 'عنوان العقار',
    'add.propertyType': 'نوع العقار',
    'add.listingType': 'نوع الإعلان',
    'add.price': 'السعر',
    'add.city': 'المدينة',
    'add.area': 'المنطقة',
    'add.address': 'العنوان الكامل',
    'add.bedrooms': 'عدد غرف النوم',
    'add.bathrooms': 'عدد دورات المياه',
    'add.size': 'المساحة (م²)',
    'add.description': 'وصف العقار',
    'add.images': 'صور العقار',
    'add.uploadImages': 'رفع الصور',
    
    // Search & Filters
    'search.results': 'نتائج البحث',
    'search.filters': 'المرشحات',
    'search.priceRange': 'نطاق السعر',
    'search.minPrice': 'أقل سعر',
    'search.maxPrice': 'أعلى سعر',
    'search.applyFilters': 'تطبيق المرشحات',
    'search.clearFilters': 'مسح المرشحات',
    'search.sortBy': 'ترتيب حسب',
    'search.newest': 'الأحدث أولاً',
    'search.oldest': 'الأقدم أولاً',
    'search.priceLow': 'السعر: من الأقل للأعلى',
    'search.priceHigh': 'السعر: من الأعلى للأقل',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedUser = localStorage.getItem('user');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update font family based on language
    if (language === 'ar') {
      document.body.style.fontFamily = 'Rubik, sans-serif';
    } else {
      document.body.style.fontFamily = 'Poppins, sans-serif';
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isRTL = language === 'ar';
  const isAuthenticated = !!user;

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      isRTL,
      t,
      user,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
