
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface Audience {
  targetUsers: number;
  criteria: string[];
}

interface AudienceSettingsProps {
  audience: Audience;
  onUpdate: (audience: Audience) => void;
}

export const AudienceSettings = ({ audience, onUpdate }: AudienceSettingsProps) => {
  const [newCriterion, setNewCriterion] = useState('');

  const addCriterion = () => {
    if (newCriterion.trim()) {
      onUpdate({
        ...audience,
        criteria: [...audience.criteria, newCriterion.trim()]
      });
      setNewCriterion('');
    }
  };

  const removeCriterion = (index: number) => {
    onUpdate({
      ...audience,
      criteria: audience.criteria.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
          <p className="text-sm text-gray-600">
            Define who should participate in your study
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Number of Responses
            </label>
            <Input
              type="number"
              value={audience.targetUsers}
              onChange={(e) => onUpdate({
                ...audience,
                targetUsers: parseInt(e.target.value) || 0
              })}
              placeholder="100"
              min="1"
              max="10000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 100-500 responses for statistical significance
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audience Criteria
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  placeholder="e.g., Active users in the last 30 days"
                  onKeyDown={(e) => e.key === 'Enter' && addCriterion()}
                />
                <Button onClick={addCriterion} disabled={!newCriterion.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {audience.criteria.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {audience.criteria.map((criterion, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {criterion}
                      <button
                        onClick={() => removeCriterion(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Active users (last 7 days)",
              "New users (first week)",
              "Power users (high engagement)",
              "Mobile users only",
              "Desktop users only",
              "Paid subscribers",
              "Free tier users",
              "Specific geographic region"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => onUpdate({
                  ...audience,
                  criteria: [...audience.criteria, suggestion]
                })}
                disabled={audience.criteria.includes(suggestion)}
                className="justify-start text-left h-auto py-2"
              >
                <Plus className="w-3 h-3 mr-2" />
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
