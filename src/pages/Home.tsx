
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Users, BarChart3, Smartphone, Shield, CheckCircle, Star, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { usePlans } from '@/hooks/usePlans';

const Home = () => {
  const { data: plansData = [], isLoading: plansLoading, error: plansError } = usePlans();
  const features = [
    {
      icon: Calendar,
      title: 'Agendamento Online',
      description: 'Sistema completo de agendamentos com confirmação automática e lembretes por WhatsApp.',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Controle total sobre profissionais, horários, comissões e disponibilidade.',
    },
    {
      icon: BarChart3,
      title: 'Relatórios Inteligentes',
      description: 'Acompanhe faturamento, performance da equipe e métricas do seu negócio.',
    },
    {
      icon: Clock,
      title: 'Controle de Horários',
      description: 'Configure horários flexíveis, intervalos e indisponibilidades por profissional.',
    },
    {
      icon: Smartphone,
      title: 'Landing Page Personalizada',
      description: 'Cada negócio tem sua própria página para que clientes façam agendamentos.',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Dados protegidos com criptografia e backup automático na nuvem.',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      business: 'Salão Bella Vista',
      rating: 5,
      text: 'Revolucionou meu salão! Agora não perco mais agendamentos e minha equipe está mais organizada.',
    },
    {
      name: 'João Santos',
      business: 'Barbearia do João',
      rating: 5,
      text: 'O sistema é muito fácil de usar. Meus clientes amam poder agendar pelo celular a qualquer hora.',
    },
    {
      name: 'Ana Costa',
      business: 'Estética Ana Costa',
      rating: 5,
      text: 'Os relatórios me ajudaram a entender melhor meu negócio. Recomendo para todos os colegas!',
    },
  ];

  // Transform database plans to match UI format
  const plans = plansData.map((plan, index) => ({
    name: plan.name,
    price: `R$ ${plan.price.toFixed(2)}`,
    period: '/mês',
    description: getDescription(plan.name),
    features: getFeaturesList(plan.features),
    popular: index === 1 // Mark the second plan as popular
  }));

  function getDescription(planName: string) {
    const descriptions: { [key: string]: string } = {
      'Básico': 'Ideal para profissionais autônomos',
      'Profissional': 'Perfeito para pequenos salões',
      'Empresarial': 'Para redes e grandes estabelecimentos'
    };
    return descriptions[planName] || 'Plano personalizado para seu negócio';
  }

  function getFeaturesList(features: any): string[] {
    if (!features) return [];
    
    const featuresObj = typeof features === 'string' ? JSON.parse(features) : features;
    const featuresList: string[] = [];
    
    // If benefits are saved in the database, use them directly
    if (featuresObj.benefits && featuresObj.benefits.trim()) {
      const benefitsFromDB = featuresObj.benefits.split('\n')
        .filter((benefit: string) => benefit.trim())
        .map((benefit: string) => benefit.trim());
      
      return benefitsFromDB;
    }
    
    // Fallback: Add limits based on features (for backwards compatibility)
    if (featuresObj.max_businesses) {
      if (featuresObj.max_businesses === -1) {
        featuresList.push('Negócios ilimitados');
      } else {
        featuresList.push(`Até ${featuresObj.max_businesses} negócio(s)`);
      }
    }
    
    if (featuresObj.max_professionals) {
      if (featuresObj.max_professionals === -1) {
        featuresList.push('Profissionais ilimitados');
      } else {
        featuresList.push(`Até ${featuresObj.max_professionals} profissionais`);
      }
    }
    
    // Add standard features for all plans (fallback only)
    featuresList.push('Agendamentos online');
    featuresList.push('Controle de horários');
    featuresList.push('Relatórios básicos');
    
    return featuresList;
  }

  // Show loading state
  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (plansError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="text-center p-8">
          <p className="text-red-600">Erro ao carregar planos. Tente novamente.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              Revolucione seu Salão com Agendamentos Inteligentes
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A plataforma completa para gestão de agendamentos em salões de beleza, barbearias e clínicas de estética.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/cadastro">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto">
                  Começar Gratuitamente
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2">
                  Ver Demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em uma plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos pensados especialmente para o seu tipo de negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de sucesso
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que crescem com seu negócio
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu estabelecimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-2 ${plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'} relative bg-white`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/cadastro">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Começar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de profissionais que já revolucionaram seus salões
          </p>
          <Link to="/cadastro">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
              Começar Gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
