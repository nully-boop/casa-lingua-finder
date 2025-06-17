import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AddProperty = () => {
  const { t, language, user, isAuthenticated } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    type: '',
    listingType: 'sale',
    price: '',
    city: '',
    area: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    description: '',
    descriptionAr: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || user?.user_type !== 'seller') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in as a seller to access this page.</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 6)); // Limit to 6 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: language === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully',
        description: language === 'ar' ? 'تم نشر إعلان العقار الخاص بك' : 'Your property listing has been published',
      });
      
      navigate('/dashboard');
    } catch (_error) { // Prefixed error
      toast({
        title: language === 'ar' ? 'فشل في إضافة العقار' : 'Failed to add property',
        description: language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('add.title')}</h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'املأ جميع التفاصيل لإضافة عقارك الجديد' : 'Fill in all the details to add your new property'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('add.propertyTitle')} ({language === 'ar' ? 'بالإنجليزية' : 'English'})</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter property title in English"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="titleAr">{t('add.propertyTitle')} ({language === 'ar' ? 'بالعربية' : 'Arabic'})</Label>
                    <Input
                      id="titleAr"
                      value={formData.titleAr}
                      onChange={(e) => handleInputChange('titleAr', e.target.value)}
                      placeholder="أدخل عنوان العقار بالعربية"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('add.propertyType')}</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('add.propertyType')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="apartment">{t('type.apartment')}</SelectItem>
                        <SelectItem value="villa">{t('type.villa')}</SelectItem>
                        <SelectItem value="land">{t('type.land')}</SelectItem>
                        <SelectItem value="office">{t('type.office')}</SelectItem>
                        <SelectItem value="shop">{t('type.shop')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('add.listingType')}</Label>
                    <RadioGroup 
                      value={formData.listingType} 
                      onValueChange={(value) => handleInputChange('listingType', value)}
                      className="flex space-x-6 rtl:space-x-reverse"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="sale" id="sale" />
                        <Label htmlFor="sale">{t('common.sale')}</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="rent" id="rent" />
                        <Label htmlFor="rent">{t('common.rent')}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{t('add.price')} (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder={formData.listingType === 'sale' ? '1,000,000' : '5,000'}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{t('common.location')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('add.city')}</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('add.city')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="dubai">Dubai</SelectItem>
                        <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                        <SelectItem value="sharjah">Sharjah</SelectItem>
                        <SelectItem value="ajman">Ajman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">{t('add.area')}</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="e.g., Dubai Marina, Downtown"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t('add.address')}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Full address with building/street details"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'تفاصيل العقار' : 'Property Details'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">{t('add.bedrooms')}</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="0">Studio</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">{t('add.bathrooms')}</Label>
                    <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">{t('add.size')}</Label>
                    <Input
                      id="size"
                      type="number"
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      placeholder="1200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('add.description')} ({language === 'ar' ? 'بالإنجليزية' : 'English'})</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your property features, amenities, and highlights"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">{t('add.description')} ({language === 'ar' ? 'بالعربية' : 'Arabic'})</Label>
                  <Textarea
                    id="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    placeholder="اوصف ميزات العقار والمرافق والنقاط المميزة"
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{t('add.images')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="text-lg font-medium mb-2">{t('add.uploadImages')}</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar' ? 'ارفع حتى 6 صور للعقار' : 'Upload up to 6 images of your property'}
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="images"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('images')?.click()}
                    >
                      <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {language === 'ar' ? 'اختر الصور' : 'Choose Images'}
                    </Button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 rtl:right-auto rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Publishing...' : (language === 'ar' ? 'نشر العقار' : 'Publish Property')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
