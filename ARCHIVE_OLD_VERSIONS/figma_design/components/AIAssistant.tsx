import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Lightbulb,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  X,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface AIAssistantProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  userRole: 'merchant' | 'analyst';
  currentContext?: {
    page: string;
    hasData: boolean;
    recentAnalysis?: any;
    integrations?: string[];
  };
}

export function AIAssistant({ 
  isMinimized, 
  onToggleMinimize, 
  onClose, 
  userRole,
  currentContext 
}: AIAssistantProps) {
  const [currentConversation, setCurrentConversation] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedReports, setSuggestedReports] = useState<any[]>([]);
  const [activePrompts, setActivePrompts] = useState<any[]>([]);

  // Initialize AI suggestions based on context
  useEffect(() => {
    initializeAISuggestions();
  }, [currentContext, userRole]);

  const initializeAISuggestions = () => {
    const suggestions = generateContextualSuggestions();
    setSuggestedReports(suggestions.reports);
    setActivePrompts(suggestions.prompts);
    
    // Add welcome message if conversation is empty
    if (currentConversation.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        suggestions: suggestions.quickActions
      };
      setCurrentConversation([welcomeMessage]);
    }
  };

  const getWelcomeMessage = () => {
    if (userRole === 'merchant') {
      return `Hi! I'm your shipping optimization assistant. I noticed you're ${
        currentContext?.hasData ? 'reviewing your shipping data' : 'getting started'
      }. I can help you ${
        currentContext?.hasData 
          ? 'identify cost savings and generate insights' 
          : 'set up your first analysis and configure integrations'
      }. What would you like to explore?`;
    } else {
      return `Hello! I'm here to help with your client analysis workflow. ${
        currentContext?.hasData 
          ? "I can suggest reports and presentations for your current analysis." 
          : "Let's start by setting up your first client project."
      } How can I assist you today?`;
    }
  };

  const generateContextualSuggestions = () => {
    const basePrompts = [
      {
        id: 'cost-analysis',
        title: 'Cost Optimization Analysis',
        description: 'Identify immediate cost savings opportunities',
        questions: [
          'What shipping volumes do you typically handle monthly?',
          'Which shipping zones are most expensive for you?',
          'Are you using dimensional weight pricing optimally?'
        ],
        reportType: 'cost-optimization',
        priority: 'high'
      },
      {
        id: 'carrier-comparison',
        title: 'Carrier Performance Report',
        description: 'Compare carrier performance and costs',
        questions: [
          'Which carriers are you currently using?',
          'What service levels are most important to you?',
          'Do you have any carrier contracts or negotiated rates?'
        ],
        reportType: 'carrier-analysis',
        priority: 'medium'
      }
    ];

    const merchantPrompts = [
      {
        id: 'operational-efficiency',
        title: 'Operational Efficiency Review',
        description: 'Streamline your shipping operations',
        questions: [
          'How many shipments do you process daily?',
          'What percentage of shipments are expedited?',
          'Do you have issues with delivery delays?'
        ],
        reportType: 'operations',
        priority: 'high'
      },
      {
        id: 'automation-opportunities',
        title: 'Automation Opportunities',
        description: 'Identify processes that can be automated',
        questions: [
          'Are you manually selecting carriers for each shipment?',
          'Do you want to automate rate shopping?',
          'Would you like alerts for unusual shipping costs?'
        ],
        reportType: 'automation',
        priority: 'medium'
      }
    ];

    const analystPrompts = [
      {
        id: 'client-presentation',
        title: 'Client Presentation Builder',
        description: 'Create professional client presentations',
        questions: [
          'What industry is your client in?',
          'What are their main shipping pain points?',
          'What ROI targets are they looking for?'
        ],
        reportType: 'presentation',
        priority: 'high'
      },
      {
        id: 'competitive-analysis',
        title: 'Market Competitive Analysis',
        description: 'Show how client compares to industry benchmarks',
        questions: [
          'What is your client\'s annual shipping volume?',
          'Which regions do they ship to most?',
          'What\'s their current average cost per shipment?'
        ],
        reportType: 'competitive',
        priority: 'medium'
      }
    ];

    const reports = [
      {
        id: 'weekly-savings',
        title: 'Weekly Savings Summary',
        description: 'Automated weekly report of cost optimizations',
        estimatedSavings: '$2,400',
        timeToGenerate: '2 min',
        confidence: 'high'
      },
      {
        id: 'zone-optimization',
        title: 'Zone Skipping Opportunities',
        description: 'Identify zone skipping potential for major routes',
        estimatedSavings: '$8,100',
        timeToGenerate: '5 min',
        confidence: 'medium'
      },
      {
        id: 'carrier-negotiation',
        title: 'Carrier Negotiation Brief',
        description: 'Data-driven talking points for carrier negotiations',
        estimatedSavings: '$15,000',
        timeToGenerate: '10 min',
        confidence: 'high'
      }
    ];

    const quickActions = [
      'Analyze my recent shipping costs',
      'Show me optimization opportunities',
      'Generate a cost savings report',
      'Compare carrier performance',
      'Set up automated alerts'
    ];

    return {
      reports,
      prompts: userRole === 'merchant' ? [...basePrompts, ...merchantPrompts] : [...basePrompts, ...analystPrompts],
      quickActions
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setCurrentConversation(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setCurrentConversation(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    // Simple AI response logic - in real implementation, this would call your AI service
    const responses = {
      cost: {
        content: "I can help you identify cost savings! Based on your shipping patterns, I recommend focusing on zone optimization and carrier consolidation. Would you like me to generate a detailed cost analysis report?",
        suggestions: ['Generate Cost Analysis Report', 'Set up Cost Alerts', 'Compare Carrier Rates']
      },
      report: {
        content: "I can create several types of reports for you. What specific insights are you looking for? I can generate savings summaries, carrier comparisons, or operational efficiency reports.",
        suggestions: ['Weekly Savings Report', 'Carrier Performance Report', 'Efficiency Analysis']
      },
      optimization: {
        content: "Great question! I've identified 3 immediate optimization opportunities: zone skipping for your West Coast routes, dimensional weight optimization, and carrier consolidation. Shall I create an action plan?",
        suggestions: ['Create Action Plan', 'Schedule Implementation', 'Estimate ROI']
      },
      default: {
        content: "I understand you're looking for shipping insights. Let me suggest some reports that would be valuable based on your current data and industry best practices.",
        suggestions: ['Analyze Shipping Costs', 'Optimize Routes', 'Compare Carriers', 'Generate Report']
      }
    };

    const input = userInput.toLowerCase();
    let responseType = 'default';
    
    if (input.includes('cost') || input.includes('save') || input.includes('money')) {
      responseType = 'cost';
    } else if (input.includes('report') || input.includes('analysis')) {
      responseType = 'report';
    } else if (input.includes('optimize') || input.includes('improve')) {
      responseType = 'optimization';
    }

    const response = responses[responseType as keyof typeof responses];

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };
  };

  const handlePromptAction = (prompt: any) => {
    // Start guided prompt flow
    const message = {
      id: Date.now(),
      type: 'ai',
      content: `Let's work on ${prompt.title}. I'll ask you a few questions to create the perfect report for your needs.`,
      timestamp: new Date(),
      promptFlow: prompt
    };
    setCurrentConversation(prev => [...prev, message]);
  };

  const handleReportGeneration = (report: any) => {
    const message = {
      id: Date.now(),
      type: 'ai',
      content: `I'll generate your ${report.title} right now. This should take about ${report.timeToGenerate} and could save you ${report.estimatedSavings}.`,
      timestamp: new Date(),
      reportGeneration: report
    };
    setCurrentConversation(prev => [...prev, message]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="bg-black text-white hover:bg-gray-800 rounded-full w-12 h-12 shadow-lg relative"
        >
          <Bot className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-black">AI Assistant</h3>
            <p className="text-xs text-gray-600">Shipping Intelligence</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Suggested Reports Section */}
      {suggestedReports.length > 0 && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Suggested Reports</span>
          </div>
          <div className="space-y-2">
            {suggestedReports.slice(0, 2).map((report) => (
              <div 
                key={report.id}
                className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleReportGeneration(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-black">{report.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        {report.estimatedSavings}
                      </Badge>
                      <span className="text-xs text-gray-500">{report.timeToGenerate}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.type === 'user' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-black'
            }`}>
              <p className="text-sm">{message.content}</p>
              
              {/* AI Suggestions */}
              {message.suggestions && (
                <div className="mt-3 space-y-1">
                  {message.suggestions.map((suggestion: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-3 py-2 text-xs bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Prompt Flow */}
              {message.promptFlow && (
                <div className="mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
                  <h5 className="text-sm font-medium mb-2">I'll ask you these questions:</h5>
                  <ul className="space-y-1">
                    {message.promptFlow.questions.map((question: string, index: number) => (
                      <li key={index} className="text-xs flex items-center space-x-2">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className="mt-3 bg-white text-black hover:bg-gray-100">
                    Start Questions
                  </Button>
                </div>
              )}

              {/* Report Generation */}
              {message.reportGeneration && (
                <div className="mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="text-xs">Generating report...</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}
              
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Prompts Section */}
      {activePrompts.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-800">Smart Insights</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {activePrompts.slice(0, 2).map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptAction(prompt)}
                className="p-2 text-left bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-black">{prompt.title}</h5>
                    <p className="text-xs text-gray-600">{prompt.description}</p>
                  </div>
                  <Badge variant={prompt.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {prompt.priority}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about shipping optimization..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}