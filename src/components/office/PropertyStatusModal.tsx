import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { office } from '@/services/api';
import IProperty from '@/interfaces/IProperty';
import { Loader2, Home, CheckCircle, Key } from 'lucide-react';

interface PropertyStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: IProperty | null;
}

const PropertyStatusModal: React.FC<PropertyStatusModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const { t, language, user, isAuthenticated } = useLanguage();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Status options with icons and colors
  const statusOptions = [
    {
      value: 'available',
      label: language === 'ar' ? 'متاح' : 'Available',
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      value: 'sold',
      label: language === 'ar' ? 'مباع' : 'Sold',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      value: 'rented',
      label: language === 'ar' ? 'مؤجر' : 'Rented',
      icon: Key,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  // Set default status when property changes
  React.useEffect(() => {
    if (property) {
      setSelectedStatus(property.position || 'available');
    }
  }, [property]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedStatus('');
      setIsUpdating(false);
    }
  }, [isOpen]);

  const handleStatusUpdate = async () => {
    if (!property || !selectedStatus) return;

    // Validate office authentication
    if (!isAuthenticated || !user || user.type !== 'office') {
      toast({
        title: t('common.error') || 'Error',
        description: t('auth.officeRequired') || 'Office authentication required to update property status.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);

      await office.changePropertyStatus(property.id, selectedStatus);
      
      toast({
        title: t('property.statusUpdated') || 'Status Updated',
        description: t('property.statusUpdatedDesc') || 'Property status has been updated successfully.',
        variant: 'default',
      });

      onClose();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast({
        title: t('common.error') || 'Error',
        description: t('property.statusUpdateError') || 'Failed to update property status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentStatusOption = () => {
    return statusOptions.find(option => option.value === selectedStatus);
  };

  const getStatusIcon = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;
    const Icon = option.icon;
    return <Icon className={`h-4 w-4 ${option.color}`} />;
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            {t('property.updateStatus') || 'Update Property Status'}
          </DialogTitle>
          <DialogDescription>
            {t('property.updateStatusDesc') || 'Change the status of this property to reflect its current availability.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Property Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              {t('property.propertyInfo') || 'Property Information'}
            </h4>
            <div className="space-y-1">
              <p className="font-semibold">{property.title}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>{property.location}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {t('property.currentStatus') || 'Current Status'}:
                </span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(property.position || 'available')}
                  <span className="text-sm font-medium">
                    {statusOptions.find(opt => opt.value === (property.position || 'available'))?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status-select">
              {t('property.newStatus') || 'New Status'}
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status-select">
                <SelectValue placeholder={t('property.selectStatus') || 'Select status'} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Status Preview */}
          {selectedStatus && (
            <div className="p-3 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('property.newStatusPreview') || 'New status will be'}:
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getCurrentStatusOption()?.bgColor}`}>
                  {getStatusIcon(selectedStatus)}
                  <span className={`text-sm font-medium ${getCurrentStatusOption()?.color}`}>
                    {getCurrentStatusOption()?.label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || !selectedStatus || selectedStatus === property.position}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('property.updating') || 'Updating...'}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('property.updateStatus') || 'Update Status'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyStatusModal;
