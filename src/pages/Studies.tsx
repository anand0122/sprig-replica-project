
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Studies = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">Studies</h1>
            </div>

            <div className="text-center max-w-md mx-auto mt-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Studies yet</h2>
              <p className="text-gray-600 mb-8">
                Launch your first study and capture valuable user insights within hours.
              </p>
              
              <Link to="/new-study">
                <Button className="bg-gray-900 text-white px-6 py-3">
                  + New Study
                </Button>
              </Link>

              <div className="mt-12 bg-white border rounded-lg p-6">
                <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-xs font-medium">New Concept Test</div>
                    <div className="text-xs text-gray-500">Questions • Audience</div>
                    <div className="space-y-1">
                      <div className="text-xs">📱 Next, we'll show you a prototype of our new feature...</div>
                      <div className="text-xs">🖼️ Preview of rating scale headline</div>
                      <div className="text-xs">📋 Preview of Open Text headline</div>
                    </div>
                    <div className="absolute top-2 right-2 bg-white p-1 rounded shadow text-xs">
                      Next, we'll show you a prototype of our new feature and ask for your thoughts.
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Learn about Study Creation</h3>
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

export default Studies;
