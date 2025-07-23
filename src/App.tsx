import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Properties from "./pages/Property/Properties";
import Dashboard from "./pages/office/Dashboard";
import CreateProperty from "./pages/office/CreateProperty";
import OfficeFollowers from "./pages/office/OfficeFollowers";
import OfficeRequests from "./pages/office/OfficeRequests";
import PropertyDetails from "./pages/Property/PropertyDetails";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";
import Subscriptions from "./pages/office/Subscriptions";
import SellerProfileSetup from "./pages/office/SellerProfileSetup";
import OfficeProfile from "./pages/office/OfficeProfile";
import AdminPanel from "./pages/admin/AdminPanel";
import ManageOffices from "./pages/admin/ManageOffices";
import ManageProperties from "./pages/admin/ManageProperties";
import ManageSubscriptions from "./pages/admin/ManageSubscriptions";
import Owner from "./pages/office/Owner";
import NotFound from "./pages/NotFound";
import FavoritesPage from "./pages/user/FavoritesPage";
import VoiceChatPage from "./pages/AI/VoiceChatPage";
import PropertiesOffice from "./pages/office/Properties-office";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useLanguage();

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <SidebarProvider defaultOpen={false}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<Properties />} />
                <Route
                  path="/properties-office"
                  element={<PropertiesOffice />}
                />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-property" element={<CreateProperty />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/followers" element={<OfficeFollowers />} />
                <Route path="/requests" element={<OfficeRequests />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/seller-setup" element={<SellerProfileSetup />} />
                <Route path="/owner" element={<Owner />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/voice-chat" element={<VoiceChatPage />} />
                <Route path="/office/:id" element={<OfficeProfile />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/offices" element={<ManageOffices />} />
                <Route path="/admin/properties" element={<ManageProperties />} />
                <Route path="/admin/subscriptions" element={<ManageSubscriptions />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <main className="min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-property" element={<CreateProperty />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/followers" element={<OfficeFollowers />} />
            <Route path="/requests" element={<OfficeRequests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/seller-setup" element={<SellerProfileSetup />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="/voice-chat" element={<VoiceChatPage />} />
            <Route path="/office/:id" element={<OfficeProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/offices" element={<ManageOffices />} />
            <Route path="/admin/properties" element={<ManageProperties />} />
            <Route path="/admin/subscriptions" element={<ManageSubscriptions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      )}
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
