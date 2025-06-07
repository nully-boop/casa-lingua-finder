import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    titleAr: 'شقة عصرية في وسط المدينة',
    type: 'apartment',
    price: 850000,
    currency: 'AED',
    location: 'Dubai Marina',
    locationAr: 'مرسى دبي',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    forSale: true,
    rating: 4.8
  },
  {
    id: 2,
    title: 'Luxury Villa with Pool',
    titleAr: 'فيلا فاخرة مع مسبح',
    type: 'villa',
    price: 12000,
    currency: 'AED',
    location: 'Palm Jumeirah',
    locationAr: 'نخلة جميرا',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    forSale: false,
    rating: 4.9
  },
  {
    id: 3,
    title: 'Commercial Office Space',
    titleAr: 'مساحة مكتبية تجارية',
    type: 'office',
    price: 2500000,
    currency: 'AED',
    location: 'Business Bay',
    locationAr: 'خليج الأعمال',
    bedrooms: 0,
    bathrooms: 2,
    area: 800,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    forSale: true,
    rating: 4.7
  }
];

const Index = () => {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedType) params.set('type', selectedType);
    if (priceRange) params.set('price', priceRange);
    
    navigate(`/properties?${params.toString()}`);
  };

  const formatPrice = (price: number, currency: string, forSale: boolean) => {
    const formattedPrice = price.toLocaleString();
    const period = forSale ? '' : (language === 'ar' ? '/شهر' : '/month');
    return `${formattedPrice} ${currency}${period}`;
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 animate-fade-in">
              {t('hero.subtitle')}
            </p>
            
            {/* Search Form */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl animate-scale-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-gray-400`} />
                  <Input
                    placeholder={t('hero.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${isRTL ? 'pr-10' : 'pl-10'} text-black h-12`}
                  />
                </div>
                
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 text-black">
                    <SelectValue placeholder={t('hero.location')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="dubai-marina">{language === 'ar' ? 'مرسى دبي' : 'Dubai Marina'}</SelectItem>
                    <SelectItem value="palm-jumeirah">{language === 'ar' ? 'نخلة جميرا' : 'Palm Jumeirah'}</SelectItem>
                    <SelectItem value="business-bay">{language === 'ar' ? 'خليج الأعمال' : 'Business Bay'}</SelectItem>
                    <SelectItem value="downtown">{language === 'ar' ? 'وسط المدينة' : 'Downtown'}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 text-black">
                    <SelectValue placeholder={t('hero.type')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="apartment">{t('type.apartment')}</SelectItem>
                    <SelectItem value="villa">{t('type.villa')}</SelectItem>
                    <SelectItem value="land">{t('type.land')}</SelectItem>
                    <SelectItem value="office">{t('type.office')}</SelectItem>
                    <SelectItem value="shop">{t('type.shop')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12 text-black">
                    <SelectValue placeholder={t('hero.price')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0-500000">0 - 500K AED</SelectItem>
                    <SelectItem value="500000-1000000">500K - 1M AED</SelectItem>
                    <SelectItem value="1000000-2000000">1M - 2M AED</SelectItem>
                    <SelectItem value="2000000+">2M+ AED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSearch} 
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {t('hero.searchBtn')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'العقارات المميزة' : 'Featured Properties'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'ar' ? 'اكتشف أفضل العقارات المتاحة' : 'Discover the best properties available'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card 
                key={property.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in cursor-pointer"
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={language === 'ar' ? property.titleAr : property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    <Badge variant={property.forSale ? "default" : "secondary"}>
                      {property.forSale ? t('common.sale') : t('common.rent')}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white rounded-full p-2">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'ar' ? property.titleAr : property.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    <span>{language === 'ar' ? property.locationAr : property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Square className="h-4 w-4" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(property.price, property.currency, property.forSale)}
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handlePropertyClick(property.id);
                    }}>
                      {t('common.view')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
