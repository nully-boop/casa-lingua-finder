
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  title?: string;
  adType?: string;
  isFavorited: boolean;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  onFavorite: () => void;
  onShare: () => void;
  t: (key: string) => string; // This was reported as unused
  favoriteQueryFailed?: boolean; // Added based on previous subtask's intention
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  title,
  adType,
  isFavorited,
  selectedImage,
  setSelectedImage,
  onFavorite,
  onShare,
}) => {
  const nextImage = () => {
    setSelectedImage((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
        <img
          src={images[selectedImage]}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`bg-white/80 hover:bg-white ${
              isFavorited 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-600 hover:text-gray-700'
            }`}
            onClick={onFavorite}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} 
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Ad Type Badge */}
        {adType && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90">
              {adType}
            </Badge>
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4">
            <Badge variant="secondary" className="bg-black/70 text-white">
              {selectedImage + 1} / {images.length}
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.slice(0, 6).map((image, index) => (
            <button
              key={index}
              className={`aspect-video rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {images.length > 6 && (
            <div className="aspect-video rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-500">
              +{images.length - 6}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;
