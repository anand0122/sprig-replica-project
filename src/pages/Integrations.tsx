import React from 'react';
import { IntegrationsHub } from '../components/IntegrationsHub';

const Integrations: React.FC = () => {
  // Mock integration handlers - in a real app these would connect to your backend
  const handleIntegrationUpdate = (integration: any) => {
    console.log('Updating integration:', integration);
    // Implementation would update the integration in your backend
  };

  const handleIntegrationConnect = (integrationId: string, config: any) => {
    console.log('Connecting integration:', integrationId, config);
    // Implementation would connect the integration with the provided config
  };

  const handleIntegrationDisconnect = (integrationId: string) => {
    console.log('Disconnecting integration:', integrationId);
    // Implementation would disconnect the integration
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
          onIntegrationUpdate={handleIntegrationUpdate}
          onIntegrationConnect={handleIntegrationConnect}
          onIntegrationDisconnect={handleIntegrationDisconnect}
        />
      </div>
    </div>
  );
};

export default Integrations; 