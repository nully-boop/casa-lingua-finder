import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import PropertyMap from '@/components/PropertyMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star, 
  Phone, 
  Mail, 
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Building,
  CheckCircle
} from 'lucide-react';

// Mock property data - in real app this would come from API
const mockProperty = {
  id: 1,
  title: 'Luxury Modern Apartment with Sea View',
  titleAr: 'شقة عصرية فاخرة بإطلالة على البحر',
  type: 'apartment',
  price: 1200000,
  currency: 'AED',
  location: 'Dubai Marina',
  locationAr: 'مرسى دبي',
  address: 'Marina Heights Tower, Dubai Marina, Dubai',
  addressAr: 'برج مرسى الهايتس، مرسى دبي، دبي',
  bedrooms: 3,
  bathrooms: 2,
  area: 1850,
  forSale: true,
  rating: 4.8,
  yearBuilt: 2020,
  furnished: true,
  parking: 2,
  description: 'This stunning 3-bedroom apartment offers breathtaking sea views and modern luxury living. Located in the prestigious Dubai Marina, the property features premium finishes, floor-to-ceiling windows, and access to world-class amenities including swimming pool, gym, and 24/7 security.',
  descriptionAr: 'تقدم هذه الشقة المذهلة المكونة من 3 غرف نوم إطلالات خلابة على البحر ومعيشة عصرية فاخرة. تقع في مرسى دبي المرموق، وتتميز بتشطيبات راقية ونوافذ ممتدة من الأرض إلى السقف والوصول إلى مرافق عالمية المستوى بما في ذلك حمام السباحة والصالة الرياضية والأمن على مدار الساعة.',
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
  ],
  amenities: [
    'Swimming Pool',
    'Gym & Fitness Center',
    'Covered Parking',
    '24/7 Security',
    'Balcony with Sea View',
    'Built-in Wardrobes',
    'Central AC',
    'Concierge Service'
  ],
  amenitiesAr: [
    'حمام سباحة',
    'صالة رياضية ومركز لياقة',
    'موقف مغطى',
    'أمن على مدار الساعة',
    'شرفة بإطلالة على البحر',
    'خزائن مدمجة',
    'تكييف مركزي',
    'خدمة الكونسيرج'
  ],
  agent: {
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    phone: '+971 50 123 4567',
    email: 'ahmed@casalingua.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isFavorited, setIsFavorited] = React.useState(false);

  const formatPrice = (price: number, currency: string, forSale: boolean) => {
    const formattedPrice = price.toLocaleString();
    const period = forSale ? '' : (language === 'ar' ? '/شهر' : '/month');
    return `${formattedPrice} ${currency}${period}`;
  };

  const handleContactAgent = () => {
    // In real app, this would open a contact modal or redirect to contact form
    console.log('Contact agent clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''} mr-2 rtl:mr-0 rtl:ml-2`} />
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative">
              <img
                src={mockProperty.images[selectedImage]}
                alt={language === 'ar' ? mockProperty.titleAr : mockProperty.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
                <Badge variant={mockProperty.forSale ? "default" : "secondary"}>
                  {mockProperty.forSale ? t('common.sale') : t('common.rent')}
                </Badge>
                <div className="bg-white rounded-full p-2">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{mockProperty.rating}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {mockProperty.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property ${index + 1}`}
                  className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all ${
                    selectedImage === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {language === 'ar' ? mockProperty.titleAr : mockProperty.title}
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                      <span>{language === 'ar' ? mockProperty.addressAr : mockProperty.address}</span>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(mockProperty.price, mockProperty.currency, mockProperty.forSale)}
                    </div>
                  </div>

                  <Separator />

                  {/* Property Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{mockProperty.bedrooms}</div>
                        <div className="text-sm text-muted-foreground">{language === 'ar' ? 'غرف النوم' : 'Bedrooms'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{mockProperty.bathrooms}</div>
                        <div className="text-sm text-muted-foreground">{language === 'ar' ? 'الحمامات' : 'Bathrooms'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{mockProperty.area} m²</div>
                        <div className="text-sm text-muted-foreground">{language === 'ar' ? 'المساحة' : 'Area'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{mockProperty.yearBuilt}</div>
                        <div className="text-sm text-muted-foreground">{language === 'ar' ? 'سنة البناء' : 'Year Built'}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Map Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {language === 'ar' ? 'الموقع' : 'Location'}
                    </h3>
                    <PropertyMap 
                      address={language === 'ar' ? mockProperty.addressAr : mockProperty.address}
                      className="mb-4"
                    />
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {language === 'ar' ? 'الوصف' : 'Description'}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === 'ar' ? mockProperty.descriptionAr : mockProperty.description}
                    </p>
                  </div>

                  <Separator />

                  {/* Amenities */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {language === 'ar' ? 'المرافق' : 'Amenities'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(language === 'ar' ? mockProperty.amenitiesAr : mockProperty.amenities).map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Info Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={mockProperty.agent.image}
                    alt={language === 'ar' ? mockProperty.agent.nameAr : mockProperty.agent.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">
                    {language === 'ar' ? mockProperty.agent.nameAr : mockProperty.agent.name}
                  </h3>
                  <p className="text-muted-foreground">{language === 'ar' ? 'وكيل عقاري' : 'Real Estate Agent'}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockProperty.agent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockProperty.agent.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleContactAgent} className="w-full">
                    <Phone className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'اتصل الآن' : 'Call Now'}
                  </Button>
                  <Button variant="outline" onClick={handleContactAgent} className="w-full">
                    <Mail className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'حجز موعد' : 'Schedule Visit'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
