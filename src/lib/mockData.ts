// Mock data to simulate SQLite database
export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  logo?: string;
  phone?: string;
  email?: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessId: string;
  services: string[];
  workingHours: WorkingHours;
  commission: number;
  status: 'active' | 'inactive';
  createdAt: string;
  storeId?: string;
  storeName?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  category: string;
  businessId: string;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  businessId: string;
  createdAt: string;
}

export interface WorkingHours {
  monday: { start: string; end: string; active: boolean };
  tuesday: { start: string; end: string; active: boolean };
  wednesday: { start: string; end: string; active: boolean };
  thursday: { start: string; end: string; active: boolean };
  friday: { start: string; end: string; active: boolean };
  saturday: { start: string; end: string; active: boolean };
  sunday: { start: string; end: string; active: boolean };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'business_owner' | 'professional' | 'client';
  businessId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock data
export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Salão Bella Vista',
    slug: 'salao-bella-vista',
    description: 'O melhor em beleza e bem-estar',
    owner: 'Maria Silva',
    plan: 'Professional',
    status: 'active',
    createdAt: '2024-01-15',
    phone: '(11) 3333-4444',
    email: 'contato@bellavista.com'
  },
  {
    id: '2',
    name: 'Barbearia do João',
    slug: 'barbearia-joao',
    description: 'Tradição em cortes masculinos',
    owner: 'João Santos',
    plan: 'Starter',
    status: 'active',
    createdAt: '2024-02-01',
    phone: '(11) 2222-3333',
    email: 'joao@barbearia.com'
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Ana Costa',
    email: 'ana@bellavista.com',
    phone: '(11) 99999-1111',
    businessId: '1',
    services: ['1', '2', '3'],
    workingHours: {
      monday: { start: '09:00', end: '18:00', active: true },
      tuesday: { start: '09:00', end: '18:00', active: true },
      wednesday: { start: '09:00', end: '18:00', active: true },
      thursday: { start: '09:00', end: '20:00', active: true },
      friday: { start: '09:00', end: '20:00', active: true },
      saturday: { start: '08:00', end: '17:00', active: true },
      sunday: { start: '09:00', end: '15:00', active: false }
    },
    commission: 60,
    status: 'active',
    createdAt: '2024-01-20'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte Feminino',
    duration: 60,
    price: 45,
    category: 'Cabelos',
    businessId: '1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Escova',
    duration: 45,
    price: 25,
    category: 'Cabelos',
    businessId: '1',
    status: 'active'
  },
  {
    id: '3',
    name: 'Manicure',
    duration: 45,
    price: 25,
    category: 'Unhas',
    businessId: '1',
    status: 'active'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Maria Silva',
    clientPhone: '(11) 99999-9999',
    clientEmail: 'maria@email.com',
    serviceId: '1',
    professionalId: '1',
    date: '2024-12-22',
    time: '09:00',
    status: 'confirmed',
    businessId: '1',
    createdAt: '2024-12-20'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Sistema',
    email: 'admin@agenda.ai',
    phone: '(11) 0000-0000',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Maria Silva',
    email: 'maria@bellavista.com',
    phone: '(11) 1111-1111',
    role: 'business_owner',
    businessId: '1',
    status: 'active',
    createdAt: '2024-01-15'
  }
];
