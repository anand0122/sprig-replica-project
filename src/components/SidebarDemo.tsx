
import { Plus } from "lucide-react";

const SidebarDemo = () => {
  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Sprig</h2>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">Dashboards</span>
        </div>
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">Studies</span>
        </div>
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">People</span>
        </div>
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">Events</span>
        </div>
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">Connect</span>
        </div>
      </div>

      {/* New Study Button */}
      <div className="p-4">
        <button className="w-full bg-gray-900 text-white p-2 rounded text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          New Study
        </button>
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">Help & Getting Started</span>
        </div>
        <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm">Settings</span>
        </div>
        
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">S</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Design Age..</div>
            <div className="text-xs text-gray-500">Production</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDemo;
