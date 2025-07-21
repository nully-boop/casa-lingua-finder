import React, { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, X, ArrowRight } from "lucide-react";
import { PropertyFormData } from "@/pages/office/CreateProperty";

interface MediaUploadStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
}

const MediaUploadStep: React.FC<MediaUploadStepProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const { t } = useLanguage();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length !== files.length) {
      // Show warning for invalid files
    }
    
    updateFormData({
      images: [...formData.images, ...validImages]
    });
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validVideos = files.filter(file => file.type.startsWith('video/'));
    
    if (validVideos.length !== files.length) {
      // Show warning for invalid files
    }
    
    updateFormData({
      videos: [...formData.videos, ...validVideos]
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: newImages });
  };

  const removeVideo = (index: number) => {
    const newVideos = formData.videos.filter((_, i) => i !== index);
    updateFormData({ videos: newVideos });
  };

  const getFilePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {t("property.uploadMediaTitle") || "Upload Property Media"}
        </h3>
        <p className="text-muted-foreground">
          {t("property.uploadMediaDesc") || "Add images and videos to showcase your property (optional)"}
        </p>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            {t("property.images") || "Images"}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center space-x-2"
          >
            <Image className="h-4 w-4" />
            <span>{t("property.addImages") || "Add Images"}</span>
          </Button>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Image Preview Grid */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={getFilePreview(image)}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            {t("property.videos") || "Videos"}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center space-x-2"
          >
            <Video className="h-4 w-4" />
            <span>{t("property.addVideos") || "Add Videos"}</span>
          </Button>
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="hidden"
        />

        {/* Video Preview Grid */}
        {formData.videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.videos.map((video, index) => (
              <div key={index} className="relative group">
                <video
                  src={getFilePreview(video)}
                  className="w-full h-48 object-cover rounded-lg border"
                  controls
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeVideo(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {video.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Guidelines */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          {t("property.uploadGuidelines") || "Upload Guidelines"}
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t("property.guideline1") || "Images: JPG, PNG, WebP (max 10MB each)"}</li>
          <li>• {t("property.guideline2") || "Videos: MP4, MOV, AVI (max 100MB each)"}</li>
          <li>• {t("property.guideline3") || "Maximum 20 images and 5 videos"}</li>
          <li>• {t("property.guideline4") || "High-quality media helps attract more buyers"}</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="flex items-center space-x-2">
          <span>{t("common.next") || "Next"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MediaUploadStep;
