import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Building, 
  Package, 
  Truck, 
  BarChart3,
  Globe,
  Zap,
  Target,
  Upload,
  Settings,
  Sparkles,
  Play,
  X
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (userData: any) => void;
  onSkip: () => void;
  onClose: () => void;
}

export function OnboardingWizard({ onComplete, onSkip, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    role: '',
    businessType: '',
    shippingVolume: '',
    primaryGoals: [] as string[],
    integrations: [] as string[],
    originZip: '',
    sampleData: false,
    notifications: true,
    setupComplete: false
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Labl IQ',
      description: "Let's set up your shipping intelligence platform",
      icon: Sparkles
    },
    {
      id: 'role',
      title: 'Tell us about yourself',
      description: 'This helps us customize your experience',
      icon: User
    },
    {
      id: 'business',
      title: 'Business Information',
      description: 'Help us understand your shipping needs',
      icon: Building
    },
    {
      id: 'goals',
      title: 'Your Goals',
      description: 'What do you want to achieve?',
      icon: Target
    },
    {
      id: 'integrations',
      title: 'Connect Your Tools',
      description: 'Integrate with your existing systems',
      icon: Globe
    },
    {
      id: 'configuration',
      title: 'Initial Configuration',
      description: 'Set up your shipping defaults',
      icon: Settings
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your account is ready to go',
      icon: CheckCircle
    }
  ];

  const businessTypes = [
    { value: 'ecommerce', label: 'E-commerce Store', description: 'Online retail business' },
    { value: '3pl', label: '3PL/Fulfillment', description: 'Third-party logistics provider' },
    { value: 'manufacturer', label: 'Manufacturer', description: 'Product manufacturing company' },
    { value: 'distributor', label: 'Distributor', description: 'Product distribution business' },
    { value: 'consultant', label: 'Shipping Consultant', description: 'Consulting services' },
    { value: 'other', label: 'Other', description: 'Other business type' }
  ];

  const shippingVolumes = [
    { value: 'low', label: '1-100 shipments/month', description: 'Small volume' },
    { value: 'medium', label: '100-1,000 shipments/month', description: 'Medium volume' },
    { value: 'high', label: '1,000-10,000 shipments/month', description: 'High volume' },
    { value: 'enterprise', label: '10,000+ shipments/month', description: 'Enterprise volume' }
  ];

  const goalOptions = [
    { id: 'cost-reduction', label: 'Reduce Shipping Costs', description: 'Lower shipping expenses' },
    { id: 'speed-optimization', label: 'Improve Delivery Speed', description: 'Faster delivery times' },
    { id: 'carrier-optimization', label: 'Optimize Carrier Selection', description: 'Better carrier choices' },
    { id: 'automation', label: 'Automate Processes', description: 'Reduce manual work' },
    { id: 'analytics', label: 'Better Analytics', description: 'Deeper shipping insights' },
    { id: 'client-service', label: 'Client Services', description: 'Serve clients better (consultants)' }
  ];

  const integrationOptions = [
    { id: 'shopify', label: 'Shopify', description: 'E-commerce platform' },
    { id: 'woocommerce', label: 'WooCommerce', description: 'WordPress e-commerce' },
    { id: 'magento', label: 'Magento', description: 'E-commerce platform' },
    { id: 'shipstation', label: 'ShipStation', description: 'Shipping software' },
    { id: 'easypost', label: 'EasyPost', description: 'Shipping API' },
    { id: 'quickbooks', label: 'QuickBooks', description: 'Accounting software' },
    { id: 'slack', label: 'Slack', description: 'Team communication' },
    { id: 'none', label: 'No integrations needed', description: 'Set up later' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const completeUserData = {
      ...userData,
      setupComplete: true,
      completedAt: new Date().toISOString()
    };
    onComplete(completeUserData);
  };

  const updateUserData = (field: string, value: any) => {
    console.log('updateUserData called:', field, value);
    setUserData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('Updated userData:', newData);
      return newData;
    });
  };

  const toggleArrayValue = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? prev[field as keyof typeof prev].filter((item: string) => item !== value)
        : [...prev[field as keyof typeof prev], value]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userData.role !== '';
      case 2: return userData.businessType !== '' && userData.shippingVolume !== '';
      case 3: return userData.primaryGoals.length > 0;
      case 4: return userData.integrations.length > 0;
      case 5: return userData.originZip !== '';
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-black mb-3">Welcome to Labl IQ</h2>
              <p className="text-gray-600 text-lg">
                Your shipping intelligence platform for merchants and consultants.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-sm">Smart Analysis</h4>
                <p className="text-xs text-gray-600 mt-1">AI-powered insights</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-sm">Automation</h4>
                <p className="text-xs text-gray-600 mt-1">Streamlined workflows</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-sm">Optimization</h4>
                <p className="text-xs text-gray-600 mt-1">Cost reduction</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              This setup will take about 3 minutes and will customize Labl IQ for your specific needs.
            </p>
          </div>
        );

      case 1: // Role Selection
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-black mb-2">What best describes your role?</h2>
              <p className="text-gray-600">This helps us customize your dashboard and features</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => updateUserData('role', 'merchant')}
                className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                  userData.role === 'merchant' 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black">Merchant / 3PL</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      I ship products and want to optimize my shipping operations and costs
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge variant="secondary" className="text-xs">Operations Focus</Badge>
                      <Badge variant="secondary" className="text-xs">Cost Optimization</Badge>
                    </div>
                  </div>
                  {userData.role === 'merchant' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() => updateUserData('role', 'analyst')}
                className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                  userData.role === 'analyst' 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black">Shipping Consultant / Analyst</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      I analyze shipping data for clients and provide optimization recommendations
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge variant="secondary" className="text-xs">Client Services</Badge>
                      <Badge variant="secondary" className="text-xs">Data Analysis</Badge>
                    </div>
                  </div>
                  {userData.role === 'analyst' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        );

      case 2: // Business Information
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-black mb-2">Tell us about your business</h2>
              <p className="text-gray-600">This helps us provide relevant features and benchmarks</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="business-type" className="text-sm font-medium">Business Type</Label>
                <Select value={userData.businessType} onValueChange={(value) => updateUserData('businessType', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]" style={{ zIndex: 200 }}>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userData.businessType && (
                  <p className="text-xs text-green-600 mt-1">✓ Selected: {businessTypes.find(t => t.value === userData.businessType)?.label}</p>
                )}
              </div>

              <div>
                <Label htmlFor="shipping-volume" className="text-sm font-medium">Monthly Shipping Volume</Label>
                <Select value={userData.shippingVolume} onValueChange={(value) => updateUserData('shippingVolume', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your monthly volume" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]" style={{ zIndex: 200 }}>
                    {shippingVolumes.map((volume) => (
                      <SelectItem key={volume.value} value={volume.value}>
                        {volume.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userData.shippingVolume && (
                  <p className="text-xs text-green-600 mt-1">✓ Selected: {shippingVolumes.find(v => v.value === userData.shippingVolume)?.label}</p>
                )}
              </div>

              {/* Debug information */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Debug: Business Type: {userData.businessType || 'none'}, Shipping Volume: {userData.shippingVolume || 'none'}
              </div>
            </div>
          </div>
        );

      case 3: // Goals
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-black mb-2">What are your primary goals?</h2>
              <p className="text-gray-600">Select all that apply - we'll prioritize these features</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {goalOptions
                .filter(goal => userData.role === 'analyst' ? true : goal.id !== 'client-service')
                .map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleArrayValue('primaryGoals', goal.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    userData.primaryGoals.includes(goal.id)
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-black">{goal.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                    {userData.primaryGoals.includes(goal.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Selected: {userData.primaryGoals.length} goal{userData.primaryGoals.length !== 1 ? 's' : ''}
            </p>
          </div>
        );

      case 4: // Integrations
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-black mb-2">Connect your tools</h2>
              <p className="text-gray-600">Select integrations to set up now (you can add more later)</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {integrationOptions.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => toggleArrayValue('integrations', integration.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    userData.integrations.includes(integration.id)
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-black">{integration.label}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                    {userData.integrations.includes(integration.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5: // Configuration
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-black mb-2">Initial configuration</h2>
              <p className="text-gray-600">Set up your shipping defaults</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="origin-zip" className="text-sm font-medium">Primary Origin ZIP Code</Label>
                <Input
                  id="origin-zip"
                  value={userData.originZip}
                  onChange={(e) => updateUserData('originZip', e.target.value)}
                  placeholder="90210"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used as the default origin for rate calculations
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="sample-data"
                    checked={userData.sampleData}
                    onCheckedChange={(checked) => updateUserData('sampleData', checked)}
                  />
                  <div>
                    <Label htmlFor="sample-data" className="text-sm font-medium">Load sample data</Label>
                    <p className="text-xs text-gray-600">
                      Include sample shipping data to explore features immediately
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="notifications"
                    checked={userData.notifications}
                    onCheckedChange={(checked) => updateUserData('notifications', checked)}
                  />
                  <div>
                    <Label htmlFor="notifications" className="text-sm font-medium">Enable notifications</Label>
                    <p className="text-xs text-gray-600">
                      Get alerts for optimization opportunities and system updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Complete
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-black mb-3">You're all set!</h2>
              <p className="text-gray-600 text-lg">
                Your Labl IQ account has been configured for your needs.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-left">
              <h3 className="font-medium text-black mb-4">What's next?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm">Upload your shipping data or explore with sample data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm">Review AI-generated optimization recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-sm">Set up automated alerts and reports</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleComplete}
              className="bg-black text-white hover:bg-gray-800 w-full"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Launch Labl IQ
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 70 }}>
      <Card className="w-full max-w-2xl bg-white shadow-2xl relative" style={{ zIndex: 71 }}>
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-black w-8 h-8 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z" fill="white" />
                    <path d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z" fill="white" />
                  </g>
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onSkip} className="text-gray-500">
                Skip Setup
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Progress value={progress} className="w-full h-2 mb-6" />
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-gray-600" })}
            </div>
            <div className="text-left">
              <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </CardContent>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
                >
                  <span>Complete Setup</span>
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}