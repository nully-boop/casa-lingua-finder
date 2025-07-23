import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderOffice from "@/components/office/HeaderOffice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { office } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import AccessDenied from "@/components/AccessDenied";

// Subscription interface
interface Subscription {
  id: number;
  office_id: number;
  subscription_type: "monthly" | "yearly";
  price: string;
  starts_at: string | null;
  expires_at: string | null;
  status: "active" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
}

const Subscriptions = () => {
  const { language, isAuthenticated, hasToken, user, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to format dates with null handling
  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return t("subscriptions.notSpecified");
    }
    try {
      return new Date(dateString).toLocaleDateString(
        language === "ar" ? "ar-EG" : "en-US"
      );
    } catch (error) {
      alert(error);
      return t("subscriptions.invalidDate");
    }
  };

  // Get active subscriptions
  const { data: activeSubscriptions, isLoading: isLoadingActive } = useQuery({
    queryKey: ["active-subscriptions"],
    queryFn: async () => {
      if (!hasToken()) throw new Error("No authentication token found");
      const response = await office.getActiveSubscriptions();
      console.log("Active subscriptions response:", response);
      return response.data?.data || [];
    },
    enabled: isAuthenticated && hasToken() && user?.type === "office",
  });

  // Get pending subscriptions
  const { data: pendingSubscriptions, isLoading: isLoadingPending } = useQuery({
    queryKey: ["pending-subscriptions"],
    queryFn: async () => {
      if (!hasToken()) throw new Error("No authentication token found");
      const response = await office.getPendingSubscriptions();
      console.log("Pending subscriptions response:", response);
      return response.data?.data || [];
    },
    enabled: isAuthenticated && hasToken() && user?.type === "office",
  });

  // Get rejected subscriptions
  const { data: rejectedSubscriptions, isLoading: isLoadingRejected } =
    useQuery({
      queryKey: ["rejected-subscriptions"],
      queryFn: async () => {
        if (!hasToken()) throw new Error("No authentication token found");
        const response = await office.getRejectedSubscriptions();
        console.log("Rejected subscriptions response:", response);
        return response.data?.data || [];
      },
      enabled: isAuthenticated && hasToken() && user?.type === "office",
    });

  const handleRequestSubscription = async (type: "monthly" | "yearly") => {
    setIsSubmitting(true);
    try {
      const price = type === "monthly" ? 50 : 500;
      await office.requestSubscription({ subscription_type: type, price });

      toast({
        title: t("subscriptions.requestSent"),
        description: t("subscriptions.requestSentDesc"),
      });

      // Refresh pending subscriptions
      queryClient.invalidateQueries({ queryKey: ["pending-subscriptions"] });
      setIsRequestDialogOpen(false);
    } catch (error) {
      alert(error);
      toast({
        title: t("dashboard.error"),
        description: t("subscriptions.requestError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("subscriptions.active")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {t("subscriptions.pending")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            {t("subscriptions.rejected")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated || !hasToken() || user?.type !== "office") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderOffice  />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t("subscriptions.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("subscriptions.manage")}
              </p>
            </div>

            <Dialog
              open={isRequestDialogOpen}
              onOpenChange={setIsRequestDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("subscriptions.requestNew")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("subscriptions.requestNew")}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRequestSubscription("monthly")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {t("subscriptions.monthly")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("subscriptions.oneMonth")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">$50</div>
                          <div className="text-sm text-muted-foreground">
                            {t("subscriptions.perMonth")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRequestSubscription("yearly")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {t("subscriptions.yearly")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("subscriptions.oneYear")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">$500</div>
                          <div className="text-sm text-muted-foreground">
                            {t("subscriptions.perYear")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Subscription Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                {t("subscriptions.active")}
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t("subscriptions.pending")}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                {t("subscriptions.rejected")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid gap-4">
                {isLoadingActive ? (
                  <div className="text-center py-8">
                    {t("subscriptions.loading")}
                  </div>
                ) : activeSubscriptions && activeSubscriptions.length > 0 ? (
                  activeSubscriptions.map((subscription: Subscription) => (
                    <Card key={subscription.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div>
                              {getStatusBadge(subscription.status)}
                              <h3 className="font-semibold mt-2 capitalize">
                                {subscription.subscription_type}{" "}
                                {language === "ar" ? "اشتراك" : "Subscription"}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {t("subscriptions.expires")}:{" "}
                                {formatDate(subscription.expires_at)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-lg font-semibold">
                              <DollarSign className="h-4 w-4" />
                              {subscription.price}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">
                        {t("subscriptions.noActive")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("subscriptions.noActiveDesc")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-4">
                {isLoadingPending ? (
                  <div className="text-center py-8">
                    {t("subscriptions.loading")}
                  </div>
                ) : pendingSubscriptions && pendingSubscriptions.length > 0 ? (
                  pendingSubscriptions.map((subscription: Subscription) => (
                    <Card key={subscription.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div>
                              {getStatusBadge(subscription.status)}
                              <h3 className="font-semibold mt-2 capitalize">
                                {subscription.subscription_type}{" "}
                                {language === "ar" ? "اشتراك" : "Subscription"}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {t("subscriptions.requested")}:{" "}
                                {formatDate(subscription.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-lg font-semibold">
                              <DollarSign className="h-4 w-4" />
                              {subscription.price}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">
                        {t("subscriptions.noPending")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("subscriptions.noPendingDesc")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <div className="grid gap-4">
                {isLoadingRejected ? (
                  <div className="text-center py-8">
                    {t("subscriptions.loading")}
                  </div>
                ) : rejectedSubscriptions &&
                  rejectedSubscriptions.length > 0 ? (
                  rejectedSubscriptions.map((subscription: Subscription) => (
                    <Card key={subscription.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div>
                              {getStatusBadge(subscription.status)}
                              <h3 className="font-semibold mt-2 capitalize">
                                {subscription.subscription_type}{" "}
                                {language === "ar" ? "اشتراك" : "Subscription"}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <XCircle className="h-4 w-4 mr-1" />
                                {t("subscriptions.rejectedOn")}:{" "}
                                {formatDate(subscription.updated_at)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-lg font-semibold">
                              <DollarSign className="h-4 w-4" />
                              {subscription.price}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">
                        {t("subscriptions.noRejected")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("subscriptions.noRejectedDesc")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
