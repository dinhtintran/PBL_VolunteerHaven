import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
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
              <img className="h-8 w-auto" src="https://cdn-icons-png.flaticon.com/512/2904/2904855.png" alt="Logo" />
              <span className="ml-2 text-lg font-semibold text-primary">GiveHope</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`${isActive('/') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                Home
              </Link>
              <Link href="/campaigns" className={`${isActive('/campaigns') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                Campaigns
              </Link>
              <Link href="/about" className={`${isActive('/about') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                About
              </Link>
              <Link href="/contact" className={`${isActive('/contact') ? 'border-b-2 border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} px-1 pt-1 inline-flex items-center text-sm font-medium`}>
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Search</span>
              <Search className="h-6 w-6" />
            </button>

            {user ? (
              <div className="ml-4 flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="default" size="sm">Sign in</Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" size="sm">Sign up</Button>
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
              <span className="sr-only">Open menu</span>
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
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`${isActive('/') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                Home
              </a>
            </Link>
            <Link href="/campaigns">
              <a className={`${isActive('/campaigns') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                Campaigns
              </a>
            </Link>
            <Link href="/about">
              <a className={`${isActive('/about') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className={`${isActive('/contact') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} block pl-3 pr-4 py-2 text-base font-medium`}>
                Contact
              </a>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              {user ? (
                <div className="flex flex-col space-y-2 w-full">
                  <Link href="/dashboard">
                    <Button className="w-full" variant="default">Dashboard</Button>
                  </Link>
                  <Button className="w-full" variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 w-full">
                  <Link href="/auth">
                    <Button className="w-full" variant="default">Sign in</Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full" variant="outline">Sign up</Button>
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
