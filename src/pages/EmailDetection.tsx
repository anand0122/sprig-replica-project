
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EmailDetection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sprig</h1>
        </div>

        <div className="mb-8">
          <div className="w-24 h-24 bg-teal-400 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="text-3xl">👔</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Switch to a work email instead?
          </h2>
          
          <p className="text-gray-600">
            It looks like you are signing up with a personal email.
          </p>
          
          <p className="text-gray-600">
            If you have a work email, signing up with it can help us find your teams and tailor your Sprig experience based on your company needs.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button 
            onClick={() => navigate("/role-selection")}
            variant="outline"
            className="w-full"
          >
            Continue anyway
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            Switch to a work email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetection;
