import React, { useState } from 'react';
import { FormQuestion } from '../services/aiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Trash2, Plus, GripVertical, Settings } from 'lucide-react';
import { Separator } from './ui/separator';

interface QuestionBuilderProps {
  question: FormQuestion;
  onUpdate: (question: FormQuestion) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const questionTypeLabels = {
  'short-answer': 'Short Answer',
  'paragraph': 'Paragraph',
  'multiple-choice': 'Multiple Choice',
  'checkboxes': 'Checkboxes',
  'dropdown': 'Dropdown',
  'file-upload': 'File Upload',
  'linear-scale': 'Linear Scale',
  'rating': 'Rating',
  'multiple-choice-grid': 'Multiple Choice Grid',
  'checkbox-grid': 'Checkbox Grid',
  'date': 'Date',
  'time': 'Time',
  'email': 'Email',
  'number': 'Number'
};

const questionTypeIcons = {
  'short-answer': '━',
  'paragraph': '☰',
  'multiple-choice': '◉',
  'checkboxes': '☑',
  'dropdown': '⌄',
  'file-upload': '☁',
  'linear-scale': '⟷',
  'rating': '★',
  'multiple-choice-grid': '⊞',
  'checkbox-grid': '⊡',
  'date': '📅',
  'time': '🕐',
  'email': '@',
  'number': '#'
};

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateQuestion = (updates: Partial<FormQuestion>) => {
    onUpdate({ ...question, ...updates });
  };

