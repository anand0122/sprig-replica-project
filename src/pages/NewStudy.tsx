
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StudyBuilder, Study } from "@/components/StudyBuilder";
import { useToast } from "@/hooks/use-toast";

const NewStudy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveStudy = (study: Study) => {
    // For now, we'll save to localStorage (in production this would be a database)
    const existingStudies = JSON.parse(localStorage.getItem('sprig_studies') || '[]');
    const updatedStudies = [...existingStudies, { ...study, createdAt: new Date().toISOString() }];
    localStorage.setItem('sprig_studies', JSON.stringify(updatedStudies));

    toast({
      title: "Study Created",
      description: `"${study.name}" has been saved successfully.`,
    });

    navigate('/studies');
  };

  const handleCancel = () => {
    navigate('/studies');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
            </div>
            
            <StudyBuilder
              onSave={handleSaveStudy}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NewStudy;
