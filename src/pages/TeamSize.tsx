import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SidebarDemo from "@/components/SidebarDemo";

const TeamSize = () => {
  const [selectedEmployees, setSelectedEmployees] = useState("");
  const [selectedUsers, setSelectedUsers] = useState("");
  const navigate = useNavigate();

  const employeeRanges = ["0 - 50", "50 - 150", "150 - 1,000", "1,000+"];
  const userRanges = ["0 - 25,000", "25,000 - 100,000", "100,000 - 1,000,000", "1,000,000+"];

  const canContinue = selectedEmployees && selectedUsers;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Sprig</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Create your team
              </h2>
              <p className="text-gray-600">
                Now add a team, where your team can share and collaborate on studies. You have access to unlimited seats!
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of employees
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {employeeRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedEmployees(range)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedEmployees === range 
                          ? "border-gray-900 bg-gray-50" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-900">{range}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of monthly users for your product
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {userRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedUsers(range)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedUsers === range 
                          ? "border-gray-900 bg-gray-50" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-900">{range}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className={`w-full ${
                    canContinue 
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "bg-gray-200 text-gray-400"
                  }`}
                  disabled={!canContinue}
                >
                  Continue
                </Button>
                
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sidebar Preview */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: '300px', height: '500px' }}>
          <SidebarDemo />
        </div>
      </div>
    </div>
  );
};

export default TeamSize;
