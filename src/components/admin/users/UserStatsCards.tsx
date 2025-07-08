import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, Loader2 } from 'lucide-react';

interface UserStatsCardsProps {
  totalUsers: number;
  businessOwners: number;
  totalProfessionals: number;
  clients: number;
  isLoading: boolean;
}

export const UserStatsCards = ({ 
  totalUsers, 
  businessOwners, 
  totalProfessionals, 
  clients, 
  isLoading 
}: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalUsers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Proprietários</p>
              <p className="text-2xl font-bold text-purple-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : businessOwners.toLocaleString()}
              </p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Profissionais</p>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalProfessionals.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clientes</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : clients.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};