import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Users, 
  Truck, 
  BarChart3,
  Smartphone,
  Zap,
  Target,
  MessageSquare,
  Shield,
  Lightbulb,
  TrendingUp,
  Settings,
  FileText,
  Globe,
  Search,
  Bell,
  Star,
  Eye,
  Workflow,
  Palette,
  BookOpen,
  ArrowRight,
  Plus
} from 'lucide-react';

export function UXGapAnalysis() {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Comprehensive UX gap analysis
  const uxGaps = {
    'onboarding': {
      title: 'User Onboarding',
      description: 'First-time user experience and guided setup',
      currentScore: 30,
      targetScore: 90,
      gaps: [
        {
          id: 'welcome-wizard',
          title: 'Interactive Welcome Wizard',
          description: 'Step-by-step setup guide for new users',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Account setup', 'Integration configuration', 'First analysis tutorial']
        },
        {
          id: 'role-selection',
          title: 'User Role Selection & Customization',
          description: 'Allow users to select their role and customize their experience',
          priority: 'high',
          effort: 'low',
          impact: 'high',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Role selection modal', 'Feature customization', 'Dashboard personalization']
        },
        {
          id: 'sample-data',
          title: 'Sample Data & Demo Mode',
          description: 'Pre-loaded sample data for exploration without real data',
          priority: 'medium',
          effort: 'low',
          impact: 'medium',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Sample datasets', 'Demo analysis results', 'Interactive tutorials']
        }
      ]
    },
    'navigation': {
      title: 'Navigation & Discovery',
      description: 'Finding features and navigating the platform efficiently',
      currentScore: 70,
      targetScore: 95,
      gaps: [
        {
          id: 'global-search',
          title: 'Global Search & Command Palette',
          description: 'Search across all data, features, and content',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          userTypes: ['merchant', 'analyst'],
          status: 'partial',
          components: ['Smart search', 'Keyboard shortcuts', 'Quick actions']
        },
        {
          id: 'breadcrumbs',
          title: 'Contextual Breadcrumbs',
          description: 'Clear navigation path and context awareness',
          priority: 'medium',
          effort: 'low',
          impact: 'medium',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Dynamic breadcrumbs', 'Context indicators', 'Quick navigation']
        },
        {
          id: 'favorites',
          title: 'Bookmarks & Favorites',
          description: 'Save frequently accessed analyses and reports',
          priority: 'medium',
          effort: 'medium',
          impact: 'medium',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Bookmark system', 'Quick access panel', 'Recent items']
        }
      ]
    },
    'collaboration': {
      title: 'Collaboration & Sharing',
      description: 'Working with teams and sharing insights',
      currentScore: 20,
      targetScore: 85,
      gaps: [
        {
          id: 'client-portal',
          title: 'Client Portal & Sharing',
          description: 'Secure portal for analysts to share results with clients',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          userTypes: ['analyst'],
          status: 'missing',
          components: ['Client accounts', 'Secure sharing', 'Access controls', 'Presentation mode']
        },
        {
          id: 'team-collaboration',
          title: 'Team Collaboration Features',
          description: 'Comments, annotations, and team workflows',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Comments system', 'Annotations', 'Team notifications', 'Shared workspaces']
        },
        {
          id: 'export-sharing',
          title: 'Advanced Export & Sharing Options',
          description: 'Multiple export formats and sharing methods',
          priority: 'medium',
          effort: 'medium',
          impact: 'medium',
          userTypes: ['merchant', 'analyst'],
          status: 'partial',
          components: ['PDF reports', 'Excel exports', 'Link sharing', 'Embedded dashboards']
        }
      ]
    },
    'mobile': {
      title: 'Mobile Experience',
      description: 'Mobile-responsive design and mobile-specific features',
      currentScore: 40,
      targetScore: 80,
      gaps: [
        {
          id: 'mobile-app',
          title: 'Native Mobile Application',
          description: 'Dedicated mobile app for key functions',
          priority: 'medium',
          effort: 'high',
          impact: 'high',
          userTypes: ['merchant'],
          status: 'missing',
          components: ['iOS app', 'Android app', 'Push notifications', 'Offline capabilities']
        },
        {
          id: 'responsive-design',
          title: 'Fully Responsive Interface',
          description: 'Optimized experience across all device sizes',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          userTypes: ['merchant', 'analyst'],
          status: 'partial',
          components: ['Mobile navigation', 'Touch-friendly controls', 'Responsive charts']
        },
        {
          id: 'mobile-notifications',
          title: 'Mobile Push Notifications',
          description: 'Real-time alerts and updates on mobile devices',
          priority: 'medium',
          effort: 'medium',
          impact: 'medium',
          userTypes: ['merchant'],
          status: 'missing',
          components: ['Push notifications', 'Alert customization', 'Notification center']
        }
      ]
    },
    'automation': {
      title: 'Automation & Intelligence',
      description: 'Smart features and automated workflows',
      currentScore: 50,
      targetScore: 90,
      gaps: [
        {
          id: 'smart-alerts',
          title: 'Intelligent Alert System',
          description: 'AI-powered alerts for anomalies and opportunities',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          userTypes: ['merchant', 'analyst'],
          status: 'partial',
          components: ['Anomaly detection', 'Predictive alerts', 'Custom thresholds']
        },
        {
          id: 'auto-optimization',
          title: 'Automated Optimization Suggestions',
          description: 'Continuous optimization recommendations',
          priority: 'high',
          effort: 'high',
          impact: 'high',
          userTypes: ['merchant'],
          status: 'partial',
          components: ['Auto-suggestions', 'Implementation tracking', 'ROI measurement']
        },
        {
          id: 'workflow-automation',
          title: 'Workflow Automation',
          description: 'Automated data processing and report generation',
          priority: 'medium',
          effort: 'high',
          impact: 'medium',
          userTypes: ['analyst'],
          status: 'missing',
          components: ['Workflow builder', 'Trigger conditions', 'Automated actions']
        }
      ]
    },
    'personalization': {
      title: 'Personalization & Customization',
      description: 'Tailored experience based on user preferences',
      currentScore: 35,
      targetScore: 85,
      gaps: [
        {
          id: 'custom-dashboards',
          title: 'Customizable Dashboards',
          description: 'User-configurable dashboard layouts and widgets',
          priority: 'medium',
          effort: 'high',
          impact: 'medium',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['Drag-drop interface', 'Widget library', 'Layout templates']
        },
        {
          id: 'saved-views',
          title: 'Saved Views & Filters',
          description: 'Save and share custom data views and filters',
          priority: 'medium',
          effort: 'medium',
          impact: 'medium',
          userTypes: ['merchant', 'analyst'],
          status: 'missing',
          components: ['View builder', 'Filter presets', 'Sharing options']
        },
        {
          id: 'white-label',
          title: 'White-label Branding',
          description: 'Custom branding for analyst client presentations',
          priority: 'medium',
          effort: 'medium',
          impact: 'high',
          userTypes: ['analyst'],
          status: 'missing',
          components: ['Brand customization', 'Logo upload', 'Color schemes']
        }
      ]
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missing': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'missing': return AlertTriangle;
      case 'partial': return Clock;
      case 'completed': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const filteredGaps = Object.entries(uxGaps).map(([key, category]) => ({
    key,
    ...category,
    gaps: category.gaps.filter(gap => 
      selectedPriority === 'all' || gap.priority === selectedPriority
    )
  })).filter(category => category.gaps.length > 0);

  const getTotalGaps = () => {
    return Object.values(uxGaps).reduce((total, category) => total + category.gaps.length, 0);
  };

  const getCompletedGaps = () => {
    return Object.values(uxGaps).reduce((total, category) => 
      total + category.gaps.filter(gap => gap.status === 'completed').length, 0
    );
  };

  const getOverallScore = () => {
    const totalScore = Object.values(uxGaps).reduce((total, category) => total + category.currentScore, 0);
    return Math.round(totalScore / Object.keys(uxGaps).length);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black">UX Gap Analysis</h2>
          <p className="text-gray-600">Comprehensive analysis of missing UX features and opportunities</p>
        </div>
        
        {/* Priority Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <button
              key={priority}
              onClick={() => setSelectedPriority(priority as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                selectedPriority === priority 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">{getOverallScore()}%</div>
                <div className="text-sm text-gray-600">Overall UX Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">{getTotalGaps() - getCompletedGaps()}</div>
                <div className="text-sm text-gray-600">Missing Features</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">
                  {Object.values(uxGaps).reduce((total, category) => 
                    total + category.gaps.filter(gap => gap.status === 'partial').length, 0
                  )}
                </div>
                <div className="text-sm text-gray-600">Partial Features</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">{getCompletedGaps()}</div>
                <div className="text-sm text-gray-600">Completed Features</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UX Categories */}
      <div className="space-y-6">
        {filteredGaps.map((category) => (
          <Card key={category.key} className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-black">{category.currentScore}%</div>
                  <div className="text-sm text-gray-600">Current Score</div>
                  <Progress value={category.currentScore} className="w-20 mt-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.gaps.map((gap) => {
                  const StatusIcon = getStatusIcon(gap.status);
                  
                  return (
                    <div key={gap.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            gap.status === 'missing' ? 'bg-red-100' :
                            gap.status === 'partial' ? 'bg-amber-100' : 'bg-green-100'
                          }`}>
                            <StatusIcon className={`w-4 h-4 ${
                              gap.status === 'missing' ? 'text-red-600' :
                              gap.status === 'partial' ? 'text-amber-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-black mb-1">{gap.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                            
                            {/* Components */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {gap.components.map((component, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {component}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* User Types */}
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              <span>
                                {gap.userTypes.includes('merchant') && gap.userTypes.includes('analyst') 
                                  ? 'All Users'
                                  : gap.userTypes.includes('merchant') 
                                    ? 'Merchants/3PLs'
                                    : 'Rate Analysts'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(gap.priority)}>
                            {gap.priority}
                          </Badge>
                          <Badge className={getStatusColor(gap.status)}>
                            {gap.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Effort vs Impact */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span>Effort: <strong className="text-black">{gap.effort}</strong></span>
                          <span>Impact: <strong className="text-black">{gap.impact}</strong></span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredGaps.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-black mb-2">No gaps found</h3>
            <p className="text-gray-600 mb-4">
              No UX gaps match the selected priority filter
            </p>
            <Button variant="outline" onClick={() => setSelectedPriority('all')}>
              Show All Gaps
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}