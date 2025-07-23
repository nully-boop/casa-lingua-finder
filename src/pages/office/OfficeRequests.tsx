import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { office } from '@/services/api';
import { IPropertyRequest, RequestStatus } from '@/interfaces/IPropertyRequest';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Home,
  MapPin,
  Calendar,
  DollarSign,
  Bed,
  Bath,
  Square,
  Eye,
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import HeaderOffice from '@/components/office/HeaderOffice';

const OfficeRequests: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<IPropertyRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<IPropertyRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<IPropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<RequestStatus>('pending');
  const { toast } = useToast();
  const { t, language, user, isAuthenticated } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Check if user is authenticated office
  useEffect(() => {
    if (!isAuthenticated || !user || user.type !== 'office') {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAuthenticated || !user || user.type !== 'office') return;

      try {
        setLoading(true);
        
        const [pendingResponse, acceptedResponse, rejectedResponse] = await Promise.all([
          office.getPendingRequestsOffice(),
          office.getAcceptedRequestsOffice(),
          office.getRejectedRequestsOffice(),
        ]);

        setPendingRequests(pendingResponse.data.data || []);
        setAcceptedRequests(acceptedResponse.data.data || []);
        setRejectedRequests(rejectedResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: t('requests.fetchError') || 'Error',
          description: t('requests.fetchErrorDesc') || 'Failed to fetch property requests',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, user, toast, t]);

  // Get requests by status
  const getRequestsByStatus = (status: RequestStatus): IPropertyRequest[] => {
    switch (status) {
      case 'pending':
        return pendingRequests;
      case 'accepted':
        return acceptedRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return [];
    }
  };

  // Get status configuration
  const getStatusConfig = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          label: t('requests.pending') || 'Pending',
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          label: t('requests.accepted') || 'Accepted',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          label: t('requests.rejected') || 'Rejected',
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle property view
  const handleViewProperty = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };

  if (!isAuthenticated || !user || user.type !== 'office') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <HeaderOffice />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back') || 'Back'}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('requests.title') || 'Property Requests'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t('requests.subtitle') || 'Manage your property submission requests'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('requests.pending') || 'Pending'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {pendingRequests.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('requests.accepted') || 'Accepted'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {acceptedRequests.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('requests.rejected') || 'Rejected'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {rejectedRequests.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('common.loading') || 'Loading...'}</span>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RequestStatus)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('requests.pending') || 'Pending'} ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {t('requests.accepted') || 'Accepted'} ({acceptedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {t('requests.rejected') || 'Rejected'} ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>

            {(['pending', 'accepted', 'rejected'] as RequestStatus[]).map((status) => (
              <TabsContent key={status} value={status} className="mt-6">
                <RequestsList
                  requests={getRequestsByStatus(status)}
                  status={status}
                  onViewProperty={handleViewProperty}
                  formatDate={formatDate}
                  formatPrice={formatPrice}
                  getStatusConfig={getStatusConfig}
                  t={t}
                  language={language}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Requests List Component
interface RequestsListProps {
  requests: IPropertyRequest[];
  status: RequestStatus;
  onViewProperty: (propertyId: number) => void;
  formatDate: (date: string) => string;
  formatPrice: (price: number) => string;
  getStatusConfig: (status: RequestStatus) => any;
  t: (key: string) => string;
  language: string;
}

const RequestsList: React.FC<RequestsListProps> = ({
  requests,
  status,
  onViewProperty,
  formatDate,
  formatPrice,
  getStatusConfig,
  t,
  language,
}) => {
  const statusConfig = getStatusConfig(status);

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t(`requests.no${status.charAt(0).toUpperCase() + status.slice(1)}`) || `No ${status} requests`}
            </h3>
            <p className="text-muted-foreground">
              {t(`requests.no${status.charAt(0).toUpperCase() + status.slice(1)}Desc`) || `You don't have any ${status} property requests yet.`}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className={`${statusConfig.borderColor} hover:shadow-lg transition-shadow duration-200`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${statusConfig.bgColor} rounded-lg`}>
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">{request.requestable.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`${statusConfig.color} ${statusConfig.bgColor}`}>
                      <statusConfig.icon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      #{request.requestable.ad_number}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProperty(request.requestable.id)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {t('common.view') || 'View'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.requestable.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">{formatPrice(parseFloat(request.requestable.price))}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span>{request.requestable.rooms} {t('property.rooms') || 'rooms'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bath className="h-4 w-4" />
                <span>{request.requestable.bathrooms} {t('property.bathrooms') || 'bathrooms'}</span>
              </div>
            </div>

            {/* Request Info */}
            <div className="pt-3 border-t border-muted">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t('requests.submittedOn') || 'Submitted on'}: {formatDate(request.created_at)}
                  </span>
                </div>
                {request.updated_at !== request.created_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>
                      {t('requests.lastUpdated') || 'Updated'}: {formatDate(request.updated_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OfficeRequests;
