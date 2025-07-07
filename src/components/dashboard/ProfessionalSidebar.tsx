import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Clock, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const ProfessionalSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false);
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    {
      title: 'Minha Agenda',
      icon: Calendar,
      href: '/profissional/dashboard',
    },
    {
      title: 'Histórico',
      icon: BarChart3,
      href: '/profissional/historico',
    },
    {
      title: 'Indisponibilidades',
      icon: Clock,
      href: '/profissional/indisponibilidade',
    },
    {
      title: 'Perfil',
      icon: User,
      href: '/profissional/perfil',
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Mobile menu overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 left-4 z-50 md:hidden bg-background border border-border shadow-lg h-10 w-10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 w-72 h-full bg-background border-r border-border z-50 md:hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-foreground">Profissional</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors space-x-3",
                            isActive(item.href)
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <Icon className={cn(
                            "w-6 h-6",
                            isActive(item.href) ? "text-purple-700 dark:text-purple-400" : "text-muted-foreground"
                          )} />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              
              <div className="p-4 border-t border-border">
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "bg-background border-r border-border transition-all duration-300 flex flex-col h-full",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground">Profissional</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          {!collapsed && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center" : "space-x-3",
                    isActive(item.href)
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className={cn(
                    collapsed ? "w-8 h-8" : "w-6 h-6",
                    isActive(item.href) ? "text-purple-700 dark:text-purple-400" : "text-muted-foreground"
                  )} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with theme toggle when collapsed */}
      {collapsed && (
        <div className="p-4 border-t border-border flex justify-center">
          <ThemeToggle />
        </div>
      )}
    </div>
  );
};

export default ProfessionalSidebar;