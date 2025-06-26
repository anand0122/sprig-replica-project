
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Smartphone, Image, ClipboardList, Play, MoreVertical, Eye, Settings, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Study } from "@/components/StudyBuilder";

const Studies = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load studies from localStorage
    const savedStudies = JSON.parse(localStorage.getItem('sprig_studies') || '[]');
    setStudies(savedStudies);
  }, []);

  const deleteStudy = (studyId: string) => {
    const updatedStudies = studies.filter(study => study.id !== studyId);
    setStudies(updatedStudies);
    localStorage.setItem('sprig_studies', JSON.stringify(updatedStudies));
    toast({
      title: "Study Deleted",
      description: "The study has been removed successfully.",
    });
  };

  const getStatusColor = (status: Study['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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

            {studies.length === 0 ? (
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
                        <div className="text-xs flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          Next, we'll show you a prototype of our new feature...
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          Preview of rating scale headline
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <ClipboardList className="w-3 h-3" />
                          Preview of Open Text headline
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-white p-1 rounded shadow text-xs">
                        Next, we'll show you a prototype of our new feature and ask for your thoughts.
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Learn about Study Creation</h3>
                    <button className="text-blue-600 text-sm flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      Watch Video (2 min)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">{studies.length} studies total</p>
                  </div>
                  <Link to="/new-study">
                    <Button className="bg-gray-900 text-white">
                      + New Study
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-4">
                  {studies.map((study) => (
                    <Card key={study.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{study.name}</CardTitle>
                              <Badge 
                                variant="secondary" 
                                className={`text-white text-xs ${getStatusColor(study.status)}`}
                              >
                                {study.status}
                              </Badge>
                            </div>
                            {study.description && (
                              <p className="text-sm text-gray-600">{study.description}</p>
                            )}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Results
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                Edit Study
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteStudy(study.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span>{study.questions.length} questions</span>
                            <span>Target: {study.audience.targetUsers} responses</span>
                            {study.audience.criteria.length > 0 && (
                              <span>{study.audience.criteria.length} criteria</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" className="bg-gray-900 text-white">
                              Launch
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Studies;
