import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SidebarDemo from "@/components/SidebarDemo";

const TeamCreation = () => {
  const [teamName, setTeamName] = useState("Design Agency");
  const navigate = useNavigate();

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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <Input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={() => navigate("/team-size")}
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                Continue
              </Button>
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

export default TeamCreation;
