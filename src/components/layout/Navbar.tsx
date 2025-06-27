
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Agenda.AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors",
                isActive('/') && "text-blue-600 font-medium"
              )}
            >
              Recursos
            </Link>
            <Link
              to="/"
              className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors"
              )}
            >
              Preços
            </Link>
            <Link
              to="/"
              className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors"
              )}
            >
              Contato
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                <User className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Recursos
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Preços
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contato
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Começar Grátis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
