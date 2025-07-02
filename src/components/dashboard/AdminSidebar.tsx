
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BarChart3, Building, Users, Settings, CreditCard, Menu, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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

  return (
    <div className={cn(
      "bg-background border-r border-border transition-all duration-300 flex flex-col h-full",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground">Admin SAAS</span>
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className={cn(
                    collapsed ? "w-8 h-8" : "w-6 h-6",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
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

export default AdminSidebar;
