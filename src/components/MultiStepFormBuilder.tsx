import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Eye,
  Layout
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface FormPage {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
  settings: {
    showProgress: boolean;
    allowBack: boolean;
    customNextText?: string;
    customBackText?: string;
  };
}

interface MultiStepFormBuilderProps {
  questions: any[];
  pages: FormPage[];
  onPagesChange: (pages: FormPage[]) => void;
  onQuestionsChange: (questions: any[]) => void;
  currentPage: number;
  onCurrentPageChange: (page: number) => void;
}

export const MultiStepFormBuilder: React.FC<MultiStepFormBuilderProps> = ({
  questions,
  pages,
  onPagesChange,
  onQuestionsChange,
  currentPage,
  onCurrentPageChange
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const addPage = () => {
    const newPage: FormPage = {
      id: crypto.randomUUID(),
      title: `Page ${pages.length + 1}`,
      questionIds: [],
      settings: {
        showProgress: true,
        allowBack: true
      }
    };
    onPagesChange([...pages, newPage]);
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return; // Don't delete the last page
    const newPages = pages.filter(p => p.id !== pageId);
    onPagesChange(newPages);
    if (currentPage >= newPages.length) {
      onCurrentPageChange(newPages.length - 1);
    }
  };

  const updatePage = (pageId: string, updates: Partial<FormPage>) => {
    onPagesChange(pages.map(page => 
      page.id === pageId ? { ...page, ...updates } : page
    ));
  };

  const moveQuestionToPage = (questionId: string, targetPageId: string | null) => {
    // Remove the question from every page first
    let updatedPages = pages.map(page => ({
      ...page,
      questionIds: page.questionIds.filter(id => id !== questionId)
    }));

    // If dropping to Unassigned (targetPageId === null) just update pages without re-adding
    if (!targetPageId) {
      onPagesChange(updatedPages);
      return;
    }

    // Add to the target page
    updatedPages = updatedPages.map(page =>
      page.id === targetPageId
        ? { ...page, questionIds: [...page.questionIds, questionId] }
        : page
    );

    onPagesChange(updatedPages);
  };

  const reorderWithinUnassigned = (sourceIdx: number, destIdx: number) => {
    const unassigned = getUnassignedQuestions();
    const moved = Array.from(unassigned);
    const [item] = moved.splice(sourceIdx, 1);
    moved.splice(destIdx, 0, item);

    // Update overall questions array order to reflect new unassigned order
    const remainingAssigned = questions.filter(q => !unassigned.some(u => u.id === q.id));
    const newQuestions = [...remainingAssigned, ...moved];
    onQuestionsChange(newQuestions);
  };

  const getUnassignedQuestions = () => {
    const assignedQuestionIds = pages.flatMap(page => page.questionIds);
    return questions.filter(q => !assignedQuestionIds.includes(q.id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Moving within the same list (page or unassigned)
    if (source.droppableId === destination.droppableId) {
      const pageId = source.droppableId.replace('page-', '');
      if (source.droppableId === 'unassigned') {
        reorderWithinUnassigned(source.index, destination.index);
        return;
      }

      const page = pages.find(p => p.id === pageId);
      if (!page) return;

      const newQuestionIds = Array.from(page.questionIds);
      newQuestionIds.splice(source.index, 1);
      newQuestionIds.splice(destination.index, 0, draggableId);

      updatePage(pageId, { questionIds: newQuestionIds });
    } else {
      // Moving between lists
      const targetPageIdRaw = destination.droppableId;
      const targetPageId =
        targetPageIdRaw === 'unassigned' ? null : targetPageIdRaw.replace('page-', '');
      moveQuestionToPage(draggableId, targetPageId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Multi-Step Form
              <Badge variant="secondary">{pages.length} pages</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfiguring(!isConfiguring)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isConfiguring ? 'Close' : 'Configure'}
              </Button>
              <Button size="sm" onClick={addPage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Page Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {pages.map((page, index) => (
          <Button
            key={page.id}
            variant={currentPage === index ? "default" : "outline"}
            size="sm"
            onClick={() => onCurrentPageChange(index)}
            className="whitespace-nowrap"
          >
            {page.title}
            <Badge variant="secondary" className="ml-2">
              {page.questionIds.length}
            </Badge>
          </Button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unassigned Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Unassigned Questions
                <Badge variant="outline" className="ml-2">
                  {getUnassignedQuestions().length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="unassigned">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px]"
                  >
                    {getUnassignedQuestions().map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-move"
                          >
                            <div className="flex items-start gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400 mt-1" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {question.question}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {question.type}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {getUnassignedQuestions().length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        All questions are assigned to pages
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Current Page Configuration */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {pages[currentPage]?.title || 'Page Configuration'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCurrentPageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCurrentPageChange(Math.min(pages.length - 1, currentPage + 1))}
                    disabled={currentPage === pages.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  {pages.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePage(pages[currentPage].id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {pages[currentPage] && (
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="questions" className="space-y-4">
                    <Droppable droppableId={`page-${pages[currentPage].id}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg p-4"
                        >
                          <div className="text-sm text-gray-600 mb-4">
                            Drag questions here to add them to this page
                          </div>
                          
                          {pages[currentPage].questionIds.map((questionId, index) => {
                            const question = questions.find(q => q.id === questionId);
                            if (!question) return null;

                            return (
                              <Draggable
                                key={questionId}
                                draggableId={questionId}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-4 border rounded-lg bg-white hover:shadow-sm cursor-move"
                                  >
                                    <div className="flex items-start gap-3">
                                      <GripVertical className="w-4 h-4 text-gray-400 mt-1" />
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {question.question}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                          Type: {question.type}
                                          {question.required && (
                                            <Badge variant="outline" className="ml-2">
                                              Required
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Page Title</Label>
                        <Input
                          value={pages[currentPage].title}
                          onChange={(e) => updatePage(pages[currentPage].id, { title: e.target.value })}
                          placeholder="Enter page title"
                        />
                      </div>
                      <div>
                        <Label>Page Description</Label>
                        <Input
                          value={pages[currentPage].description || ''}
                          onChange={(e) => updatePage(pages[currentPage].id, { description: e.target.value })}
                          placeholder="Optional description"
                        />
                      </div>
                      <div>
                        <Label>Next Button Text</Label>
                        <Input
                          value={pages[currentPage].settings.customNextText || ''}
                          onChange={(e) => updatePage(pages[currentPage].id, {
                            settings: {
                              ...pages[currentPage].settings,
                              customNextText: e.target.value
                            }
                          })}
                          placeholder="Next (default)"
                        />
                      </div>
                      <div>
                        <Label>Back Button Text</Label>
                        <Input
                          value={pages[currentPage].settings.customBackText || ''}
                          onChange={(e) => updatePage(pages[currentPage].id, {
                            settings: {
                              ...pages[currentPage].settings,
                              customBackText: e.target.value
                            }
                          })}
                          placeholder="Back (default)"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Show Progress Bar</Label>
                        <input
                          type="checkbox"
                          checked={pages[currentPage].settings.showProgress}
                          onChange={(e) => updatePage(pages[currentPage].id, {
                            settings: {
                              ...pages[currentPage].settings,
                              showProgress: e.target.checked
                            }
                          })}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Allow Back Navigation</Label>
                        <input
                          type="checkbox"
                          checked={pages[currentPage].settings.allowBack}
                          onChange={(e) => updatePage(pages[currentPage].id, {
                            settings: {
                              ...pages[currentPage].settings,
                              allowBack: e.target.checked
                            }
                          })}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      {/* Form Preview */}
      {isConfiguring && (
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pages.map((page, index) => (
                <div key={page.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">
                      Page {index + 1}: {page.title}
                    </h3>
                    <Badge variant="outline">
                      {page.questionIds.length} questions
                    </Badge>
                  </div>
                  {page.description && (
                    <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    Questions: {page.questionIds.map(id => {
                      const q = questions.find(question => question.id === id);
                      return q ? q.question.substring(0, 30) + '...' : 'Unknown';
                    }).join(', ') || 'No questions assigned'}
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