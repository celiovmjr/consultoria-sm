
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, MapPin, Phone, Star, User } from 'lucide-react';

const BusinessLanding = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const businessInfo = {
    name: 'Salão Bella Vista',
    description: 'Salão de beleza especializado em cabelos e estética com mais de 10 anos de experiência.',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-9999',
    rating: 4.8,
    reviews: 127,
    workingHours: 'Seg-Sex: 9h às 18h | Sáb: 9h às 17h'
  };

  const services = [
    { id: '1', name: 'Corte Feminino', price: 45.00, duration: 60, category: 'Cabelos' },
    { id: '2', name: 'Corte Masculino', price: 25.00, duration: 30, category: 'Cabelos' },
    { id: '3', name: 'Coloração', price: 85.00, duration: 120, category: 'Cabelos' },
    { id: '4', name: 'Escova', price: 35.00, duration: 45, category: 'Cabelos' },
    { id: '5', name: 'Hidratação', price: 55.00, duration: 75, category: 'Cabelos' },
    { id: '6', name: 'Manicure', price: 20.00, duration: 45, category: 'Unhas' },
    { id: '7', name: 'Pedicure', price: 25.00, duration: 60, category: 'Unhas' }
  ];

  const professionals = [
    { id: '1', name: 'Maria Costa', specialties: ['Cabelos', 'Coloração'], rating: 4.9 },
    { id: '2', name: 'Ana Silva', specialties: ['Cabelos', 'Escova'], rating: 4.8 },
    { id: '3', name: 'Carla Lima', specialties: ['Unhas'], rating: 4.7 }
  ];

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{businessInfo.name}</h1>
              <p className="text-gray-600 mt-2">{businessInfo.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {businessInfo.address}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {businessInfo.phone}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {businessInfo.workingHours}
                </div>
              </div>
              
              <div className="flex items-center mt-3">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{businessInfo.rating}</span>
                </div>
                <span className="text-gray-600 ml-2">({businessInfo.reviews} avaliações)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader>
                <CardTitle>Nossos Serviços</CardTitle>
                <CardDescription>Escolha o serviço desejado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedServices).map(([category, categoryServices]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg text-gray-900 mb-4">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryServices.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedService === service.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedService(service.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                <p className="text-sm text-gray-600">{service.duration} minutos</p>
                              </div>
                              <span className="font-semibold text-green-600">
                                R$ {service.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Professionals */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Nossa Equipe</CardTitle>
                <CardDescription>Conheça nossos profissionais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionals.map((professional) => (
                    <div key={professional.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{professional.name}</h4>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{professional.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {professional.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Panel */}
          <div>
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Agendar Horário
                </CardTitle>
                <CardDescription>
                  {selectedServiceData 
                    ? `${selectedServiceData.name} - R$ ${selectedServiceData.price.toFixed(2)}`
                    : 'Selecione um serviço para continuar'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data
                      </label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horário Disponível
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className="text-xs"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="pt-4 border-t">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Serviço:</span>
                            <span className="font-medium">{selectedServiceData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Data:</span>
                            <span className="font-medium">
                              {new Date(selectedDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Horário:</span>
                            <span className="font-medium">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duração:</span>
                            <span className="font-medium">{selectedServiceData?.duration} min</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span className="text-green-600">R$ {selectedServiceData?.price.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600">
                          Confirmar Agendamento
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Selecione um serviço para ver os horários disponíveis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLanding;
