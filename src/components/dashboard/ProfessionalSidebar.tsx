
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Clock, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProfessionalSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Minha Agenda',
      icon: Calendar,
      href: '/professional/agenda',
    },
    {
      title: 'Histórico',
      icon: BarChart3,
      href: '/professional/historico',
    },
    {
      title: 'Indisponibilidades',
      icon: Clock,
      href: '/professional/indisponibilidades',
    },
    {
      title: 'Perfil',
      icon: User,
      href: '/professional/perfil',
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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Profissional</span>
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
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive(item.href) ? "text-purple-700" : "text-gray-500"
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

export default ProfessionalSidebar;
