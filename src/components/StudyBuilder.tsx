
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Eye, Settings, Users } from "lucide-react";
import { QuestionBuilder } from "./QuestionBuilder";
import { AudienceSettings } from "./AudienceSettings";

export interface Question {
  id: string;
  type: 'rating' | 'text' | 'choice' | 'nps';
  title: string;
  required: boolean;
  options?: string[];
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string };
}

export interface Study {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  audience: {
    targetUsers: number;
    criteria: string[];
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
}

interface StudyBuilderProps {
  onSave: (study: Study) => void;
  onCancel: () => void;
  initialStudy?: Study;
}

export const StudyBuilder = ({ onSave, onCancel, initialStudy }: StudyBuilderProps) => {
  const [study, setStudy] = useState<Study>(
    initialStudy || {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      questions: [],
      audience: { targetUsers: 100, criteria: [] },
      status: 'draft'
    }
  );
  
  const [activeTab, setActiveTab] = useState<'questions' | 'audience' | 'preview'>('questions');

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: 'rating',
      title: '',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' }
    };
    
    setStudy(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setStudy(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setStudy(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSave = () => {
    if (study.name && study.questions.length > 0) {
      onSave(study);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Study</h1>
          <p className="text-gray-600">Build your user research study</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!study.name || study.questions.length === 0}
            className="bg-gray-900 text-white"
          >
            Save Study
          </Button>
        </div>
      </div>

      {/* Study Details */}
      <Card>
        <CardHeader>
          <CardTitle>Study Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Name *
            </label>
            <Input
              value={study.name}
              onChange={(e) => setStudy(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., New Feature Feedback Study"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              value={study.description}
              onChange={(e) => setStudy(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your study goals"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Questions ({study.questions.length})
          </button>
          <button
            onClick={() => setActiveTab('audience')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audience'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Audience
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {study.questions.map((question, index) => (
            <QuestionBuilder
              key={question.id}
              question={question}
              index={index + 1}
              onUpdate={(updates) => updateQuestion(question.id, updates)}
              onDelete={() => deleteQuestion(question.id)}
            />
          ))}
          
          <Button
            onClick={addQuestion}
            variant="outline"
            className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      )}

      {activeTab === 'audience' && (
        <AudienceSettings
          audience={study.audience}
          onUpdate={(audience) => setStudy(prev => ({ ...prev, audience }))}
        />
      )}

      {activeTab === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Study Preview</CardTitle>
            <p className="text-sm text-gray-600">This is how your study will appear to participants</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{study.name || 'Untitled Study'}</h3>
                {study.description && (
                  <p className="text-gray-600 mt-2">{study.description}</p>
                )}
              </div>
              
              {study.questions.map((question, index) => (
                <div key={question.id} className="bg-white p-4 rounded border">
                  <div className="flex items-start gap-3">
                    <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {question.title || 'Untitled Question'}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      <div className="mt-3 text-sm text-gray-500">
                        {question.type === 'rating' && (
                          <div>Rating scale ({question.scale?.min} - {question.scale?.max})</div>
                        )}
                        {question.type === 'text' && <div>Open text response</div>}
                        {question.type === 'choice' && (
                          <div>Multiple choice ({question.options?.length || 0} options)</div>
                        )}
                        {question.type === 'nps' && <div>Net Promoter Score (0-10)</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
