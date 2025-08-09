import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Settings } from 'lucide-react';

const ClientDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Bem-vindo!
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Gerencie seus agendamentos e encontre os melhores serviços.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-card hover-lift border-border/50 transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <CardTitle className="text-base md:text-lg font-semibold text-foreground">
                  Agendar Serviço
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth hover-glow text-sm md:text-base">
                Novo Agendamento
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover-lift border-border/50 transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-info" />
                </div>
                <CardTitle className="text-base md:text-lg font-semibold text-foreground">
                  Meus Agendamentos
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full border-border/50 text-foreground hover:bg-muted/50 transition-smooth text-sm md:text-base">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover-lift border-border/50 transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                </div>
                <CardTitle className="text-base md:text-lg font-semibold text-foreground">
                  Meu Perfil
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full border-border/50 text-foreground hover:bg-muted/50 transition-smooth text-sm md:text-base">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover-lift border-border/50 transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 md:h-5 md:w-5 text-warning" />
                </div>
                <CardTitle className="text-base md:text-lg font-semibold text-foreground">
                  Configurações
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full border-border/50 text-foreground hover:bg-muted/50 transition-smooth text-sm md:text-base">
                Ajustes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground">Próximos Agendamentos</CardTitle>
              <CardDescription className="text-muted-foreground text-sm md:text-base">
                Seus próximos compromissos agendados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-muted-foreground mb-2">
                  Nenhum agendamento próximo
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Agende seu primeiro serviço para começar
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 md:px-6 transition-smooth hover-glow">
                  Fazer Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground">Serviços Favoritos</CardTitle>
              <CardDescription className="text-muted-foreground text-sm md:text-base">
                Serviços que você mais utiliza
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-muted-foreground mb-2">
                  Nenhum serviço favorito ainda
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Explore nossa variedade de serviços disponíveis
                </p>
                <Button variant="outline" className="border-border/50 text-foreground hover:bg-muted/50 px-4 md:px-6 transition-smooth">
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