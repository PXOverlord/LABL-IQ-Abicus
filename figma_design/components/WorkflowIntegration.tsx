import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ArrowRight, 
  Upload, 
  Activity, 
  FileText, 
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function WorkflowIntegration() {
  const [activeWorkflow, setActiveWorkflow] = useState<'merchant' | 'analyst'>('merchant');

  const merchantWorkflow = [
    {
      id: 'upload',
      title: 'Upload Shipment Data',
      description: 'Import your shipping data from CSV, Excel, or API integration',
      icon: Upload,
      status: 'completed',
      metrics: { files: 12, records: '45K+', time: '2 min' },
      actions: ['Upload New File', 'Schedule Import', 'View Data']
    },
    {
      id: 'analyze',
      title: 'Rate Analysis & Optimization',
      description: 'AI-powered analysis identifies cost savings opportunities',
      icon: Activity,
      status: 'in-progress',
      metrics: { savings: '$23K', optimization: '18.7%', recommendations: 47 },
      actions: ['View Analysis', 'Apply Recommendations', 'Export Results']
    },
    {
      id: 'implement',
      title: 'Implement Optimizations',
      description: 'Apply recommended changes to your shipping operations',
      icon: Target,
      status: 'pending',
      metrics: { applied: '67%', pending: 23, saved: '$15K' },
      actions: ['Apply Changes', 'Review Impact', 'Schedule Implementation']
    },
    {
      id: 'monitor',
      title: 'Monitor Performance',
      description: 'Track the impact of optimizations on your shipping costs',
      icon: TrendingUp,
      status: 'active',
      metrics: { performance: '+22%', costs: '-$8.4K', efficiency: '94%' },
      actions: ['View Dashboard', 'Set Alerts', 'Generate Report']
    }
  ];

  const analystWorkflow = [
    {
      id: 'client-data',
      title: 'Client Data Intake',
      description: 'Collect and validate client shipping data for analysis',
      icon: Users,
      status: 'completed',
      metrics: { clients: 8, datasets: 23, volume: '180K records' },
      actions: ['Add Client', 'Validate Data', 'Client Portal']
    },
    {
      id: 'bulk-analysis',
      title: 'Bulk Rate Analysis',
      description: 'Process multiple client datasets for optimization opportunities',
      icon: Zap,
      status: 'in-progress',
      metrics: { processed: '78%', savings: '$87K', clients: 6 },
      actions: ['Run Analysis', 'Compare Scenarios', 'Generate Insights']
    },
    {
      id: 'recommendations',
      title: 'Strategic Recommendations',
      description: 'Develop customized optimization strategies for each client',
      icon: Target,
      status: 'active',
      metrics: { strategies: 12, potential: '$124K', roi: '340%' },
      actions: ['Create Strategy', 'Review Recommendations', 'Client Presentation']
    },
    {
      id: 'reporting',
      title: 'Client Reporting & Delivery',
      description: 'Generate professional reports and present findings to clients',
      icon: FileText,
      status: 'scheduled',
      metrics: { reports: 8, presentations: 4, delivered: '$67K' },
      actions: ['Generate Report', 'Schedule Presentation', 'Client Follow-up']
    }
  ];

  const getWorkflowData = () => {
    return activeWorkflow === 'merchant' ? merchantWorkflow : analystWorkflow;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Activity;
      case 'active': return Play;
      case 'pending': return Clock;
      case 'scheduled': return Calendar;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-8">
      {/* Workflow Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-black">Workflow Integration</h2>
          <p className="text-gray-600">End-to-end shipping optimization workflows</p>
        </div>
        
        {/* Workflow Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveWorkflow('merchant')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeWorkflow === 'merchant' 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Merchant Workflow
          </button>
          <button
            onClick={() => setActiveWorkflow('analyst')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeWorkflow === 'analyst' 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Analyst Workflow
          </button>
        </div>
      </div>

      {/* Workflow Progress Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{activeWorkflow === 'merchant' ? 'Merchant' : 'Analyst'} Workflow Progress</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                {getWorkflowData().filter(step => step.status === 'completed').length} Completed
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {getWorkflowData().filter(step => step.status === 'in-progress').length} In Progress
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {getWorkflowData().map((step, index) => {
              const StatusIcon = getStatusIcon(step.status);
              const isLastStep = index === getWorkflowData().length - 1;
              
              return (
                <div key={step.id} className="relative">
                  {/* Workflow Step */}
                  <div className="flex items-start space-x-4">
                    {/* Status Icon & Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-100' :
                        step.status === 'in-progress' ? 'bg-blue-100' :
                        step.status === 'active' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'in-progress' ? 'text-blue-600' :
                          step.status === 'active' ? 'text-purple-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      
                      {/* Connecting Line */}
                      {!isLastStep && (
                        <div className="w-px h-16 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-black">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        
                        <Badge className={getStatusColor(step.status)}>
                          {step.status.replace('-', ' ')}
                        </Badge>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 mt-3 mb-4">
                        {Object.entries(step.metrics).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-black">{value}</div>
                            <div className="text-xs text-gray-600 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {step.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={actionIndex === 0 ? 'default' : 'outline'}
                            size="sm"
                            className={actionIndex === 0 ? 'bg-black text-white hover:bg-gray-800' : ''}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Settings */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Workflow Automation</span>
            </CardTitle>
            <CardDescription>
              Configure automated triggers and actions for your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm text-black">Auto-process uploads</div>
                  <div className="text-xs text-gray-600">Automatically analyze new data uploads</div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm text-black">Scheduled reports</div>
                  <div className="text-xs text-gray-600">Generate and send reports automatically</div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm text-black">Alert notifications</div>
                  <div className="text-xs text-gray-600">Send alerts for optimization opportunities</div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Workflow Performance</span>
            </CardTitle>
            <CardDescription>
              Track the efficiency and impact of your workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing Speed</span>
                <div className="flex items-center space-x-2">
                  <Progress value={87} className="w-20" />
                  <span className="text-sm font-medium text-black">87%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accuracy Rate</span>
                <div className="flex items-center space-x-2">
                  <Progress value={94} className="w-20" />
                  <span className="text-sm font-medium text-black">94%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <Progress value={96} className="w-20" />
                  <span className="text-sm font-medium text-black">96%</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Cost Savings</span>
                  <span className="font-medium text-green-600">$847K</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Average ROI</span>
                  <span className="font-medium text-green-600">340%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}