import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Trash2, ArrowRight, Settings } from 'lucide-react';

interface ConditionalRule {
  id: string;
  sourceQuestionId: string;
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string;
  action: 'show' | 'hide' | 'jump_to' | 'required' | 'optional';
  targetQuestionIds: string[];
  jumpToPage?: number;
}

interface ConditionalLogicBuilderProps {
  questions: any[];
  rules: ConditionalRule[];
  onRulesChange: (rules: ConditionalRule[]) => void;
}

export const ConditionalLogicBuilder: React.FC<ConditionalLogicBuilderProps> = ({
  questions,
  rules,
  onRulesChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const addRule = () => {
    const newRule: ConditionalRule = {
      id: crypto.randomUUID(),
      sourceQuestionId: '',
      condition: 'equals',
      value: '',
      action: 'show',
      targetQuestionIds: []
    };
    onRulesChange([...rules, newRule]);
  };

  const updateRule = (ruleId: string, updates: Partial<ConditionalRule>) => {
    onRulesChange(rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    onRulesChange(rules.filter(rule => rule.id !== ruleId));
  };

  const getQuestionTitle = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.question : 'Unknown Question';
  };

  const conditionLabels = {
    equals: 'equals',
    not_equals: 'does not equal',
    contains: 'contains',
    greater_than: 'is greater than',
    less_than: 'is less than',
    is_empty: 'is empty',
    is_not_empty: 'is not empty'
  };

  const actionLabels = {
    show: 'Show',
    hide: 'Hide',
    jump_to: 'Jump to page',
    required: 'Make required',
    optional: 'Make optional'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Conditional Logic
            {rules.length > 0 && (
              <Badge variant="secondary">{rules.length} rules</Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Configure'}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Create rules to show, hide, or modify questions based on user responses.
          </div>

          {rules.map((rule) => (
            <Card key={rule.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  {/* Source Question */}
                  <div>
                    <Label className="text-xs font-medium">When</Label>
                    <Select
                      value={rule.sourceQuestionId}
                      onValueChange={(value) => updateRule(rule.id, { sourceQuestionId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.map((question) => (
                          <SelectItem key={question.id} value={question.id}>
                            {question.question.substring(0, 40)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label className="text-xs font-medium">Condition</Label>
                    <Select
                      value={rule.condition}
                      onValueChange={(value: any) => updateRule(rule.id, { condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(conditionLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value */}
                  {!['is_empty', 'is_not_empty'].includes(rule.condition) && (
                    <div>
                      <Label className="text-xs font-medium">Value</Label>
                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                        placeholder="Enter value"
                      />
                    </div>
                  )}

                  {/* Action */}
                  <div>
                    <Label className="text-xs font-medium">Action</Label>
                    <Select
                      value={rule.action}
                      onValueChange={(value: any) => updateRule(rule.id, { action: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(actionLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target Questions */}
                <div className="mt-4">
                  <Label className="text-xs font-medium">
                    {rule.action === 'jump_to' ? 'Jump to Page' : 'Target Questions'}
                  </Label>
                  
                  {rule.action === 'jump_to' ? (
                    <Input
                      type="number"
                      value={rule.jumpToPage || ''}
                      onChange={(e) => updateRule(rule.id, { jumpToPage: parseInt(e.target.value) })}
                      placeholder="Page number"
                      className="mt-1"
                    />
                  ) : (
                    <Select
                      value={rule.targetQuestionIds[0] || ''}
                      onValueChange={(value) => updateRule(rule.id, { targetQuestionIds: [value] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select target questions" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions
                          .filter(q => q.id !== rule.sourceQuestionId)
                          .map((question) => (
                            <SelectItem key={question.id} value={question.id}>
                              {question.question.substring(0, 50)}...
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Rule Preview */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="font-medium">Rule:</span>
                    <span>When "{getQuestionTitle(rule.sourceQuestionId)}"</span>
                    <ArrowRight className="w-4 h-4" />
                    <span>{conditionLabels[rule.condition]}</span>
                    {rule.value && <span>"{rule.value}"</span>}
                    <ArrowRight className="w-4 h-4" />
                    <span>{actionLabels[rule.action]}</span>
                    {rule.targetQuestionIds[0] && (
                      <span>"{getQuestionTitle(rule.targetQuestionIds[0])}"</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addRule}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Conditional Rule
          </Button>

          {rules.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Rules are evaluated in order when users answer questions</li>
                <li>• Multiple rules can target the same question</li>
                <li>• Jump actions will skip to the specified page</li>
                <li>• Show/hide actions affect question visibility</li>
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}; 