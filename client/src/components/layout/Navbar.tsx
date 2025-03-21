import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "../language/LanguageSwitcher";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="https://i.ibb.co/Z1822yfQ/logo.png" alt="Logo" />
              <span className="ml-2 text-lg font-semibold text-primary">{t("app.name")}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`${isActive('/') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                {t('nav.home')}
              </Link>
              <Link href="/campaigns" className={`${isActive('/campaigns') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                {t('nav.campaigns')}
              </Link>
              <Link href="/about" className={`${isActive('/about') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                {t('nav.about')}
              </Link>
              <Link href="/contact" className={`${isActive('/contact') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                {t('nav.contact')}
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <LanguageSwitcher />
            <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">{t("nav.search")}</span>
              <Search className="h-6 w-6" />
            </button>

            {user ? (
              <div className="ml-4 flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">{t("nav.dashboard")}</Button>
                </Link>
                {user.userType === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">{t("nav.admin")}</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>{t("nav.logout")}</Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="default" size="sm">{t("nav.login")}</Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" size="sm">{t("nav.signup")}</Button>
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">{t("nav.menu")}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-4 pt-2 pb-2 flex justify-end">
            <LanguageSwitcher />
          </div>
          <div className="pt-2 pb-3 space-y-1">
            <div>
              <Link href="/" className={`${isActive('/') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                {t('nav.home')}
              </Link>
            </div>
            <div>
              <Link href="/campaigns" className={`${isActive('/campaigns') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                {t('nav.campaigns')}
              </Link>
            </div>
            <div>
              <Link href="/about" className={`${isActive('/about') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                {t('nav.about')}
              </Link>
            </div>
            <div>
              <Link href="/contact" className={`${isActive('/contact') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                {t('nav.contact')}
              </Link>
            </div>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              {user ? (
                <div className="flex flex-col space-y-2 w-full">
                  <Link href="/dashboard">
                    <Button className="w-full" variant="default">{t("nav.dashboard")}</Button>
                  </Link>
                  {user.userType === "admin" && (
                    <Link href="/admin">
                      <Button className="w-full" variant="default">{t("nav.admin")}</Button>
                    </Link>
                  )}
                  <Button className="w-full" variant="outline" onClick={handleLogout}>
                    {t("nav.logout")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 w-full">
                  <Link href="/auth">
                    <Button className="w-full" variant="default">{t("nav.login")}</Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full" variant="outline">{t("nav.signup")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
