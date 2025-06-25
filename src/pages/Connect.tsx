
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Connect = () => {
  const integrationTags = [
    { name: "Code", active: true },
    { name: "No Code", active: false },
    { name: "Source", active: false },
    { name: "Destination", active: false },
    { name: "SDK", active: false },
    { name: "Web", active: false },
    { name: "Mobile", active: false },
    { name: "Bulk Ingest", active: false },
    { name: "Zapier", active: false },
  ];

  const integrations = [
    {
      name: "JavaScript",
      icon: "JS",
      description: "Add the Sprig Javascript snippet into your product to automatically track behavior and send in-product studies.",
      tags: ["Code", "Source", "SDK", "Web"],
      action: "Upgrade & Get Access"
    },
    {
      name: "Google Tag Manager",
      icon: "◆",
      description: "Start studies users through your product and collecting user and event data by leveraging our native integration.",
      tags: ["No Code", "Source", "Web"],
      action: "Upgrade & Get Access"
    },
    {
      name: "iOS",
      icon: "iOS",
      description: "Add the Sprig iOS SDK to your app to automatically track behavior and send in-product mobile studies.",
      tags: ["Code", "Source", "SDK", "Mobile"],
      action: "Upgrade & Get Access • Read Docs"
    },
    {
      name: "Android",
      icon: "🤖",
      description: "Add the Sprig Android SDK to your app to automatically track behavior and send in-product mobile studies.",
      tags: ["Code", "Source", "SDK", "Mobile"],
      action: "Upgrade & Get Access • Read Docs"
    },
    {
      name: "Public API",
      icon: "💻",
      description: "Send user information via Sprig's public REST API to send email studies or back-fill customer data.",
      tags: ["Code", "Source", "Bulk Ingest"],
      action: "Upgrade & Get Access • Read Docs"
    },
    {
      name: "Upload a Spreadsheet",
      icon: "📊",
      description: "Upload user information to send email studies or back-fill customer data.",
      tags: ["No Code", "Source", "Bulk Ingest"],
      action: "Upload File • Read Docs"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">Connect</h1>
            </div>

            <div className="mb-6">
              <Input 
                placeholder="Search Integrations"
                className="max-w-md mb-4"
              />
              
              <div className="flex flex-wrap gap-2">
                {integrationTags.map((tag) => (
                  <button
                    key={tag.name}
                    className={`px-3 py-1 rounded-full text-sm ${
                      tag.active 
                        ? "bg-orange-100 text-orange-700 border border-orange-200" 
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sources</h2>
              <p className="text-gray-600 mb-6">Connect a source to send data to Sprig.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <div key={integration.name} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold">
                      {integration.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {integration.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded text-xs ${
                              tag === "Code" ? "bg-orange-100 text-orange-700" :
                              tag === "No Code" ? "bg-blue-100 text-blue-700" :
                              tag === "Source" ? "bg-purple-100 text-purple-700" :
                              tag === "SDK" ? "bg-green-100 text-green-700" :
                              tag === "Bulk Ingest" ? "bg-pink-100 text-pink-700" :
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                      <button className="text-purple-600 text-sm">
                        🔗 {integration.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Connect;
