import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Star,
  Clock,
  Users,
  Truck,
  BarChart3,
  Upload,
  Settings,
  Globe,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Play,
  Download,
  Lightbulb,
  AlertTriangle,
  Rocket,
  ChevronRight,
  User,
  Building,
  Briefcase
} from 'lucide-react';

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [userType, setUserType] = useState<'merchant' | 'analyst' | 'all'>('all');

  // Comprehensive knowledge base content organized by user needs
  const knowledgeContent = {
    'getting-started': {
      title: 'Getting Started',
      icon: Rocket,
      description: 'Essential guides to get you up and running quickly',
      articles: [
        {
          id: 'setup-account',
          title: 'Setting Up Your Account',
          description: 'Complete account setup and configuration for optimal results',
          type: 'guide',
          duration: '5 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'beginner',
          sections: [
            'Account creation and verification',
            'Initial configuration wizard',
            'Connecting your first integration',
            'Understanding your dashboard'
          ]
        },
        {
          id: 'first-analysis',
          title: 'Running Your First Analysis',
          description: 'Step-by-step guide to uploading data and getting insights',
          type: 'tutorial',
          duration: '10 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'beginner',
          sections: [
            'Preparing your shipping data',
            'Upload process and validation',
            'Understanding analysis results',
            'Implementing recommendations'
          ]
        },
        {
          id: 'role-differences',
          title: 'Merchant vs Analyst: Understanding Your Role',
          description: 'Key differences between user types and feature access',
          type: 'overview',
          duration: '3 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'beginner',
          sections: [
            'Merchant/3PL workflow overview',
            'Rate analyst capabilities',
            'Role-specific features',
            'Switching between views'
          ]
        }
      ]
    },
    'data-analysis': {
      title: 'Data Analysis',
      icon: BarChart3,
      description: 'Deep dive into shipping data analysis and optimization',
      articles: [
        {
          id: 'data-preparation',
          title: 'Preparing Your Shipping Data',
          description: 'Best practices for data formatting and validation',
          type: 'guide',
          duration: '8 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'intermediate',
          sections: [
            'Required data fields',
            'Data formatting standards',
            'Common data issues',
            'Quality validation tips'
          ]
        },
        {
          id: 'bulk-analysis',
          title: 'Bulk Analysis for Consultants',
          description: 'Processing multiple client datasets efficiently',
          type: 'tutorial',
          duration: '15 min',
          userTypes: ['analyst'],
          difficulty: 'advanced',
          sections: [
            'Multi-client data management',
            'Batch processing workflows',
            'Comparative analysis techniques',
            'Client reporting automation'
          ]
        },
        {
          id: 'optimization-strategies',
          title: 'Understanding Optimization Strategies',
          description: 'How the AI identifies and recommends cost savings',
          type: 'explanation',
          duration: '12 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'intermediate',
          sections: [
            'Zone skipping optimization',
            'Carrier consolidation strategies',
            'Service level optimization',
            'Dimensional weight optimization'
          ]
        }
      ]
    },
    'integrations': {
      title: 'Integrations',
      icon: Globe,
      description: 'Connect with carriers, platforms, and business tools',
      articles: [
        {
          id: 'carrier-setup',
          title: 'Setting Up Carrier Integrations',
          description: 'Connect with UPS, FedEx, USPS, Amazon Shipping and more',
          type: 'guide',
          duration: '10 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'intermediate',
          sections: [
            'API key requirements',
            'Authentication setup',
            'Testing connections',
            'Rate comparison configuration'
          ]
        },
        {
          id: 'ecommerce-platforms',
          title: 'E-commerce Platform Integration',
          description: 'Connect with Shopify, WooCommerce, Magento, and others',
          type: 'tutorial',
          duration: '15 min',
          userTypes: ['merchant'],
          difficulty: 'intermediate',
          sections: [
            'Platform-specific setup',
            'Order data synchronization',
            'Automated analysis triggers',
            'Real-time rate optimization'
          ]
        },
        {
          id: 'api-access',
          title: 'API Access and Documentation',
          description: 'Integrate labl IQ into your existing systems',
          type: 'reference',
          duration: '20 min',
          userTypes: ['analyst'],
          difficulty: 'advanced',
          sections: [
            'API authentication',
            'Available endpoints',
            'Rate limiting and quotas',
            'Webhook configuration'
          ]
        }
      ]
    },
    'workflows': {
      title: 'Workflows',
      icon: Zap,
      description: 'Optimize your processes and automate routine tasks',
      articles: [
        {
          id: 'merchant-workflow',
          title: 'Merchant Operations Workflow',
          description: 'From shipment planning to performance monitoring',
          type: 'workflow',
          duration: '12 min',
          userTypes: ['merchant'],
          difficulty: 'intermediate',
          sections: [
            'Daily shipping operations',
            'Weekly performance reviews',
            'Monthly optimization cycles',
            'Quarterly strategy planning'
          ]
        },
        {
          id: 'analyst-workflow',
          title: 'Consultant Analysis Workflow',
          description: 'Client onboarding to final recommendations',
          type: 'workflow',
          duration: '18 min',
          userTypes: ['analyst'],
          difficulty: 'advanced',
          sections: [
            'Client data collection',
            'Initial analysis and findings',
            'Strategy development',
            'Presentation and implementation'
          ]
        },
        {
          id: 'automation-setup',
          title: 'Setting Up Automation',
          description: 'Configure automated alerts, reports, and optimizations',
          type: 'guide',
          duration: '10 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'intermediate',
          sections: [
            'Automated data processing',
            'Alert configuration',
            'Scheduled reporting',
            'Integration triggers'
          ]
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: AlertTriangle,
      description: 'Solve common issues and optimize performance',
      articles: [
        {
          id: 'data-upload-issues',
          title: 'Data Upload Troubleshooting',
          description: 'Resolve common file upload and validation errors',
          type: 'troubleshooting',
          duration: '8 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'beginner',
          sections: [
            'File format requirements',
            'Common validation errors',
            'Data mapping issues',
            'Performance optimization'
          ]
        },
        {
          id: 'integration-problems',
          title: 'Integration Connection Issues',
          description: 'Fix carrier API and platform connection problems',
          type: 'troubleshooting',
          duration: '12 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'intermediate',
          sections: [
            'API key validation',
            'Connection timeout issues',
            'Rate limiting problems',
            'Data synchronization errors'
          ]
        },
        {
          id: 'performance-optimization',
          title: 'Platform Performance Optimization',
          description: 'Improve analysis speed and system responsiveness',
          type: 'guide',
          duration: '15 min',
          userTypes: ['analyst'],
          difficulty: 'advanced',
          sections: [
            'Data preprocessing tips',
            'Batch size optimization',
            'Memory management',
            'Network optimization'
          ]
        }
      ]
    },
    'best-practices': {
      title: 'Best Practices',
      icon: Target,
      description: 'Industry best practices and optimization strategies',
      articles: [
        {
          id: 'data-quality',
          title: 'Maintaining Data Quality',
          description: 'Ensure accurate analysis with high-quality shipping data',
          type: 'best-practice',
          duration: '10 min',
          userTypes: ['merchant', 'analyst'],
          difficulty: 'intermediate',
          sections: [
            'Data validation protocols',
            'Regular quality audits',
            'Error detection methods',
            'Continuous improvement'
          ]
        },
        {
          id: 'cost-optimization',
          title: 'Advanced Cost Optimization Techniques',
          description: 'Maximize savings through strategic shipping decisions',
          type: 'strategy',
          duration: '20 min',
          userTypes: ['analyst'],
          difficulty: 'advanced',
          sections: [
            'Multi-variable optimization',
            'Seasonal adjustment strategies',
            'Volume-based negotiations',
            'Long-term planning'
          ]
        },
        {
          id: 'client-management',
          title: 'Client Relationship Management',
          description: 'Best practices for analysts working with clients',
          type: 'best-practice',
          duration: '15 min',
          userTypes: ['analyst'],
          difficulty: 'intermediate',
          sections: [
            'Initial client consultations',
            'Progress communication',
            'Results presentation',
            'Long-term partnerships'
          ]
        }
      ]
    }
  };

  // Filter content based on search and user type
  const getFilteredContent = () => {
    const categories = Object.entries(knowledgeContent);
    
    return categories.map(([key, category]) => ({
      key,
      ...category,
      articles: category.articles.filter(article => {
        const matchesSearch = searchQuery === '' || 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesUserType = userType === 'all' || 
          article.userTypes.includes(userType);
        
        return matchesSearch && matchesUserType;
      })
    })).filter(category => category.articles.length > 0);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'tutorial': return Play;
      case 'video': return Video;
      case 'troubleshooting': return AlertTriangle;
      case 'workflow': return Zap;
      case 'best-practice': return Target;
      case 'reference': return FileText;
      case 'overview': return User;
      case 'explanation': return Lightbulb;
      case 'strategy': return Briefcase;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeColor = (userTypes: string[]) => {
    if (userTypes.includes('merchant') && userTypes.includes('analyst')) {
      return 'bg-gray-100 text-gray-800';
    } else if (userTypes.includes('merchant')) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black">Knowledge Base</h1>
          <p className="text-lg text-gray-600">
            Comprehensive guides, tutorials, and best practices for shipping optimization
          </p>
        </div>
        
        {/* User Type Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUserType('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              userType === 'all' 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setUserType('merchant')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              userType === 'merchant' 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Merchants
          </button>
          <button
            onClick={() => setUserType('analyst')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              userType === 'analyst' 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Analysts
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for guides, tutorials, or specific topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-black">Quick Start</h3>
                <p className="text-sm text-gray-600">Get up and running in 5 minutes</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Start Tutorial
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-black">Video Tutorials</h3>
                <p className="text-sm text-gray-600">Watch and learn step-by-step</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Browse Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-black">Contact Support</h3>
                <p className="text-sm text-gray-600">Get help from our experts</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Get Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Content Categories */}
      <div className="space-y-8">
        {filteredContent.map((category) => {
          const CategoryIcon = category.icon;
          
          return (
            <Card key={category.key} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CategoryIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xl">{category.title}</span>
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {category.articles.map((article) => {
                    const TypeIcon = getTypeIcon(article.type);
                    
                    return (
                      <div key={article.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <TypeIcon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-black">{article.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getDifficultyColor(article.difficulty)}>
                                    {article.difficulty}
                                  </Badge>
                                  <Badge className={getUserTypeColor(article.userTypes)}>
                                    {article.userTypes.includes('merchant') && article.userTypes.includes('analyst') 
                                      ? 'All Users'
                                      : article.userTypes.includes('merchant') 
                                        ? 'Merchants'
                                        : 'Analysts'
                                    }
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                              
                              {/* Article Sections Preview */}
                              <div className="space-y-1 mb-3">
                                {article.sections.slice(0, 3).map((section, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3" />
                                    <span>{section}</span>
                                  </div>
                                ))}
                                {article.sections.length > 3 && (
                                  <div className="text-xs text-gray-400 ml-5">
                                    +{article.sections.length - 3} more sections...
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{article.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1 capitalize">
                                  <span>{article.type}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Read Guide
                            </Button>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Missing UX Features Alert */}
      <Card className="shadow-sm border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Lightbulb className="w-5 h-5" />
            <span>UX Enhancement Opportunities</span>
          </CardTitle>
          <CardDescription className="text-amber-700">
            Key features that would enhance the user experience for both merchants and analysts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-amber-800">Missing for Merchants/3PLs:</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Interactive onboarding wizard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Real-time shipment tracking dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Automated alert system for cost spikes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Mobile-responsive interface</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Bulk action capabilities</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-amber-800">Missing for Analysts/Consultants:</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Client portal for sharing results</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Custom report builder</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Presentation mode for client meetings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>White-label branding options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Advanced filtering and search</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* No Results State */}
      {filteredContent.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-black mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse all categories
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setUserType('all'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}