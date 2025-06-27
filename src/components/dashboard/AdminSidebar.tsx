import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BarChart3, Building, Users, Settings, CreditCard, Menu, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Admin SAAS</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
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
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive(item.href) ? "text-blue-700" : "text-gray-500"
                  )} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
