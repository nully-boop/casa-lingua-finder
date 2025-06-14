
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Image, User } from "lucide-react";
import React from "react";

interface ProfileInfoProps {
  formData: { name: string; phone: string };
  profileImage: string;
  isEditing: boolean;
  isPhotoEditing: boolean;
  photoPreview: string | null;
  avatarFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  profileData: any;
  onStartPhotoEdit: () => void;
  onCancelPhotoEdit: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveProfile: () => void;
  onEditProfile: () => void;
  onCancelEdit: () => void;
  setFormData: React.Dispatch<
    React.SetStateAction<{ name: string; phone: string }>
  >;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  formData,
  profileImage,
  isEditing,
  isPhotoEditing,
  photoPreview,
  avatarFile,
  fileInputRef,
  profileData,
  onStartPhotoEdit,
  onCancelPhotoEdit,
  onAvatarChange,
  onSaveProfile,
  onEditProfile,
  onCancelEdit,
  setFormData,
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-5">
      <Avatar className="h-20 w-20 border-2 border-muted">
        <AvatarImage src={profileImage} alt={formData.name} />
        <AvatarFallback>
          <User className="w-8 h-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <div>
          {isPhotoEditing ? (
            <>
              <Input
                ref={fileInputRef}
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
                disabled={!isEditing}
              />
              <Button
                size="sm"
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isEditing}
              >
                <Image className="h-4 w-4" />
                {photoPreview ? "Change Photo" : "Choose Photo"}
              </Button>
              {photoPreview && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Preview is shown above.
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancelPhotoEdit}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={onStartPhotoEdit}
                disabled={!isEditing}
              >
                <Edit className="h-4 w-4" />
                Edit Photo
              </Button>
            </>
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          Recommended: Square image, max 2MB
        </p>
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        disabled={!isEditing}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone</Label>
      <Input
        id="phone"
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
        disabled={!isEditing}
      />
    </div>
    <div className="space-y-2">
      <Label>User Type</Label>
      <Input value={profileData.user_type || ""} disabled />
    </div>
    <div className="flex gap-2 pt-4">
      {!isEditing ? (
        <Button
          onClick={onEditProfile}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      ) : (
        <>
          <Button
            onClick={onSaveProfile}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
        </>
      )}
    </div>
  </div>
);

export default ProfileInfo;
