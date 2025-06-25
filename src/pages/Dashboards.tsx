
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboards = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">Dashboards</h1>
            </div>

            <div className="text-center max-w-2xl mx-auto mt-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Dashboards yet</h2>
              <p className="text-gray-600 mb-12">
                Once you have studies running, use Dashboards to track insights across studies all in one place.
              </p>

              <div className="bg-white border rounded-lg p-6">
                <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <span className="text-blue-600">🔵</span>
                        <span className="text-sm font-medium">Product Overview</span>
                        <span className="text-gray-400">⭐ ...</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">📋 Copy Link</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="text-gray-700 mb-2">How easy is it to find what you're looking for on Mozi?</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-purple-400 rounded"></div>
                            <span>Very easy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-blue-400 rounded"></div>
                            <span>Easy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-2 bg-yellow-400 rounded"></div>
                            <span>Neutral</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-2 bg-green-400 rounded"></div>
                            <span>Hard</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-2 bg-gray-400 rounded"></div>
                            <span>Very Hard</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-700 mb-2">How satisfied are you with your experience on the Mozi search page?</div>
                        <div className="h-20 bg-purple-100 rounded flex items-end justify-center">
                          <div className="w-32 h-12 bg-purple-300 rounded-t"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Learn about Dashboards</h3>
                  <button className="text-blue-600 text-sm flex items-center gap-1">
                    ▶ Watch Video (1 min)
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

export default Dashboards;
