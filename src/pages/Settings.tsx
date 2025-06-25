
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const [showAddMember, setShowAddMember] = useState(false);

  const sidebarItems = [
    "Profile",
    "Notifications", 
    "Product",
    "Configure",
    "Look & Feel",
    "Team",
    "Members",
    "Usage",
    "Billing & Plans",
    "Single Sign On",
    "Legal and Compliance"
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Profile":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Avatar</h2>
              <p className="text-gray-600 mb-6">Help your team recognize you in Sprig</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">S</span>
                </div>
                <Button variant="outline">Upload New</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Info</h3>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input defaultValue="Saurabh Sharma" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Function</label>
                  <Select defaultValue="Design">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input defaultValue="smashing199810@gmail.com" />
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span>🔗</span>
                    <span>Connected to your Google account</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input placeholder="Enter phone number" />
                </div>
              </div>
            </div>
          </div>
        );

      case "Members":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Input placeholder="Filter Team Members" className="max-w-md" />
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button className="bg-gray-900 text-white">+ Add Member</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Teammate</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <Input />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <Select defaultValue="Viewer">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-gray-900 text-white">Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white border rounded-lg">
              <div className="grid grid-cols-4 gap-4 p-4 border-b text-sm font-medium text-gray-700">
                <span>Name</span>
                <span>Role</span>
                <span>Email</span>
                <span>Date Added ⬆</span>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">S</span>
                  </div>
                  <span>Saurabh Sharma</span>
                </div>
                <span>Admin</span>
                <span>smashing199810@gmail.com</span>
                <span>2/21/23</span>
              </div>
            </div>
          </div>
        );

      case "Look & Feel":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Logo</h2>
              <p className="text-gray-600 mb-4">Used to add your branding to studies shared via email and link.</p>
              <Button variant="outline">Upload a Logo</Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sprig Signature</h2>
              <p className="text-gray-600 mb-4">The Sprig signature is a subtle coda that appears at the bottom of studies.</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="radio" name="signature" defaultChecked />
                  <span>Show Sprig Signature</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="signature" />
                  <span>Hide Sprig Signature</span>
                </label>
              </div>
              
              <Button variant="outline" className="mt-4">Save</Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Desktop Study Appearance</h2>
              <p className="text-gray-600 mb-4">Customize placement and appearance for web studies delivered on desktop.</p>
              
              <div className="flex gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="placement" defaultChecked />
                    <span>Bottom Right</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="placement" />
                    <span>Top Right</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="placement" />
                    <span>Top Left</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="placement" />
                    <span>Bottom Left</span>
                  </label>
                </div>
                
                <div className="w-80 h-48 bg-gray-200 rounded-lg relative">
                  <div className="absolute bottom-4 right-4 w-20 h-16 bg-gray-900 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Weekly Digest</h2>
              <p className="text-gray-600 mb-4">The Sprig weekly digest gives you updates about the insights you've collected.</p>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Design Agency</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="weekly" defaultChecked />
                    <span>Send Weekly Digest</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="weekly" />
                    <span>Disable Weekly Digest</span>
                  </label>
                </div>
              </div>
              
              <Button variant="outline">Save</Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Study Creation</h2>
              <p className="text-gray-600 mb-4">Sprig can notify your team when new studies are launched.</p>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Design Agency</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="creation" defaultChecked />
                    <span>Send Creation Updates</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="creation" />
                    <span>Disable Creation Updates</span>
                  </label>
                </div>
              </div>
              
              <Button variant="outline">Save</Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Study Completion</h2>
              <p className="text-gray-600 mb-4">Sprig can notify your team when studies are completed.</p>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Design Agency</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="completion" defaultChecked />
                    <span>Send Completion Updates</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="completion" />
                    <span>Disable Completion Updates</span>
                  </label>
                </div>
              </div>
              
              <Button variant="outline">Save</Button>
            </div>
          </div>
        );

      case "Legal and Compliance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Legal & Compliance</h2>
              <p className="text-gray-600 mb-6">Our standard terms and privacy policies, as well as amendments for your compliance needs</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <span>Privacy Policy</span>
                <Button variant="outline">Review</Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <span>Terms and Conditions</span>
                <Button variant="outline">Review</Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <span>Sprig Security Overview</span>
                <Button variant="outline">Review</Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <span>Data Processing Amendment</span>
                <Button variant="outline">Review</Button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">S</span>
                  </div>
                  <div>
                    <div className="font-medium">Saurabh Sharma</div>
                    <div className="text-sm text-gray-600">smashing199810@gmail.com</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Product</div>
                    <div className="font-medium">Design Agency</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Environment</div>
                    <div className="font-medium">Production</div>
                    <div className="text-sm text-gray-600 mt-2">
                      <select className="border rounded px-2 py-1">
                        <option>Production</option>
                        <option>Development</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4">Log Out</Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{activeSection}</h2>
            <p className="text-gray-600">Content for {activeSection} section</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex">
          <div className="w-64 bg-white border-r p-4">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">smashing199810@gmail.com</div>
            </div>
            
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === item
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
