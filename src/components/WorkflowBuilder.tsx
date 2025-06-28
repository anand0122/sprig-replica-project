import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Trash2, 
  Mail, 
  Webhook, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowRight,
  Settings,
  Zap
} from 'lucide-react';

interface ApprovalStep {
  id: string;
  name: string;
  approverEmail: string;
  approverRole: string;
  autoApprove?: boolean;
  autoApproveConditions?: {
    field: string;
    condition: string;
    value: string;
  }[];
  timeoutHours?: number;
  timeoutAction: 'approve' | 'reject' | 'escalate';
  escalateToEmail?: string;
}

interface PostSubmissionAction {
  id: string;
  type: 'email' | 'webhook' | 'slack' | 'zapier' | 'custom';
  name: string;
  enabled: boolean;
  trigger: 'immediate' | 'approved' | 'rejected' | 'timeout';
  config: {
    // Email config
    to?: string;
    subject?: string;
    template?: string;
    // Webhook config
    url?: string;
    method?: 'POST' | 'PUT' | 'PATCH';
    headers?: Record<string, string>;
    // Slack config
    channel?: string;
    message?: string;
    // Zapier config
    webhookUrl?: string;
  };
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
}

interface Workflow {
  id: string;
  name: string;
  enabled: boolean;
  requiresApproval: boolean;
  approvalSteps: ApprovalStep[];
  postSubmissionActions: PostSubmissionAction[];
  settings: {
    allowResubmission: boolean;
    notifySubmitterOnApproval: boolean;
    notifySubmitterOnRejection: boolean;
    autoArchiveAfterDays?: number;
  };
}

