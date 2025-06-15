
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2 } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  adType: string;
  isFavorited: boolean;
  isRTL: boolean;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  onFavorite: () => void;
  onShare: () => void;
  language: string;
  t: (key: string) => string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  title,
  adType,
  isFavorited,
  isRTL,
  selectedImage,
  setSelectedImage,
  onFavorite,
  onShare,
  language,
  t,
}) => (
  <div>
    {/* Main Image */}
    <div className="relative">
      <img
        src={images[selectedImage]}
        alt={title}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
        <Badge variant={adType === "sale" ? "default" : "secondary"}>
          {adType === "sale" ? t("common.sale") : t("common.rent")}
        </Badge>
      </div>
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onFavorite}
          className="bg-white/90 hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
    {/* Thumbnails */}
    {images.length > 1 && (
      <div className="grid grid-cols-4 gap-4 mt-2">
        {images.slice(0, 4).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Property ${index + 1}`}
            className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all ${
              selectedImage === index
                ? "ring-2 ring-primary"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setSelectedImage(index)}
          />
        ))}
      </div>
    )}
  </div>
);

export default PropertyImageGallery;
