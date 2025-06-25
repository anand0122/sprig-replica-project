
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

const DataHub = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">Data Hub</h1>
            </div>

            <div className="text-center max-w-2xl mx-auto mt-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                This feature is only available with Sprig In-Product Surveys
              </h2>
              <p className="text-gray-600 mb-8">
                Upgrade to Enterprise Plan to use In-Product Surveys.
              </p>
              
              <Button className="bg-gray-900 text-white px-6 py-3 mb-12">
                🗣️ Talk to a Sprig Specialist
              </Button>

              <div className="bg-white border rounded-lg p-6 max-w-lg mx-auto">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="text-sm font-medium mb-2">Data Hub</div>
                  <div className="flex gap-4 text-xs text-gray-600 mb-3">
                    <span className="border-b-2 border-gray-900 pb-1">📊 Events</span>
                    <span>📋 Attributes</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span>Name</span>
                      <span>Usage</span>
                      <span>Active Studies</span>
                      <span>Created</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded">
                      <span>📋 Clicked "Create New"</span>
                      <span>👁️ 76</span>
                      <span>1</span>
                      <span>6/29/2022</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded">
                      <span>🔗 Viewed Templates</span>
                      <span>📈 12</span>
                      <span>0</span>
                      <span>6/29/2022</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Preview the Data Hub Page</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Control the user behavior data you use to trigger in-product surveys.
                  </p>
                  <button className="text-purple-600 text-sm flex items-center gap-1">
                    ▶ Watch Video (2 min)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DataHub;
