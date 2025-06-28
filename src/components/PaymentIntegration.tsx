import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  CreditCard, 
  DollarSign, 
  Lock, 
  Unlock,
  Crown,
  Star,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface PaymentProvider {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'square';
  enabled: boolean;
  config: {
    publishableKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    environment: 'sandbox' | 'live';
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    forms: number;
    responses: number;
    storage: number; // in GB
    teamMembers: number;
  };
  popular?: boolean;
}

interface PaymentForm {
  id: string;
  formId: string;
  enabled: boolean;
  type: 'one-time' | 'subscription' | 'donation';
  amount?: number;
  currency: string;
  description: string;
  successUrl?: string;
  cancelUrl?: string;
  allowCustomAmount?: boolean;
  minAmount?: number;
  maxAmount?: number;
  subscriptionPlanId?: string;
}

interface PaymentIntegrationProps {
  providers: PaymentProvider[];
  subscriptionPlans: SubscriptionPlan[];
  paymentForms: PaymentForm[];
  currentPlan?: SubscriptionPlan;
  onProviderUpdate: (provider: PaymentProvider) => void;
  onPlanUpdate: (plan: SubscriptionPlan) => void;
  onPaymentFormUpdate: (form: PaymentForm) => void;
}

export const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  providers,
  subscriptionPlans,
  paymentForms,
  currentPlan,
  onProviderUpdate,
  onPlanUpdate,
  onPaymentFormUpdate
}) => {
  const [activeTab, setActiveTab] = useState('providers');
  const [editingProvider, setEditingProvider] = useState<PaymentProvider | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPaymentForm, setEditingPaymentForm] = useState<PaymentForm | null>(null);

  const providerIcons = {
    stripe: '💳',
    paypal: '🅿️',
    razorpay: '💰',
    square: '⬜'
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$'
  };

  const formatPrice = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || currency;
    return `${symbol}${amount}`;
  };

  const createNewPlan = () => {
    const newPlan: SubscriptionPlan = {
      id: crypto.randomUUID(),
      name: 'New Plan',
      description: 'Plan description',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: [],
      limits: {
        forms: 10,
        responses: 1000,
        storage: 1,
        teamMembers: 1
      }
    };
    setEditingPlan(newPlan);
  };

  const createNewPaymentForm = () => {
    const newForm: PaymentForm = {
      id: crypto.randomUUID(),
      formId: '',
      enabled: true,
      type: 'one-time',
      amount: 0,
      currency: 'USD',
      description: 'Payment for form submission'
    };
    setEditingPaymentForm(newForm);
  };

  const savePlan = () => {
    if (editingPlan) {
      onPlanUpdate(editingPlan);
      setEditingPlan(null);
    }
  };

  const savePaymentForm = () => {
    if (editingPaymentForm) {
      onPaymentFormUpdate(editingPaymentForm);
      setEditingPaymentForm(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Integration
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="forms">Payment Forms</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Payment Providers</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Provider
              </Button>
            </div>

            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {providerIcons[provider.type]}
                      </div>
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.type.toUpperCase()}</p>
                        <Badge variant={provider.enabled ? "default" : "secondary"} className="mt-1">
                          {provider.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProvider(provider)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onProviderUpdate({
                          ...provider,
                          enabled: !provider.enabled
                        })}
                      >
                        {provider.enabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {provider.enabled && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Environment:</span>
                          <Badge variant="outline">
                            {provider.config.environment}
                          </Badge>
                        </div>
                        {provider.config.publishableKey && (
                          <div className="flex justify-between">
                            <span>Publishable Key:</span>
                            <span className="font-mono text-xs">
                              {provider.config.publishableKey.substring(0, 20)}...
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Webhook:</span>
                          <span className={provider.config.webhookSecret ? "text-green-600" : "text-red-600"}>
                            {provider.config.webhookSecret ? "Configured" : "Not configured"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Provider Configuration Modal */}
            {editingProvider && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Configure {editingProvider.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Environment</Label>
                    <Select
                      value={editingProvider.config.environment}
                      onValueChange={(value: any) => setEditingProvider({
                        ...editingProvider,
                        config: { ...editingProvider.config, environment: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Publishable Key</Label>
                    <Input
                      value={editingProvider.config.publishableKey || ''}
                      onChange={(e) => setEditingProvider({
                        ...editingProvider,
                        config: { ...editingProvider.config, publishableKey: e.target.value }
                      })}
                      placeholder="pk_test_..."
                    />
                  </div>

                  <div>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={editingProvider.config.secretKey || ''}
                      onChange={(e) => setEditingProvider({
                        ...editingProvider,
                        config: { ...editingProvider.config, secretKey: e.target.value }
                      })}
                      placeholder="sk_test_..."
                    />
                  </div>

                  <div>
                    <Label>Webhook Secret</Label>
                    <Input
                      value={editingProvider.config.webhookSecret || ''}
                      onChange={(e) => setEditingProvider({
                        ...editingProvider,
                        config: { ...editingProvider.config, webhookSecret: e.target.value }
                      })}
                      placeholder="whsec_..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => {
                      onProviderUpdate(editingProvider);
                      setEditingProvider(null);
                    }}>
                      Save Configuration
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProvider(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Subscription Plans</h3>
              <Button size="sm" onClick={createNewPlan}>
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      {plan.name}
                      {plan.id === currentPlan?.id && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      {formatPrice(plan.price, plan.currency)}
                      <span className="text-sm font-normal text-gray-600">
                        /{plan.interval}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span>Forms</span>
                        <span className="font-medium">
                          {plan.limits.forms === -1 ? 'Unlimited' : plan.limits.forms}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Responses</span>
                        <span className="font-medium">
                          {plan.limits.responses === -1 ? 'Unlimited' : plan.limits.responses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span className="font-medium">{plan.limits.storage}GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Team Members</span>
                        <span className="font-medium">{plan.limits.teamMembers}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPlan(plan)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {plan.id !== currentPlan?.id && (
                        <Button size="sm" className="flex-1">
                          Select Plan
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Plan Editor */}
            {editingPlan && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingPlan.name === 'New Plan' ? 'Create Plan' : 'Edit Plan'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Plan Name</Label>
                      <Input
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={editingPlan.description}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          description: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          price: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select
                        value={editingPlan.currency}
                        onValueChange={(value) => setEditingPlan({
                          ...editingPlan,
                          currency: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Forms Limit</Label>
                      <Input
                        type="number"
                        value={editingPlan.limits.forms}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          limits: { ...editingPlan.limits, forms: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Responses Limit</Label>
                      <Input
                        type="number"
                        value={editingPlan.limits.responses}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          limits: { ...editingPlan.limits, responses: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Storage (GB)</Label>
                      <Input
                        type="number"
                        value={editingPlan.limits.storage}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          limits: { ...editingPlan.limits, storage: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Team Members</Label>
                      <Input
                        type="number"
                        value={editingPlan.limits.teamMembers}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          limits: { ...editingPlan.limits, teamMembers: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={savePlan}>
                      {editingPlan.name === 'New Plan' ? 'Create Plan' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPlan(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Payment Forms</h3>
              <Button size="sm" onClick={createNewPaymentForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Form
              </Button>
            </div>

            {paymentForms.map((form) => (
              <Card key={form.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{form.description}</h4>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{form.type}</Badge>
                        <Badge variant={form.enabled ? "default" : "secondary"}>
                          {form.enabled ? "Active" : "Inactive"}
                        </Badge>
                        {form.amount && (
                          <Badge variant="outline">
                            {formatPrice(form.amount, form.currency)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPaymentForm(form)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPaymentFormUpdate({
                          ...form,
                          enabled: !form.enabled
                        })}
                      >
                        {form.enabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {form.allowCustomAmount && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium">Custom Amount:</span>
                        <span className="ml-2">
                          {form.minAmount && `Min: ${formatPrice(form.minAmount, form.currency)}`}
                          {form.minAmount && form.maxAmount && ' - '}
                          {form.maxAmount && `Max: ${formatPrice(form.maxAmount, form.currency)}`}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Payment Form Editor */}
            {editingPaymentForm && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingPaymentForm.description === 'Payment for form submission' ? 'Create Payment Form' : 'Edit Payment Form'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={editingPaymentForm.description}
                        onChange={(e) => setEditingPaymentForm({
                          ...editingPaymentForm,
                          description: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Payment Type</Label>
                      <Select
                        value={editingPaymentForm.type}
                        onValueChange={(value: any) => setEditingPaymentForm({
                          ...editingPaymentForm,
                          type: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time Payment</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="donation">Donation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={editingPaymentForm.amount || ''}
                        onChange={(e) => setEditingPaymentForm({
                          ...editingPaymentForm,
                          amount: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select
                        value={editingPaymentForm.currency}
                        onValueChange={(value) => setEditingPaymentForm({
                          ...editingPaymentForm,
                          currency: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingPaymentForm.allowCustomAmount || false}
                      onChange={(e) => setEditingPaymentForm({
                        ...editingPaymentForm,
                        allowCustomAmount: e.target.checked
                      })}
                    />
                    <Label>Allow custom amount</Label>
                  </div>

                  {editingPaymentForm.allowCustomAmount && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Minimum Amount</Label>
                        <Input
                          type="number"
                          value={editingPaymentForm.minAmount || ''}
                          onChange={(e) => setEditingPaymentForm({
                            ...editingPaymentForm,
                            minAmount: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label>Maximum Amount</Label>
                        <Input
                          type="number"
                          value={editingPaymentForm.maxAmount || ''}
                          onChange={(e) => setEditingPaymentForm({
                            ...editingPaymentForm,
                            maxAmount: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={savePaymentForm}>
                      Save Payment Form
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPaymentForm(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">$12,450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Monthly Growth</p>
                      <p className="text-2xl font-bold">+23%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Paid Users</p>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Churn Rate</p>
                      <p className="text-2xl font-bold">2.1%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatPrice(plan.price, plan.currency)}/{plan.interval}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$3,450</p>
                        <p className="text-sm text-gray-600">23 subscribers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 