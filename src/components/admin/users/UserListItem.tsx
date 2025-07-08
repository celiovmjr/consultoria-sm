import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Building, Edit } from 'lucide-react';

interface UserListItemProps {
  user: any;
  onEdit: (user: any) => void;
  getStatusColor: (status: string) => string;
  getRoleColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
  getBusinessName: (businessId: string) => string;
  deleteComponent: React.ReactNode;
}

export const UserListItem = ({ 
  user, 
  onEdit, 
  getStatusColor, 
  getRoleColor, 
  getRoleLabel, 
  getBusinessName,
  deleteComponent
}: UserListItemProps) => {
  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 ml-14">
            <Badge className={getRoleColor(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
            <Badge className={getStatusColor(user.status)}>
              {user.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
            {user.business_id && (
              <span className="text-sm text-muted-foreground">
                <Building className="w-3 h-3 inline mr-1" />
                {getBusinessName(user.business_id)}
              </span>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 ml-14">
            Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          {deleteComponent}
        </div>
      </div>
    </div>
  );
};