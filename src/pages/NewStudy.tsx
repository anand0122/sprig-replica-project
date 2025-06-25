
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewStudy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Featured");

  const categories = [
    "Featured",
    "Custom templates", 
    "All templates",
    "Surveys",
    "Journey-based surveys",
    "NPS & sentiment tracking",
    "UX measurement",
    "Recruiting prompts & screening",
    "Video surveys",
    "Concept and Usability Tests",
    "Concept testing",
    "Message testing",
    "Prototype & usability testing"
  ];

  const templates = [
    {
      title: "Test a Product Concept (with NDA)",
      category: "Featured",
      image: "🔍"
    },
    {
      title: "Test Messaging Concepts",
      category: "Featured", 
      image: "💬"
    },
    {
      title: "Test an Interactive Prototype",
      category: "Featured",
      image: "📱"
    },
    {
      title: "Measure Customer Satisfaction (CSAT)",
      category: "Surveys",
      image: "⭐"
    },
    {
      title: "Measure Net Promoter Score (NPS)",
      category: "Surveys",
      image: "📊"
    },
    {
      title: "Measure Product Value",
      category: "Surveys",
      image: "💰"
    }
  ];

  const filteredTemplates = templates.filter(template => 
    (selectedCategory === "Featured" || template.category === selectedCategory) &&
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold text-gray-900">New Study</h1>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                ✏️ Create from Scratch
              </Button>
            </div>

            <div className="flex gap-6">
              {/* Left sidebar - Categories */}
              <div className="w-64 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      selectedCategory === category
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1">
                <div className="mb-6">
                  <Input
                    placeholder="Search all templates by name, category, or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md"
                  />
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Featured</h2>
                  <p className="text-sm text-gray-600">The most popular Sprig study templates used by teams</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">{template.image}</div>
                          <div className="text-xs text-gray-600">Template preview</div>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{template.title}</h3>
                    </div>
                  ))}
                </div>

                {/* Survey templates at bottom */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="text-xs">How satisfied are you with your experience with Hooli?</div>
                        <div className="flex justify-center gap-1">
                          {[1,2,3,4,5].map(num => (
                            <div key={num} className="w-4 h-4 bg-gray-300 rounded text-xs flex items-center justify-center">
                              {num}
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">Not at all satisfied → Extremely satisfied</div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">Measure Customer Satisfaction (CSAT)</h3>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="text-xs">How likely are you to recommend us to a friend or colleague?</div>
                        <div className="flex justify-center gap-1">
                          {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                            <div key={num} className="w-3 h-3 bg-gray-300 rounded text-xs"></div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">Not at all unlikely → Extremely likely</div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">Measure Net Promoter Score (NPS)</h3>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="text-xs">What would make this tool more valuable to you?</div>
                        <div className="bg-white border rounded p-2 text-xs text-gray-400">
                          Type your response
                        </div>
                        <Button className="bg-gray-900 text-white text-xs px-3 py-1">Next</Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">Measure Product Value</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NewStudy;
