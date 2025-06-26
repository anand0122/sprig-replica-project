
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Plus, GripVertical } from "lucide-react";
import type { Question } from "./StudyBuilder";

interface QuestionBuilderProps {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

export const QuestionBuilder = ({ question, index, onUpdate, onDelete }: QuestionBuilderProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate({ options: newOptions });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = question.options?.filter((_, i) => i !== optionIndex) || [];
    onUpdate({ options: newOptions });
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
              Q{index}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              {question.title || `Question ${index}`}
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Question Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Title *
            </label>
            <Textarea
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter your question here..."
              rows={2}
            />
          </div>

          {/* Question Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <Select
                value={question.type}
                onValueChange={(value: Question['type']) => onUpdate({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating Scale</SelectItem>
                  <SelectItem value="text">Open Text</SelectItem>
                  <SelectItem value="choice">Multiple Choice</SelectItem>
                  <SelectItem value="nps">Net Promoter Score</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-6">
              <span className="text-sm font-medium text-gray-700">Required</span>
              <Switch
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
            </div>
          </div>

          {/* Type-specific settings */}
          {question.type === 'rating' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Rating Scale Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Value
                  </label>
                  <Input
                    type="number"
                    value={question.scale?.min || 1}
                    onChange={(e) => onUpdate({
                      scale: { ...question.scale!, min: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Value
                  </label>
                  <Input
                    type="number"
                    value={question.scale?.max || 5}
                    onChange={(e) => onUpdate({
                      scale: { ...question.scale!, max: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Label (optional)
                  </label>
                  <Input
                    value={question.scale?.minLabel || ''}
                    onChange={(e) => onUpdate({
                      scale: { ...question.scale!, minLabel: e.target.value }
                    })}
                    placeholder="e.g., Strongly Disagree"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Label (optional)
                  </label>
                  <Input
                    value={question.scale?.maxLabel || ''}
                    onChange={(e) => onUpdate({
                      scale: { ...question.scale!, maxLabel: e.target.value }
                    })}
                    placeholder="e.g., Strongly Agree"
                  />
                </div>
              </div>
            </div>
          )}

          {question.type === 'choice' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Multiple Choice Options</h4>
              <div className="space-y-2">
                {(question.options || []).map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(optionIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