  const addOption = () => {
    const currentOptions = question.options || [];
    updateQuestion({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    updateQuestion({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(question.options || [])];
    newOptions.splice(index, 1);
    updateQuestion({ options: newOptions });
  };

  const addGridRow = () => {
    const currentRows = question.gridRows || [];
    updateQuestion({
      gridRows: [...currentRows, `Row ${currentRows.length + 1}`]
    });
  };

  const updateGridRow = (index: number, value: string) => {
    const newRows = [...(question.gridRows || [])];
    newRows[index] = value;
    updateQuestion({ gridRows: newRows });
  };

  const removeGridRow = (index: number) => {
    const newRows = [...(question.gridRows || [])];
    newRows.splice(index, 1);
    updateQuestion({ gridRows: newRows });
  };

  const addGridColumn = () => {
    const currentColumns = question.gridColumns || [];
    updateQuestion({
      gridColumns: [...currentColumns, `Column ${currentColumns.length + 1}`]
    });
  };

  const updateGridColumn = (index: number, value: string) => {
    const newColumns = [...(question.gridColumns || [])];
    newColumns[index] = value;
    updateQuestion({ gridColumns: newColumns });
  };

  const removeGridColumn = (index: number) => {
    const newColumns = [...(question.gridColumns || [])];
    newColumns.splice(index, 1);
    updateQuestion({ gridColumns: newColumns });
  };

  const renderQuestionTypeSpecificSettings = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'checkboxes':
      case 'dropdown':
  return (
          <div className="space-y-3">
        <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Options</Label>
          <Button
                type="button"
                variant="outline"
            size="sm"
                onClick={addOption}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {(question.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground w-6">
                    {question.type === 'multiple-choice' ? '◉' : question.type === 'checkboxes' ? '☑' : '⌄'}
                  </span>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'linear-scale':
      case 'rating':
        return (
          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-sm font-medium">Minimum Value</Label>
                  <Input
                    type="number"
                  value={question.scaleMin || 1}
                  onChange={(e) => updateQuestion({ scaleMin: parseInt(e.target.value) })}
                  className="mt-1"
                  />
                </div>
                <div>
                <Label className="text-sm font-medium">Maximum Value</Label>
                  <Input
                    type="number"
                  value={question.scaleMax || (question.type === 'rating' ? 5 : 10)}
                  onChange={(e) => updateQuestion({ scaleMax: parseInt(e.target.value) })}
                  className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-sm font-medium">Min Label</Label>
                  <Input
                  value={question.scaleMinLabel || ''}
                  onChange={(e) => updateQuestion({ scaleMinLabel: e.target.value })}
                  placeholder="e.g., Poor, Strongly Disagree"
                  className="mt-1"
                  />
                </div>
                <div>
                <Label className="text-sm font-medium">Max Label</Label>
                  <Input
                  value={question.scaleMaxLabel || ''}
                  onChange={(e) => updateQuestion({ scaleMaxLabel: e.target.value })}
                  placeholder="e.g., Excellent, Strongly Agree"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 'multiple-choice-grid':
      case 'checkbox-grid':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Rows</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGridRow}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>
              <div className="space-y-2">
                {(question.gridRows || []).map((row, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={row}
                      onChange={(e) => updateGridRow(index, e.target.value)}
                      placeholder={`Row ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGridRow(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Columns</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGridColumn}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Column
                </Button>
              </div>
              <div className="space-y-2">
                {(question.gridColumns || []).map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={column}
                      onChange={(e) => updateGridColumn(index, e.target.value)}
                      placeholder={`Column ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGridColumn(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'file-upload':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Allowed File Types</Label>
              <Input
                value={(question.validation?.fileTypes || []).join(', ')}
                onChange={(e) => updateQuestion({
                  validation: {
                    ...question.validation,
                    fileTypes: e.target.value.split(',').map(type => type.trim())
                  }
                })}
                placeholder=".pdf, .doc, .docx, .jpg, .png"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate file extensions with commas
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Maximum File Size (MB)</Label>
              <Input
                type="number"
                value={question.validation?.maxFileSize || 10}
                onChange={(e) => updateQuestion({
                  validation: {
                    ...question.validation,
                    maxFileSize: parseInt(e.target.value)
                  }
                })}
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderQuestionPreview = () => {
    switch (question.type) {
      case 'short-answer':
        return (
          <Input
            placeholder={question.placeholder || 'Enter your answer'}
            disabled
            className="mt-2"
          />
        );

      case 'paragraph':
        return (
          <Textarea
            placeholder={question.placeholder || 'Enter your detailed response'}
            disabled
            className="mt-2"
            rows={3}
          />
        );

      case 'multiple-choice':
        return (
          <div className="mt-2 space-y-2">
            {(question.options || ['Option 1']).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="mt-2 space-y-2">
            {(question.options || ['Option 1']).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-gray-300 rounded"></div>
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select disabled>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
          </Select>
        );

      case 'linear-scale':
        return (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                {question.scaleMinLabel || question.scaleMin || 1}
              </span>
              <span className="text-xs text-muted-foreground">
                {question.scaleMaxLabel || question.scaleMax || 10}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: (question.scaleMax || 10) - (question.scaleMin || 1) + 1 }).map((_, index) => (
                <div key={index} className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-xs">
                  {(question.scaleMin || 1) + index}
                </div>
              ))}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="mt-2 flex items-center space-x-1">
            {Array.from({ length: question.scaleMax || 5 }).map((_, index) => (
              <span key={index} className="text-2xl text-gray-300">★</span>
            ))}
          </div>
        );

      case 'multiple-choice-grid':
      case 'checkbox-grid':
        return (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2"></th>
                  {(question.gridColumns || ['Column 1']).map((column, index) => (
                    <th key={index} className="text-center p-2 text-xs">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(question.gridRows || ['Row 1']).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-2 text-xs">{row}</td>
                    {(question.gridColumns || ['Column 1']).map((_, colIndex) => (
                      <td key={colIndex} className="text-center p-2">
                        <div className={`w-4 h-4 border border-gray-300 ${question.type === 'multiple-choice-grid' ? 'rounded-full' : 'rounded'}`}></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'file-upload':
        return (
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <div className="text-gray-500">
              <span className="text-2xl">☁</span>
              <p className="text-sm mt-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">
                {question.validation?.fileTypes?.join(', ') || 'All file types'} 
                {question.validation?.maxFileSize && ` (max ${question.validation.maxFileSize}MB)`}
              </p>
            </div>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            disabled
            className="mt-2"
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            disabled
            className="mt-2"
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder="Enter your email address"
            disabled
            className="mt-2"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            disabled
            className="mt-2"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <Badge variant="outline" className="text-xs">
              {questionTypeIcons[question.type]} {questionTypeLabels[question.type]}
            </Badge>
            {question.required && (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="h-8"
            >
              Copy
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div>
          <Label className="text-sm font-medium">Question</Label>
          <Input
            value={question.question}
            onChange={(e) => updateQuestion({ question: e.target.value })}
            placeholder="Enter your question"
            className="mt-1"
          />
        </div>

        {/* Question Description */}
        <div>
          <Label className="text-sm font-medium">Description (optional)</Label>
          <Input
            value={question.description || ''}
            onChange={(e) => updateQuestion({ description: e.target.value })}
            placeholder="Add helpful context or instructions"
            className="mt-1"
          />
        </div>

        {/* Placeholder for text inputs */}
        {['short-answer', 'paragraph', 'email', 'number'].includes(question.type) && (
          <div>
            <Label className="text-sm font-medium">Placeholder Text</Label>
            <Input
              value={question.placeholder || ''}
              onChange={(e) => updateQuestion({ placeholder: e.target.value })}
              placeholder="Placeholder text for the input field"
              className="mt-1"
            />
          </div>
        )}

        {/* Question Type Specific Settings */}
        {renderQuestionTypeSpecificSettings()}

        {/* Advanced Settings */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Required</Label>
                  <p className="text-xs text-muted-foreground">Users must answer this question</p>
                </div>
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => updateQuestion({ required: checked })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: FormQuestion['type']) => updateQuestion({ type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-answer">📝 Short Answer</SelectItem>
                    <SelectItem value="paragraph">📄 Paragraph</SelectItem>
                    <SelectItem value="multiple-choice">◉ Multiple Choice</SelectItem>
                    <SelectItem value="checkboxes">☑ Checkboxes</SelectItem>
                    <SelectItem value="dropdown">⌄ Dropdown</SelectItem>
                    <SelectItem value="file-upload">☁ File Upload</SelectItem>
                    <SelectItem value="linear-scale">⟷ Linear Scale</SelectItem>
                    <SelectItem value="rating">★ Rating</SelectItem>
                    <SelectItem value="multiple-choice-grid">⊞ Multiple Choice Grid</SelectItem>
                    <SelectItem value="checkbox-grid">⊡ Checkbox Grid</SelectItem>
                    <SelectItem value="date">📅 Date</SelectItem>
                    <SelectItem value="time">🕐 Time</SelectItem>
                    <SelectItem value="email">@ Email</SelectItem>
                    <SelectItem value="number"># Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Question Preview */}
        <div>
          <Label className="text-sm font-medium">Preview</Label>
          <div className="mt-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start space-x-1">
              <span className="font-medium text-sm">{question.question || 'Untitled Question'}</span>
              {question.required && <span className="text-red-500">*</span>}
            </div>
            {question.description && (
              <p className="text-xs text-muted-foreground mt-1">{question.description}</p>
          )}
            {renderQuestionPreview()}
          </div>
        </div>
        </CardContent>
    </Card>
  );
};
