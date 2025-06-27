
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';

interface Unavailability {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  status: 'active' | 'expired';
  createdAt: string;
}

const Unavailability = () => {
  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([
    {
      id: '1',
      startDate: '2024-12-25',
      endDate: '2024-12-25',
      startTime: '00:00',
      endTime: '23:59',
      reason: 'Natal - Feriado',
      type: 'vacation',
      status: 'active',
      createdAt: '2024-12-20'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnavailability, setEditingUnavailability] = useState<Unavailability | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    type: 'personal' as 'vacation' | 'sick' | 'personal' | 'other'
  });

  const typeOptions = [
    { value: 'vacation', label: 'Férias/Folga', color: 'bg-blue-100 text-blue-800' },
    { value: 'sick', label: 'Atestado Médico', color: 'bg-red-100 text-red-800' },
    { value: 'personal', label: 'Pessoal', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'other', label: 'Outro', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUnavailability) {
      // Update existing unavailability
      setUnavailabilities(unavailabilities.map(unavailability => 
        unavailability.id === editingUnavailability.id 
          ? { ...unavailability, ...formData, status: 'active' as const }
          : unavailability
      ));
    } else {
      // Create new unavailability
      const newUnavailability: Unavailability = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUnavailabilities([...unavailabilities, newUnavailability]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      reason: '',
      type: 'personal'
    });
    setEditingUnavailability(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (unavailability: Unavailability) => {
    setEditingUnavailability(unavailability);
    setFormData({
      startDate: unavailability.startDate,
      endDate: unavailability.endDate,
      startTime: unavailability.startTime,
      endTime: unavailability.endTime,
      reason: unavailability.reason,
      type: unavailability.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (unavailabilityId: string) => {
    setUnavailabilities(unavailabilities.filter(unavailability => unavailability.id !== unavailabilityId));
  };

  const getTypeInfo = (type: string) => {
    return typeOptions.find(option => option.value === type) || typeOptions[0];
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessionalSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Indisponibilidades</h1>
              <p className="text-gray-600">Gerencie seus períodos de indisponibilidade</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Indisponibilidade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingUnavailability ? 'Editar Indisponibilidade' : 'Nova Indisponibilidade'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUnavailability ? 'Edite o período de indisponibilidade' : 'Marque um período em que não estará disponível'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Data Início</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Data Fim</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Hora Início</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">Hora Fim</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="reason">Motivo</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Descreva o motivo da indisponibilidade..."
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingUnavailability ? 'Atualizar' : 'Criar'} Indisponibilidade
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Alert */}
          <Card className="border-0 shadow-lg mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-yellow-800 font-medium">Importante</p>
                  <p className="text-yellow-700 text-sm">
                    Os períodos de indisponibilidade bloquearão automaticamente os horários para agendamento. 
                    Certifique-se de avisar com antecedência.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unavailabilities Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Indisponibilidades Cadastradas
              </CardTitle>
              <CardDescription>
                {unavailabilities.length} períodos de indisponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unavailabilities.map((unavailability) => {
                    const typeInfo = getTypeInfo(unavailability.type);
                    const expired = isExpired(unavailability.endDate);
                    
                    return (
                      <TableRow key={unavailability.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {new Date(unavailability.startDate).toLocaleDateString('pt-BR')}
                            </div>
                            {unavailability.startDate !== unavailability.endDate && (
                              <div className="text-sm text-gray-500">
                                até {new Date(unavailability.endDate).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {unavailability.startTime} - {unavailability.endTime}
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {unavailability.reason}
                        </TableCell>
                        <TableCell>
                          <Badge variant={expired ? 'secondary' : 'default'}>
                            {expired ? 'Expirado' : 'Ativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(unavailability)}
                              disabled={expired}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(unavailability.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Unavailability;
