
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState("Design");
  const navigate = useNavigate();

  const roles = [
    "Design", "User Research", "Product Management",
    "Engineering", "Marketing", "Data Science",
    "Customer Experience", "My function isn't listed"
  ];

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
                What is your primary function?
              </h2>
              <p className="text-gray-600">
                Help us personalize your experience. This will take less than a minute.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedRole === role 
                      ? "border-gray-900 bg-gray-50" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{role}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={() => navigate("/team-creation")}
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Testimonial */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="max-w-md">
          <div className="text-6xl mb-6">"</div>
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            Initially, I was skeptical that Sprig could provide the level of insights we needed. These concerns disappeared once we launched our first study.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div>
              <div className="font-semibold text-gray-900">Brenda Liu</div>
              <div className="text-sm text-gray-600">Lead UX/UI Designer at ProGuides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
