
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">Welcome to Sprig, Saurabh</h1>
            </div>

            {/* Colorful pattern background */}
            <div className="mb-8 p-8 bg-gradient-to-r from-yellow-100 via-orange-100 to-teal-100 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-12 gap-2 h-full">
                  {Array.from({ length: 120 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded ${
                      i % 4 === 0 ? 'bg-yellow-400' : 
                      i % 4 === 1 ? 'bg-orange-400' :
                      i % 4 === 2 ? 'bg-teal-400' : 'bg-red-400'
                    }`}></div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Tour Sprig in 3 minutes with Denisse
                </h2>
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
                  <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">▶</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Start making better product decisions with user feedback
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Read these instructions aloud before clicking 'Start Task'</div>
                      <Button className="bg-gray-900 text-white text-sm">Start Task</Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Concept & Usability Tests</h3>
                  <p className="text-sm text-gray-600">
                    Capture feedback on concepts and prototypes built in your favorite design tools
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-sm font-medium">What's the main reason you cancelled your plan?</div>
                      <div className="space-y-1 text-xs">
                        <div>○ Difficult to use</div>
                        <div>○ Not used to me</div>
                        <div>○ Lacked features</div>
                        <div>○ Something else</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shareable Link Surveys</h3>
                  <p className="text-sm text-gray-600">
                    Send product feedback surveys using your own channels or CRM
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-medium mb-2">This tool makes it easy for me to resolve my issue.</div>
                      <div className="flex justify-center gap-1">
                        {[1,2,3,4,5].map(num => (
                          <div key={num} className="w-6 h-6 bg-gray-300 rounded text-xs flex items-center justify-center">
                            {num}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Disagree strongly → Agree strongly</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">In-Product Surveys</h3>
                  <p className="text-sm text-gray-600">
                    Learn from users as they experience your product with advanced targeting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
