import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Settings } from 'lucide-react';

const ClientDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Bem-vindo, !
          </h1>
          <p className="text-slate-600 text-lg">
            Gerencie seus agendamentos e encontre os melhores serviços.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Agendar Serviço
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Novo Agendamento
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Meus Agendamentos
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Meu Perfil
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-slate-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Configurações
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                Ajustes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900">Próximos Agendamentos</CardTitle>
              <CardDescription className="text-slate-600">
                Seus próximos compromissos agendados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-6">Nenhum agendamento próximo</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Fazer Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900">Serviços Favoritos</CardTitle>
              <CardDescription className="text-slate-600">
                Serviços que você mais utiliza
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-6">Nenhum serviço favorito ainda</p>
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 px-6">
                  Explorar Serviços
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;