import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ShareButton from "../buttons/ShareButton";
import { SiriLogo } from "../icons";

interface PropertyImageGalleryProps {
  images: string[];
  title?: string;
  adType?: string;
  views?: number;
  isFavorited: boolean;
  onFavorite: () => void;
  onChat: () => void;
  favoriteQueryFailed?: boolean;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  title,
  adType,
  views,
  isFavorited,
  onFavorite,
  onChat,
}) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = React.useState(0);

  const nextImage = () => {
    setSelectedImage((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      selectedImage === 0 ? images.length - 1 : selectedImage - 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="relative inline-block">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background flex items-center gap-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/50 group"
              onClick={onChat}
            >
              <SiriLogo
                className="h-16 w-16 text-primary transition-all duration-300 group-hover:text-primary-600 group-hover:animate-pulse"
                color="currentColor"
              />

              <span className="text-xs group-hover:text-primary-600 transition-colors">
                {t("aiChat.askAi")}
              </span>
            </Button>

            <span className="absolute -top-2 -right-1 bg-success text-success-foreground text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold shadow-md">
              new
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`bg-background/80 backdrop-blur-sm border border-border/50 ${
              isFavorited
                ? "text-destructive hover:text-destructive/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={onFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>

          <ShareButton />
        </div>

        {/* Ad Type Badge */}
        {adType && (
          <div className="absolute top-4 left-4">
            <Badge variant={adType === "sale" ? "sellColor" : "rentColor"}>
              {adType === "sale" ? t("common.sale") : t("common.rent")}
            </Badge>
          </div>
        )}

        {/* Views Counter */}
        {views !== undefined && (
          <div className="absolute bottom-4 left-4">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm border border-border/50 flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              {views.toLocaleString()}
            </Badge>
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm border border-border/50"
            >
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
              type="button"
              className={`aspect-video rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-border"
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
            <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
              +{images.length - 6}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;
