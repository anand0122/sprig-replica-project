
import { useParams } from 'react-router-dom';
import { StudyEmbed } from '@/components/StudyEmbed';
import { useToast } from '@/hooks/use-toast';

const StudyPreview = () => {
  const { studyId } = useParams();
  const { toast } = useToast();

  const handleComplete = (responseId: string) => {
    toast({
      title: "Response Submitted",
      description: "Thank you for your feedback!",
    });
  };

  if (!studyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Study ID not provided</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <StudyEmbed studyId={studyId} onComplete={handleComplete} />
    </div>
  );
};

export default StudyPreview;
