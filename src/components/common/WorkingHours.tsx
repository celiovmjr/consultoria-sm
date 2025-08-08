import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Clock } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  dayLabel: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

interface WorkingHoursProps {
  value?: any;
  onChange: (schedule: DaySchedule[]) => void;
}

const WorkingHours = ({ value, onChange }: WorkingHoursProps) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'monday', dayLabel: 'Segunda-feira', isOpen: false, timeSlots: [{ start: '08:00', end: '18:00' }] },
    { day: 'tuesday', dayLabel: 'Terça-feira', isOpen: false, timeSlots: [{ start: '08:00', end: '18:00' }] },
    { day: 'wednesday', dayLabel: 'Quarta-feira', isOpen: false, timeSlots: [{ start: '08:00', end: '18:00' }] },
    { day: 'thursday', dayLabel: 'Quinta-feira', isOpen: false, timeSlots: [{ start: '08:00', end: '18:00' }] },
    { day: 'friday', dayLabel: 'Sexta-feira', isOpen: false, timeSlots: [{ start: '08:00', end: '18:00' }] },
    { day: 'saturday', dayLabel: 'Sábado', isOpen: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'sunday', dayLabel: 'Domingo', isOpen: false, timeSlots: [{ start: '09:00', end: '17:00' }] }
  ]);

  // Initialize from value if provided
  useEffect(() => {
    if (value && typeof value === 'object') {
      setSchedule(value);
    } else if (typeof value === 'string' && value.trim()) {
      // Try to parse string format if it exists
      setSchedule(prev => prev.map(day => ({ ...day, isOpen: false })));
    }
  }, [value]);

  const handleDayToggle = (dayIndex: number, isOpen: boolean) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].isOpen = isOpen;
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  const handleTimeSlotChange = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.push({ start: '13:00', end: '18:00' });
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    if (newSchedule[dayIndex].timeSlots.length > 1) {
      newSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
      setSchedule(newSchedule);
      onChange(newSchedule);
    }
  };

  const copyToAllDays = (sourceDayIndex: number) => {
    const sourceDay = schedule[sourceDayIndex];
    const newSchedule = schedule.map(day => ({
      ...day,
      isOpen: sourceDay.isOpen,
      timeSlots: [...sourceDay.timeSlots]
    }));
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Horário de Funcionamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedule.map((day, dayIndex) => (
          <div key={day.day} className="border rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-medium">{day.dayLabel}</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={day.isOpen}
                  onCheckedChange={(checked) => handleDayToggle(dayIndex, checked)}
                />
                <span className="text-xs text-muted-foreground">
                  {day.isOpen ? 'Aberto' : 'Fechado'}
                </span>
              </div>
            </div>

            {day.isOpen && (
              <div className="space-y-2">
                {day.timeSlots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'start', e.target.value)}
                        className="w-20 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">às</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'end', e.target.value)}
                        className="w-20 text-xs"
                      />
                    </div>
                    
                    <div className="flex gap-1">
                      {slotIndex === day.timeSlots.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(dayIndex)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {day.timeSlots.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToAllDays(dayIndex)}
                  className="text-xs h-6"
                >
                  Aplicar a todos os dias
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkingHours;