import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlatformSettings {
  name: string;
  description: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  requireEmailVerification: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromName: string;
  fromEmail: string;
}

export interface NotificationSettings {
  newBusinessSignup: boolean;
  paymentAlerts: boolean;
  systemUpdates: boolean;
  maintenanceAlerts: boolean;
  securityAlerts: boolean;
}

export const useSystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system settings
  const { data: systemSettings, isLoading, error } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      // Transform data into structured format
      const settings: {
        platform_settings?: PlatformSettings;
        email_settings?: EmailSettings;
        notification_settings?: NotificationSettings;
      } = {};

      data.forEach((setting) => {
        if (setting.setting_key === 'platform_settings') {
          settings.platform_settings = setting.setting_value as unknown as PlatformSettings;
        } else if (setting.setting_key === 'email_settings') {
          settings.email_settings = setting.setting_value as unknown as EmailSettings;
        } else if (setting.setting_key === 'notification_settings') {
          settings.notification_settings = setting.setting_value as unknown as NotificationSettings;
        }
      });

      return settings;
    },
  });

  // Update system settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async ({ settingKey, settingValue }: { settingKey: string; settingValue: any }) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: settingKey,
          setting_value: settingValue,
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive"
      });
    },
  });

  const updatePlatformSettings = (settings: PlatformSettings) => {
    updateSettingsMutation.mutate({
      settingKey: 'platform_settings',
      settingValue: settings
    });
  };

  const updateEmailSettings = (settings: EmailSettings) => {
    updateSettingsMutation.mutate({
      settingKey: 'email_settings',
      settingValue: settings
    });
  };

  const updateNotificationSettings = (settings: NotificationSettings) => {
    updateSettingsMutation.mutate({
      settingKey: 'notification_settings',
      settingValue: settings
    });
  };

  // System backup functionality
  const generateBackup = async () => {
    try {
      const backupData = {
        platform_settings: systemSettings?.platform_settings,
        email_settings: systemSettings?.email_settings,
        notification_settings: systemSettings?.notification_settings,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `backup-configuracoes-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Backup gerado",
        description: "O backup das configurações foi gerado com sucesso.",
      });
    } catch (error) {
      console.error('Error generating backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar backup.",
        variant: "destructive"
      });
    }
  };

  // System reset functionality
  const resetSystemSettings = async () => {
    try {
      const defaultSettings = [
        {
          setting_key: 'platform_settings',
          setting_value: {
            name: 'Agenda.AI',
            description: 'Plataforma completa para gestão de agendamentos',
            supportEmail: 'suporte@agenda.ai',
            maintenanceMode: false,
            allowRegistrations: true,
            requireEmailVerification: true
          }
        },
        {
          setting_key: 'email_settings',
          setting_value: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: '587',
            smtpUsername: 'sistema@agenda.ai',
            smtpPassword: '',
            fromName: 'Agenda.AI',
            fromEmail: 'noreply@agenda.ai'
          }
        },
        {
          setting_key: 'notification_settings',
          setting_value: {
            newBusinessSignup: true,
            paymentAlerts: true,
            systemUpdates: true,
            maintenanceAlerts: true,
            securityAlerts: true
          }
        }
      ];

      for (const setting of defaultSettings) {
        await supabase
          .from('system_settings')
          .upsert(setting, { onConflict: 'setting_key' });
      }

      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      
      toast({
        title: "Sistema resetado",
        description: "As configurações foram restauradas para os valores padrão.",
      });
    } catch (error) {
      console.error('Error resetting system:', error);
      toast({
        title: "Erro",
        description: "Erro ao resetar configurações.",
        variant: "destructive"
      });
    }
  };

  // Cache clearing functionality
  const clearCache = async () => {
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage cache items
      const cacheKeys = Object.keys(localStorage).filter(key => key.includes('cache'));
      cacheKeys.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "Cache limpo",
        description: "O cache da aplicação foi limpo com sucesso.",
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Erro",
        description: "Erro ao limpar cache.",
        variant: "destructive"
      });
    }
  };

  return {
    // Data
    platformSettings: systemSettings?.platform_settings,
    emailSettings: systemSettings?.email_settings,
    notificationSettings: systemSettings?.notification_settings,
    
    // Loading states
    isLoading,
    isSaving: updateSettingsMutation.isPending,
    error,
    
    // Actions
    updatePlatformSettings,
    updateEmailSettings,
    updateNotificationSettings,
    generateBackup,
    resetSystemSettings,
    clearCache,
  };
};