interface WorkflowBuilderProps {
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onWorkflowChange
}) => {
  const [activeTab, setActiveTab] = useState('approval');

  const updateWorkflow = (updates: Partial<Workflow>) => {
    onWorkflowChange({ ...workflow, ...updates });
  };

  const addApprovalStep = () => {
    const newStep: ApprovalStep = {
      id: crypto.randomUUID(),
      name: `Approval Step ${workflow.approvalSteps.length + 1}`,
      approverEmail: '',
      approverRole: '',
      timeoutHours: 24,
      timeoutAction: 'escalate'
    };
    updateWorkflow({
      approvalSteps: [...workflow.approvalSteps, newStep]
    });
  };

  const updateApprovalStep = (stepId: string, updates: Partial<ApprovalStep>) => {
    updateWorkflow({
      approvalSteps: workflow.approvalSteps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    });
  };

  const deleteApprovalStep = (stepId: string) => {
    updateWorkflow({
      approvalSteps: workflow.approvalSteps.filter(step => step.id !== stepId)
    });
  };

  const addPostSubmissionAction = () => {
    const newAction: PostSubmissionAction = {
      id: crypto.randomUUID(),
      type: 'email',
      name: 'New Action',
      enabled: true,
      trigger: 'immediate',
      config: {}
    };
    updateWorkflow({
      postSubmissionActions: [...workflow.postSubmissionActions, newAction]
    });
  };

  const updatePostSubmissionAction = (actionId: string, updates: Partial<PostSubmissionAction>) => {
    updateWorkflow({
      postSubmissionActions: workflow.postSubmissionActions.map(action =>
        action.id === actionId ? { ...action, ...updates } : action
      )
    });
  };

  const deletePostSubmissionAction = (actionId: string) => {
    updateWorkflow({
      postSubmissionActions: workflow.postSubmissionActions.filter(action => action.id !== actionId)
    });
  };

  const actionTypeIcons = {
    email: Mail,
    webhook: Webhook,
    slack: Zap,
    zapier: Zap,
    custom: Settings
  };

  const triggerLabels = {
    immediate: 'Immediately after submission',
    approved: 'After approval',
    rejected: 'After rejection',
    timeout: 'On timeout'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Workflow Automation
            {workflow.enabled && <Badge variant="default">Active</Badge>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Enable Workflow</Label>
            <input
              type="checkbox"
              checked={workflow.enabled}
              onChange={(e) => updateWorkflow({ enabled: e.target.checked })}
              className="rounded"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
            <TabsTrigger value="actions">Post-Submission Actions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="approval" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Approval Required</h3>
                <p className="text-sm text-gray-600">
                  Require approval before form submissions are processed
                </p>
              </div>
              <input
                type="checkbox"
                checked={workflow.requiresApproval}
                onChange={(e) => updateWorkflow({ requiresApproval: e.target.checked })}
                className="rounded"
              />
            </div>

            {workflow.requiresApproval && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Approval Steps</h4>
                  <Button size="sm" onClick={addApprovalStep}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>

                {workflow.approvalSteps.map((step, index) => (
                  <Card key={step.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          Step {index + 1}
                        </h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApprovalStep(step.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Step Name</Label>
                          <Input
                            value={step.name}
                            onChange={(e) => updateApprovalStep(step.id, { name: e.target.value })}
                            placeholder="e.g., Manager Approval"
                          />
                        </div>
                        <div>
                          <Label>Approver Email</Label>
                          <Input
                            value={step.approverEmail}
                            onChange={(e) => updateApprovalStep(step.id, { approverEmail: e.target.value })}
                            placeholder="approver@company.com"
                          />
                        </div>
                        <div>
                          <Label>Approver Role</Label>
                          <Input
                            value={step.approverRole}
                            onChange={(e) => updateApprovalStep(step.id, { approverRole: e.target.value })}
                            placeholder="e.g., Manager, Director"
                          />
                        </div>
                        <div>
                          <Label>Timeout (hours)</Label>
                          <Input
                            type="number"
                            value={step.timeoutHours || ''}
                            onChange={(e) => updateApprovalStep(step.id, { timeoutHours: parseInt(e.target.value) })}
                            placeholder="24"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Timeout Action</Label>
                        <Select
                          value={step.timeoutAction}
                          onValueChange={(value: any) => updateApprovalStep(step.id, { timeoutAction: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approve">Auto-approve</SelectItem>
                            <SelectItem value="reject">Auto-reject</SelectItem>
                            <SelectItem value="escalate">Escalate to next approver</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {step.timeoutAction === 'escalate' && (
                        <div className="mt-4">
                          <Label>Escalate to Email</Label>
                          <Input
                            value={step.escalateToEmail || ''}
                            onChange={(e) => updateApprovalStep(step.id, { escalateToEmail: e.target.value })}
                            placeholder="escalation@company.com"
                          />
                        </div>
                      )}

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4" />
                          <span>
                            {step.approverEmail ? step.approverEmail : 'No approver set'} has {step.timeoutHours || 24} hours to respond
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {workflow.approvalSteps.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No approval steps configured. Add a step to get started.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Post-Submission Actions</h3>
                <p className="text-sm text-gray-600">
                  Automate actions when forms are submitted, approved, or rejected
                </p>
              </div>
              <Button size="sm" onClick={addPostSubmissionAction}>
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>

            {workflow.postSubmissionActions.map((action) => {
              const IconComponent = actionTypeIcons[action.type];
              return (
                <Card key={action.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-blue-500" />
                        <h5 className="font-medium">{action.name}</h5>
                        {action.enabled && <Badge variant="default">Enabled</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          checked={action.enabled}
                          onChange={(e) => updatePostSubmissionAction(action.id, { enabled: e.target.checked })}
                          className="rounded"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePostSubmissionAction(action.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Action Name</Label>
                        <Input
                          value={action.name}
                          onChange={(e) => updatePostSubmissionAction(action.id, { name: e.target.value })}
                          placeholder="Enter action name"
                        />
                      </div>
                      <div>
                        <Label>Action Type</Label>
                        <Select
                          value={action.type}
                          onValueChange={(value: any) => updatePostSubmissionAction(action.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                            <SelectItem value="slack">Slack</SelectItem>
                            <SelectItem value="zapier">Zapier</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Trigger</Label>
                        <Select
                          value={action.trigger}
                          onValueChange={(value: any) => updatePostSubmissionAction(action.id, { trigger: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(triggerLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Action-specific configuration */}
                    {action.type === 'email' && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <Label>To Email</Label>
                          <Input
                            value={action.config.to || ''}
                            onChange={(e) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, to: e.target.value }
                            })}
                            placeholder="recipient@example.com"
                          />
                        </div>
                        <div>
                          <Label>Subject</Label>
                          <Input
                            value={action.config.subject || ''}
                            onChange={(e) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, subject: e.target.value }
                            })}
                            placeholder="Form submission notification"
                          />
                        </div>
                        <div>
                          <Label>Email Template</Label>
                          <Textarea
                            value={action.config.template || ''}
                            onChange={(e) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, template: e.target.value }
                            })}
                            placeholder="Email content with {{variables}}"
                            rows={4}
                          />
                        </div>
                      </div>
                    )}

                    {action.type === 'webhook' && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <Label>Webhook URL</Label>
                          <Input
                            value={action.config.url || ''}
                            onChange={(e) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, url: e.target.value }
                            })}
                            placeholder="https://api.example.com/webhook"
                          />
                        </div>
                        <div>
                          <Label>HTTP Method</Label>
                          <Select
                            value={action.config.method || 'POST'}
                            onValueChange={(value: any) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, method: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {action.type === 'slack' && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <Label>Slack Channel</Label>
                          <Input
                            value={action.config.channel || ''}
                            onChange={(e) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, channel: e.target.value }
                            })}
                            placeholder="#general"
                          />
                        </div>
                        <div>
                          <Label>Message Template</Label>
                          <Textarea
                            value={action.config.message || ''}
                            onChange={(e) => updatePostSubmissionAction(action.id, {
                              config: { ...action.config, message: e.target.value }
                            })}
                            placeholder="New form submission received!"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <ArrowRight className="w-4 h-4" />
                        <span>
                          This action will trigger {triggerLabels[action.trigger].toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {workflow.postSubmissionActions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No post-submission actions configured. Add an action to automate workflows.
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Allow Resubmission</Label>
                  <p className="text-sm text-gray-600">
                    Allow users to resubmit after rejection
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={workflow.settings.allowResubmission}
                  onChange={(e) => updateWorkflow({
                    settings: { ...workflow.settings, allowResubmission: e.target.checked }
                  })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Notify Submitter on Approval</Label>
                  <p className="text-sm text-gray-600">
                    Send email when submission is approved
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={workflow.settings.notifySubmitterOnApproval}
                  onChange={(e) => updateWorkflow({
                    settings: { ...workflow.settings, notifySubmitterOnApproval: e.target.checked }
                  })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Notify Submitter on Rejection</Label>
                  <p className="text-sm text-gray-600">
                    Send email when submission is rejected
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={workflow.settings.notifySubmitterOnRejection}
                  onChange={(e) => updateWorkflow({
                    settings: { ...workflow.settings, notifySubmitterOnRejection: e.target.checked }
                  })}
                  className="rounded"
                />
              </div>

              <div>
                <Label>Auto-Archive After (days)</Label>
                <Input
                  type="number"
                  value={workflow.settings.autoArchiveAfterDays || ''}
                  onChange={(e) => updateWorkflow({
                    settings: { 
                      ...workflow.settings, 
                      autoArchiveAfterDays: e.target.value ? parseInt(e.target.value) : undefined 
                    }
                  })}
                  placeholder="30"
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Automatically archive approved/rejected submissions after specified days
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 