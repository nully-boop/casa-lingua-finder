
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages, Home, Building, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { language, setLanguage, isRTL, t, user, logout, isAuthenticated } = useLanguage();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Casa Lingua</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link 
              to="/" 
              className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t('nav.home')}</span>
            </Link>
            
            <Link 
              to="/properties" 
              className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
            >
              <Building className="h-4 w-4" />
              <span>{t('nav.properties')}</span>
            </Link>

            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{t('nav.dashboard')}</span>
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Languages className="h-4 w-4" />
              <span>{t('nav.language')}</span>
            </Button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-sm text-foreground">
                  {t('dashboard.welcome')}, {user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
