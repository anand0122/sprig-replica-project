import React, { useEffect, useState } from 'react';
import { IntegrationsHub } from '../components/IntegrationsHub';
import {
  listIntegrations,
  createIntegration,
  updateIntegration,
  deactivateIntegration,
} from '../services/integrations';
import { toast } from '../components/ui/use-toast';

type BackendIntegration = {
  id: string;
  provider: 'GOOGLE_SHEETS' | 'NOTION';
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PENDING';
  config: Record<string, any>;
};

const mapBackendToHub = (integration: BackendIntegration) => {
  const common = {
    id: integration.provider === 'GOOGLE_SHEETS' ? 'google_sheets' : 'notion',
    name: integration.name,
    description: integration.description || '',
    status:
      integration.status === 'ACTIVE'
        ? 'connected'
        : integration.status === 'PENDING'
        ? 'pending'
        : 'disconnected',
    config: integration.config || {},
    triggers: [],
    actions: [],
    icon:
      integration.provider === 'GOOGLE_SHEETS'
        ? 'https://seeklogo.com/images/G/google-sheets-logo-D2A35FF8A4-seeklogo.com.png'
        : 'https://seeklogo.com/images/N/notion-logo-E26F38C9AC-seeklogo.com.png',
    category: 'spreadsheet' as const,
    syncCount: 0,
    backendId: integration.id,
  };
  return common;
};

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);

  const fetchIntegrations = async () => {
    try {
      const data: any = await listIntegrations();
      setIntegrations(
        (() => {
          const backendMapped = (data.integrations || []).map((i: BackendIntegration) => mapBackendToHub(i));
          const base: any[] = [
            {
              id: 'google_sheets',
              name: 'Google Sheets',
              description: 'Automatically save form responses to spreadsheets',
              status: 'disconnected',
              config: {},
              triggers: [],
              actions: [],
              icon: 'https://seeklogo.com/images/G/google-sheets-logo-D2A35FF8A4-seeklogo.com.png',
              category: 'spreadsheet',
              syncCount: 0,
            },
            {
              id: 'notion',
              name: 'Notion',
              description: 'Export responses to Notion databases',
              status: 'disconnected',
              config: {},
              triggers: [],
              actions: [],
              icon: 'https://seeklogo.com/images/N/notion-logo-E26F38C9AC-seeklogo.com.png',
              category: 'spreadsheet',
              syncCount: 0,
            },
          ];

          // merge, overwrite base when backend exists
          const merged = base.map((b) => backendMapped.find((m) => m.id === b.id) || b);
          return merged;
        })()
      );
    } catch (err) {
      toast({ title: 'Failed to load integrations', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleIntegrationConnect = async (
    integrationId: string,
    data: { config: any; credentials: any }
  ) => {
    try {
      const provider = integrationId === 'google_sheets' ? 'GOOGLE_SHEETS' : 'NOTION';
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      window.location.href = `${apiBase}/integrations/${provider.toLowerCase()}/auth`;
    } catch (err) {
      toast({ title: 'Connection failed', variant: 'destructive' });
    }
  };

  const handleIntegrationUpdate = async (integration: any) => {
    try {
      const provider = integration.id === 'google_sheets' ? 'GOOGLE_SHEETS' : 'NOTION';
      await updateIntegration(integration.backendId || integration.id, {
        config: integration.config,
        name: provider,
      });
      toast({ title: 'Integration updated' });
      fetchIntegrations();
    } catch (err) {
      toast({ title: 'Update failed', variant: 'destructive' });
    }
  };

  const handleIntegrationDisconnect = async (integrationId: string) => {
    try {
      const record = integrations.find((i) => i.id === integrationId);
      await deactivateIntegration((record as any)?.backendId || integrationId);
      toast({ title: 'Integration disconnected' });
      fetchIntegrations();
    } catch (err) {
      toast({ title: 'Disconnect failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-2">
              Connect FormPulse with your favorite tools and automate your workflows
            </p>
          </div>
        </div>
      </div>

      {/* Integration Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IntegrationsHub
          integrations={integrations}
          onIntegrationUpdate={handleIntegrationUpdate}
          onIntegrationConnect={handleIntegrationConnect}
          onIntegrationDisconnect={handleIntegrationDisconnect}
        />
      </div>
    </div>
  );
};

export default Integrations; 