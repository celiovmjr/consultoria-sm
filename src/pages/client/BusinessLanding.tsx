
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone, Star, User, Scissors, Heart } from 'lucide-react';

const BusinessLanding = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const businessInfo = {
    name: 'Salão Bella Vista',
    description: 'O melhor em beleza e bem-estar para você. Profissionais especializados e ambiente acolhedor.',
    address: 'Rua das Flores, 123 - Centro, São Paulo',
    phone: '(11) 3333-4444',
    whatsapp: '(11) 99999-9999',
    rating: 4.8,
    reviews: 156,
    instagram: '@salaobella',
    facebook: 'Salão Bella Vista',
  };

  const services = [
    {
      id: 1,
      category: 'Cabelos',
      icon: Scissors,
      items: [
        { name: 'Corte Feminino', duration: '60 min', price: 'R$ 45' },
        { name: 'Corte Masculino', duration: '45 min', price: 'R$ 35' },
        { name: 'Escova', duration: '45 min', price: 'R$ 25' },
        { name: 'Coloração', duration: '120 min', price: 'R$ 80' },
        { name: 'Luzes', duration: '150 min', price: 'R$ 120' },
      ]
    },
    {
      id: 2,
      category: 'Unhas',
      icon: Heart,
      items: [
        { name: 'Manicure', duration: '45 min', price: 'R$ 25' },
        { name: 'Pedicure', duration: '60 min', price: 'R$ 30' },
        { name: 'Esmaltação em Gel', duration: '60 min', price: 'R$ 35' },
        { name: 'Unha Decorada', duration: '90 min', price: 'R$ 45' },
      ]
    },
    {
      id: 3,
      category: 'Estética',
      icon: Star,
      items: [
        { name: 'Limpeza de Pele', duration: '90 min', price: 'R$ 80' },
        { name: 'Hidratação Facial', duration: '60 min', price: 'R$ 60' },
        { name: 'Massagem Relaxante', duration: '60 min', price: 'R$ 70' },
        { name: 'Drenagem Linfática', duration: '90 min', price: 'R$ 90' },
      ]
    },
  ];

  const professionals = [
    {
      name: 'Ana Costa',
      specialty: 'Especialista em Cabelo',
      experience: '8 anos',
      photo: '/placeholder.svg',
      rating: 4.9,
    },
    {
      name: 'Maria Silva',
      specialty: 'Nail Designer',
      experience: '5 anos',
      photo: '/placeholder.svg',
      rating: 4.8,
    },
    {
      name: 'Lucia Mendes',
      specialty: 'Esteticista',
      experience: '10 anos',
      photo: '/placeholder.svg',
      rating: 4.9,
    },
  ];

  const workingHours = [
    { day: 'Segunda', hours: '09:00 - 18:00' },
    { day: 'Terça', hours: '09:00 - 18:00' },
    { day: 'Quarta', hours: '09:00 - 18:00' },
    { day: 'Quinta', hours: '09:00 - 20:00' },
    { day: 'Sexta', hours: '09:00 - 20:00' },
    { day: 'Sábado', hours: '08:00 - 17:00' },
    { day: 'Domingo', hours: 'Fechado' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {businessInfo.name}
              </h1>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(businessInfo.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {businessInfo.rating} ({businessInfo.reviews} avaliações)
                </span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sua beleza em boas mãos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {businessInfo.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Horário
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto border-2"
            >
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Tratamentos especializados para realçar sua beleza natural
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items.map((service, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => setSelectedService(service.name)}
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-pink-600">{service.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600">
              Profissionais experientes e apaixonados pela beleza
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {professionals.map((professional, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{professional.name}</h3>
                  <p className="text-gray-600 mb-2">{professional.specialty}</p>
                  <p className="text-sm text-gray-500 mb-4">{professional.experience} de experiência</p>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(professional.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{professional.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MapPin className="w-6 h-6 mr-2 text-pink-600" />
                  Contato & Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">{businessInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">{businessInfo.phone}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Siga-nos nas redes sociais:</p>
                  <div className="flex space-x-4">
                    <span className="text-pink-600">{businessInfo.instagram}</span>
                    <span className="text-blue-600">{businessInfo.facebook}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Clock className="w-6 h-6 mr-2 text-purple-600" />
                  Horário de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="font-medium text-gray-900">{schedule.day}</span>
                      <span className={`${schedule.hours === 'Fechado' ? 'text-red-600' : 'text-gray-700'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronta para se sentir ainda mais bela?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Agende seu horário agora e desfrute de uma experiência única de beleza e bem-estar
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Meu Horário
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BusinessLanding;
