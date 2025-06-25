
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

const People = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">People</h1>
            </div>

            <div className="text-center max-w-2xl mx-auto mt-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                This feature is only available with Sprig In-Product Surveys
              </h2>
              <p className="text-gray-600 mb-8">
                Upgrade to Enterprise Plan to use In-Product Surveys.
              </p>
              
              <Button className="bg-gray-900 text-white px-6 py-3 mb-12">
                💬 Talk to a Sprig Specialist
              </Button>

              <div className="bg-white border rounded-lg p-6">
                <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">People</div>
                      <div className="flex gap-4 text-xs text-gray-500 mb-4">
                        <span>👥 All People</span>
                        <span>👥 Groups</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Group</span>
                        <span>Population</span>
                        <span>Active Studies</span>
                        <span>Created by</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span>👥 NPS Detractors</span>
                        <span>~840</span>
                        <span>5 min ago</span>
                        <span>🟢 John Doe</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span>👥 Research Panel 1</span>
                        <span>122</span>
                        <span>5 min ago</span>
                        <span>🟢 Jenny Smith</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Preview the People Page</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Track which users are receiving in-product surveys.
                  </p>
                  <button className="text-blue-600 text-sm flex items-center gap-1">
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

export default People;
