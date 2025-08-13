'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const quickActions = [
  {
    id: 'analyze-rates',
    label: 'Analyze Rates',
    description: 'Get rate analysis suggestions',
    icon: TrendingUp,
    action: 'How can I optimize my shipping rates?'
  },
  {
    id: 'upload-help',
    label: 'Upload Help',
    description: 'Get help with file uploads',
    icon: FileText,
    action: 'How do I upload and process my shipping data?'
  },
  {
    id: 'settings-help',
    label: 'Settings Help',
    description: 'Configure your preferences',
    icon: Settings,
    action: 'How do I configure my rate settings?'
  },
  {
    id: 'general-help',
    label: 'General Help',
    description: 'Get general assistance',
    icon: Lightbulb,
    action: 'What can you help me with?'
  }
];

export function AIAssistant({ isOpen = false, onClose }: AIAssistantProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your LABL IQ AI Assistant. I can help you with rate analysis, file uploads, settings configuration, and more. How can I assist you today?',
      timestamp: new Date(),
      suggestions: ['Analyze my rates', 'Help with uploads', 'Configure settings']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  const generateAIResponse = (userInput: string): { content: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('rate') || input.includes('analyze') || input.includes('optimize')) {
      return {
        content: 'I can help you analyze and optimize your shipping rates! Here are some suggestions:\n\n• Upload your shipping data to get detailed rate analysis\n• Compare different service levels and carriers\n• Identify cost-saving opportunities\n• Generate custom reports\n\nWould you like me to guide you through the rate analysis process?',
        suggestions: ['Upload data', 'View analytics', 'Generate report']
      };
    }
    
    if (input.includes('upload') || input.includes('file') || input.includes('data')) {
      return {
        content: 'To upload and process your shipping data:\n\n1. Go to the Upload section\n2. Drag and drop your CSV or Excel file\n3. Map your columns to the required fields\n4. Configure your rate settings\n5. Process the analysis\n\nI can help you with column mapping and settings configuration. What type of file are you working with?',
        suggestions: ['CSV format', 'Excel format', 'Column mapping']
      };
    }
    
    if (input.includes('setting') || input.includes('config') || input.includes('preference')) {
      return {
        content: 'You can configure your settings in several areas:\n\n• **Rate Settings**: Origin ZIP, markups, surcharges\n• **Column Profiles**: Save mapping configurations\n• **User Preferences**: Theme, notifications, defaults\n• **Admin Settings**: System-wide configurations\n\nWhich settings would you like to configure?',
        suggestions: ['Rate settings', 'Column profiles', 'User preferences']
      };
    }
    
    if (input.includes('help') || input.includes('assist')) {
      return {
        content: 'I\'m here to help you with all aspects of LABL IQ! I can assist with:\n\n• 📊 Rate analysis and optimization\n• 📁 File uploads and processing\n• ⚙️ Settings configuration\n• 📈 Analytics and reporting\n• 🔧 Troubleshooting issues\n\nJust ask me anything specific you\'d like help with!',
        suggestions: ['Rate analysis', 'File uploads', 'Settings', 'Analytics']
      };
    }
    
    return {
      content: 'I understand you\'re asking about "' + userInput + '". Let me help you with that. Could you provide more specific details about what you\'d like to accomplish? I\'m here to help with rate analysis, file processing, settings, and more.',
      suggestions: ['Rate analysis', 'File uploads', 'Settings help']
    };
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={cn(
        "w-96 shadow-2xl border-2 transition-all duration-300",
        isMinimized ? "h-16" : "h-[600px]"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Powered by GPT
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        message.type === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestion(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="h-auto p-3 flex flex-col items-start space-y-1"
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{action.label}</span>
                        <span className="text-xs text-muted-foreground">{action.description}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
