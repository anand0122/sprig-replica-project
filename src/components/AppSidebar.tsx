
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboards",
    url: "/dashboards",
    icon: "📊",
  },
  {
    title: "Studies",
    url: "/studies", 
    icon: "📋",
  },
  {
    title: "People",
    url: "/people",
    icon: "👥",
  },
  {
    title: "Data Hub",
    url: "/data-hub",
    icon: "💾",
  },
  {
    title: "Connect",
    url: "/connect",
    icon: "🔗",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-semibold text-gray-900">Sprig</h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full ${
                        location.pathname === item.url 
                          ? "bg-gray-100 text-gray-900" 
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg w-5 h-5 flex items-center justify-center">{item.icon}</span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Link 
            to="/new-study"
            className="w-full bg-gray-900 text-white p-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Study
          </Link>
        </div>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/upgrade" className="flex items-center gap-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <span className="text-lg w-5 h-5 flex items-center justify-center">⬆️</span>
                    <span className="text-sm font-medium">Upgrade</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/getting-started" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <span className="text-lg w-5 h-5 flex items-center justify-center">🚀</span>
                    <span className="text-sm font-medium">Getting Started</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <span className="text-lg w-5 h-5 flex items-center justify-center">⚙️</span>
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">S</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">Design Agency</div>
            <div className="text-xs text-gray-500">Production</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
