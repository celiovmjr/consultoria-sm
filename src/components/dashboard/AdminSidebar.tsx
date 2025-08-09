
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, BarChart3, Building, Users, Settings, CreditCard, Menu, X, TrendingUp, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

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
      title: 'Dashboard',
      icon: BarChart3,
      href: '/admin/dashboard',
    },
    {
      title: 'Negócios',
      icon: Building,
      href: '/admin/negocios',
    },
    {
      title: 'Usuários',
      icon: Users,
      href: '/admin/usuarios',
    },
    {
      title: 'Planos',
      icon: CreditCard,
      href: '/admin/planos',
    },
    {
      title: 'Relatórios',
      icon: TrendingUp,
      href: '/admin/relatorios',
    },
    {
      title: 'Configurações',
      icon: Settings,
      href: '/admin/configuracoes',
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Mobile overlay handler
  const handleMobileMenuToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Mobile menu overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button - fixed position */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMobileMenuToggle}
          className="fixed top-4 left-4 z-50 md:hidden glass-card h-11 w-11 hover-float"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 w-80 h-full glass-card border-r border-border/20 z-50 md:hidden shadow-apple-xl">
              <div className="p-6 border-b border-border/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-apple">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-lg">Admin SAAS</span>
                    <p className="text-xs text-muted-foreground">Painel Administrativo</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-9 w-9 hover:bg-accent/50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <nav className="flex-1 p-6">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-spring space-x-3 group",
                            isActive(item.href)
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-apple"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          <Icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )} />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              
              {/* User section */}
              <div className="p-6 border-t border-border/20 space-y-3">
                {profile && (
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-accent/30">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">Administrador</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
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
      "glass-card border-r border-border/20 transition-smooth flex flex-col h-full shadow-apple-lg",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border/20 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-apple">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-foreground text-lg">Admin SAAS</span>
              <p className="text-xs text-muted-foreground">Painel Administrativo</p>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {!collapsed && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-9 w-9 hover:bg-accent/50 rounded-lg transition-spring"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-spring group",
                    collapsed ? "justify-center" : "space-x-3",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-apple"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    collapsed ? "w-6 h-6" : "w-5 h-5",
                    "transition-colors",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-6 border-t border-border/20 space-y-3">
        {!collapsed && profile && (
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-accent/30">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "space-x-2"
        )}>
          {collapsed && <ThemeToggle />}
          {!collapsed && <ThemeToggle />}
          {!collapsed ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-spring"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-spring rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
