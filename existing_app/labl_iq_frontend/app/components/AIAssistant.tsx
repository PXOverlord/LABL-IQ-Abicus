'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  assistantAPI,
  type AssistantMessage,
  type AssistantSession,
} from '../lib/api';
import { useAnalysisStore } from '../hooks/useAnalysisStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
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
  Settings as SettingsIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AIAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
}

const quickActions: QuickAction[] = [
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
    icon: SettingsIcon,
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

const FALLBACK_SESSION_ID = 'local-fallback';

type AssistantContextPayload = {
  page?: string | null;
  analysis?: {
    id?: string | null;
    title?: string | null;
    merchant?: string | null;
    summary?: {
      percentSavings?: number | string | null;
      totalSavings?: number | string | null;
      totalShipments?: number | string | null;
    } | null;
  };
  rateSettings?: {
    markupPercent?: number | string | null;
    fuelSurchargePercent?: number | string | null;
    originZip?: string | null;
    dasSurcharge?: number | string | null;
    edasSurcharge?: number | string | null;
    remoteSurcharge?: number | string | null;
  };
};

const numberFromUnknown = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (value: number | string | null | undefined): string | null => {
  const amount = numberFromUnknown(value);
  if (amount === null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
  }).format(amount);
};

const formatPercent = (value: number | string | null | undefined): string | null => {
  const amount = numberFromUnknown(value);
  if (amount === null) return null;
  return `${amount.toFixed(Math.abs(amount) < 1 ? 1 : 0)}%`;
};

const describePage = (pathname?: string | null): string | null => {
  if (!pathname) return null;
  if (pathname.includes('/upload')) return 'Upload workspace';
  if (pathname.includes('/mapping')) return 'Column mapping';
  if (pathname.includes('/analysis/') && !pathname.endsWith('/analysis')) return 'Analysis review';
  if (pathname.endsWith('/analysis')) return 'Analysis dashboard';
  if (pathname.includes('/history')) return 'Analysis history';
  if (pathname.includes('/settings')) return 'Settings';
  if (pathname.includes('/profiles')) return 'Column profiles';
  return pathname.replace(/^\/+/, '').replace(/\//g, ' › ') || 'Dashboard';
};

const buildContextSummary = (context?: AssistantContextPayload): string => {
  if (!context) return '';
  const segments: string[] = [];

  if (context.analysis) {
    const pieces: string[] = [];
    const { title, merchant, summary } = context.analysis;
    if (title) pieces.push(`Analysis: ${title}`);
    if (merchant) pieces.push(`Merchant: ${merchant}`);
    const formattedSavings = formatCurrency(summary?.totalSavings ?? null);
    if (formattedSavings) pieces.push(`Savings: ${formattedSavings}`);
    const formattedPct = formatPercent(summary?.percentSavings ?? null);
    if (formattedPct) pieces.push(`Savings rate: ${formattedPct}`);
    const shipments = numberFromUnknown(summary?.totalShipments ?? null);
    if (shipments !== null) pieces.push(`${shipments} shipments`);
    if (pieces.length) {
      segments.push(pieces.join(' · '));
    }
  }

  if (context.rateSettings) {
    const pieces: string[] = [];
    const rateSettings = context.rateSettings;
    const markup = formatPercent(rateSettings.markupPercent ?? null);
    if (markup) pieces.push(`Markup ${markup}`);
    const fuel = formatPercent(rateSettings.fuelSurchargePercent ?? null);
    if (fuel) pieces.push(`Fuel surcharge ${fuel}`);
    if (rateSettings.originZip) pieces.push(`Origin ZIP ${rateSettings.originZip}`);
    const dasCharge = formatCurrency(rateSettings.dasSurcharge ?? null);
    if (dasCharge) pieces.push(`DAS ${dasCharge}`);
    const edasCharge = formatCurrency(rateSettings.edasSurcharge ?? null);
    if (edasCharge) pieces.push(`EDAS ${edasCharge}`);
    const remoteCharge = formatCurrency(rateSettings.remoteSurcharge ?? null);
    if (remoteCharge) pieces.push(`Remote ${remoteCharge}`);
    if (pieces.length) {
      segments.push(`Rate settings → ${pieces.join(' | ')}`);
    }
  }

  const page = describePage(context.page);
  if (page) {
    segments.push(`Current view: ${page}`);
  }

  return segments.length ? segments.join('\n') : '';
};

const createFallbackSession = (seedMessages: AssistantMessage[] = []): AssistantSession => {
  const timestamp = new Date().toISOString();
  return {
    sessionId: FALLBACK_SESSION_ID,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: seedMessages,
  };
};

const generateFallbackAssistantMessage = (
  input: string,
  context?: AssistantContextPayload,
  history: AssistantMessage[] = []
): AssistantMessage => {
  const lower = input.toLowerCase();
  const createdAt = new Date().toISOString();
  const contextSummary = buildContextSummary(context);
  let suggestions: string[] = [];
  let content: string;

  if (/(rate|saving|optimiz|analysis)/.test(lower)) {
    content = [
      'Here is a rate analysis game plan:',
      '• Upload a recent shipment file on the Upload page',
      '• Verify or adjust your column mapping so costs and zones align',
      '• Apply your markup, surcharges, and origin ZIP in Rate Settings',
      '• Review the savings summary to flag shipments that need renegotiation',
    ].join('\n');
    suggestions = ['Upload data', 'Review current analysis', 'Compare carrier savings'];
  } else if (/(upload|file|import|csv|excel|mapping)/.test(lower)) {
    content = [
      'To move your file through LABL IQ:',
      '• Go to Upload and drag in your CSV/Excel',
      '• Confirm the detected columns, or map them manually',
      '• Save a column profile if you plan to reuse this layout',
      '• Run processing to calculate savings versus Amazon rates',
    ].join('\n');
    suggestions = ['Column mapping tips', 'Create column profile', 'Troubleshoot upload'];
  } else if (/(setting|config|preference|markup|surcharge)/.test(lower)) {
    content = [
      'Configuration highlights:',
      '• Rate Settings covers markup, fuel surcharge, DAS/EDAS, and origin ZIP',
      '• Column Profiles lets you reuse mappings per carrier or data source',
      '• Preferences handle theme, notifications, and defaults',
      'Tell me which one to walk through and I will outline the steps.',
    ].join('\n');
    suggestions = ['Adjust rate settings', 'Manage column profiles', 'Update preferences'];
  } else if (/(report|export|download|share)/.test(lower)) {
    content = [
      'Results can be exported right from the Analysis view:',
      '• Export CSV/Excel summaries for finance reviews',
      '• Generate PDF briefs when you need a client-ready snapshot',
      '• Use the action menu to share direct links with teammates',
      'Let me know if you want a recommended talking points summary.',
    ].join('\n');
    suggestions = ['Export CSV', 'Create PDF summary', 'Share highlights'];
  } else if (/(alert|notify|automation)/.test(lower)) {
    content = [
      'Automation ideas you can enable quickly:',
      '• Set thresholds to alert when markup or spend drifts',
      '• Schedule weekly savings summaries for stakeholders',
      '• Bookmark analyses to surface quick wins in History',
    ].join('\n');
    suggestions = ['Configure alerts', 'Schedule summaries', 'Bookmark analyses'];
  } else {
    const opening =
      "I'm your LABL IQ assistant. I can guide uploads, rate settings, reporting, and savings reviews.";
    const contextLine = contextSummary ? `\n\nContext notes:\n${contextSummary}` : '';
    const latestUser = history
      .filter((message) => message.role === 'user')
      .slice(-1)
      .map((message) => message.content)
      .pop();
    const followUp = latestUser
      ? `\n\nNext step: tell me more about "${latestUser}" or pick a quick action below.`
      : '\n\nPick a quick action below to get started or ask me anything specific.';
    content = `${opening}${contextLine}${followUp}`;
    suggestions = ['Analyze my rates', 'Help with uploads', 'Show my last results'];
  }

  if (contextSummary && !content.includes('Context notes')) {
    content += `\n\nContext notes:\n${contextSummary}`;
  }

  return {
    id: `${createdAt}-assistant`,
    role: 'assistant',
    content: content.trim(),
    createdAt,
    suggestions,
  };
};

const fallbackStatusMessage =
  'Assistant is running in local help mode. Responses stay on-device and avoid OpenAI costs. Start the backend to re-enable live AI responses.';

const createWelcomeMessage = (): AssistantMessage => ({
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your LABL IQ assistant. I can help with rate analysis, uploads, settings, and reporting. What should we work on first?",
  createdAt: new Date().toISOString(),
  suggestions: ['Analyze my rates', 'Help with uploads', 'Configure settings']
});

export function AIAssistant({ isOpen = false, onClose }: AIAssistantProps) {
  const pathname = usePathname();
  const current = useAnalysisStore((state) => state.current);
  const settings = useAnalysisStore((state) => state.settings);

  const [session, setSession] = useState<AssistantSession | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionRef = useRef<AssistantSession | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const analysisContext = useMemo(() => {
    if (!current) return undefined;
    const summary = current.summary || {};
    return {
      id: current.id,
      title: current.title || current.filename || undefined,
      merchant: current.merchant,
      summary: {
        percentSavings: summary.percent_savings,
        totalSavings: summary.total_savings,
        totalShipments: summary.total_shipments,
      },
    };
  }, [current]);

  const rateContext = useMemo(() => {
    if (!settings) return undefined;
    return {
      markupPercent: settings.markup_percent ?? settings.markupPct ?? null,
      fuelSurchargePercent: settings.fuel_surcharge_percent ?? settings.fuelSurchargePct ?? null,
      originZip: settings.origin_zip ?? settings.originZip ?? null,
      dasSurcharge: settings.das_surcharge ?? null,
      edasSurcharge: settings.edas_surcharge ?? null,
      remoteSurcharge: settings.remote_surcharge ?? null,
    };
  }, [settings]);

  const contextPayload = useMemo<AssistantContextPayload>(
    () => ({
      page: pathname,
      analysis: analysisContext ?? undefined,
      rateSettings: rateContext ?? undefined,
    }),
    [pathname, analysisContext, rateContext]
  );

  const initializeSession = useCallback(async (): Promise<AssistantSession | null> => {
    if (sessionRef.current) {
      return sessionRef.current;
    }
    if (isSessionLoading) {
      return null;
    }
    setIsSessionLoading(true);
    try {
      const newSession = await assistantAPI.createSession(contextPayload);
      setSession(newSession);
      sessionRef.current = newSession;
      setUseFallback(false);
      setStatusMessage(null);
      setError(null);
      return newSession;
    } catch (err) {
      console.error('Failed to start AI session', err);
      const fallbackSession = createFallbackSession();
      setUseFallback(true);
      setStatusMessage(fallbackStatusMessage);
      setError(null);
      setSession(fallbackSession);
      sessionRef.current = fallbackSession;
      return fallbackSession;
    } finally {
      setIsSessionLoading(false);
    }
  }, [contextPayload, isSessionLoading]);

  useEffect(() => {
    if (isOpen) {
      void initializeSession();
    }
  }, [isOpen, initializeSession]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      setInputValue('');
      setError(null);

      let activeSession = sessionRef.current;
      if (!activeSession) {
        activeSession = await initializeSession();
        if (!activeSession) {
          return;
        }
      }

      const timestamp = new Date().toISOString();
      const optimistic: AssistantSession = {
        ...activeSession,
        updatedAt: timestamp,
        messages: [
          ...activeSession.messages,
          {
            id: `${timestamp}-user`,
            role: 'user',
            content: trimmed,
            createdAt: timestamp,
          },
        ],
      };

      const previous = activeSession;
      setSession(optimistic);
      sessionRef.current = optimistic;
      setIsTyping(true);

      try {
        if (useFallback || optimistic.sessionId === FALLBACK_SESSION_ID) {
          const fallbackMessage = generateFallbackAssistantMessage(
            trimmed,
            contextPayload,
            optimistic.messages
          );
          const localSession: AssistantSession = {
            ...optimistic,
            sessionId: FALLBACK_SESSION_ID,
            updatedAt: fallbackMessage.createdAt,
            messages: [...optimistic.messages, fallbackMessage],
          };
          setUseFallback(true);
          setStatusMessage(fallbackStatusMessage);
          setSession(localSession);
          sessionRef.current = localSession;
          return;
        }

        const response = await assistantAPI.sendMessage(
          activeSession.sessionId,
          trimmed,
          contextPayload
        );
        setSession(response.session);
        sessionRef.current = response.session;
        setStatusMessage(null);
      } catch (err) {
        console.error('Assistant response failed', err);
        const fallbackMessage = generateFallbackAssistantMessage(
          trimmed,
          contextPayload,
          optimistic.messages
        );
        const fallbackSession: AssistantSession = {
          ...previous,
          sessionId: FALLBACK_SESSION_ID,
          updatedAt: fallbackMessage.createdAt,
          messages: [...optimistic.messages, fallbackMessage],
        };
        setUseFallback(true);
        setStatusMessage(fallbackStatusMessage);
        setError(null);
        setSession(fallbackSession);
        sessionRef.current = fallbackSession;
      } finally {
        setIsTyping(false);
      }
    },
    [contextPayload, initializeSession, useFallback]
  );

  const handleQuickAction = (action: string) => {
    void handleSendMessage(action);
  };

  const handleSuggestion = (suggestion: string) => {
    void handleSendMessage(suggestion);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSendMessage(inputValue);
  };

  const messages = session?.messages ?? [];
  const displayMessages = useMemo(() => {
    if (messages.length > 0) {
      return messages;
    }
    return [createWelcomeMessage()];
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages.length, isTyping]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={cn(
          'flex w-96 flex-col overflow-hidden shadow-2xl border-2 transition-all duration-300',
          isMinimized ? 'h-16' : 'h-[600px]'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <Badge
                  variant={useFallback ? 'outline' : 'secondary'}
                  className="text-xs"
                >
                  {useFallback ? (
                    <Lightbulb className="w-3 h-3 mr-1" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  {useFallback ? 'Local help mode' : 'Powered by GPT'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-1 flex-col overflow-hidden">
            {error && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {statusMessage && (
              <Alert className="mb-3 border-amber-200 bg-amber-50 text-amber-900">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            )}

            {quickActions.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleQuickAction(action.action)}
                      className="group w-full text-left border border-muted rounded-lg p-3 hover:bg-muted transition"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-md bg-muted-foreground/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{action.label}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex-1 overflow-hidden rounded-lg border bg-muted/40">
              <ScrollArea className="h-full px-4 py-4">
                {isSessionLoading && messages.length === 0 ? (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Initializing assistant…</span>
                  </div>
                ) : (
                  <div className="space-y-4 pr-2">
                    {displayMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-white border'
                          )}
                        >
                          <p className="whitespace-pre-line leading-relaxed selection:bg-primary/20 selection:text-foreground">
                            {message.content}
                          </p>
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>

                          {message.role === 'assistant' && message.suggestions?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion) => (
                                <Button
                                  key={suggestion}
                                  variant="outline"
                                  size="xs"
                                  onClick={() => handleSuggestion(suggestion)}
                                  className="text-xs"
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Assistant is typing…</span>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex items-center space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask about rates, uploads, or settings…"
                  disabled={isTyping}
                />
                <Button type="submit" disabled={isTyping || !inputValue.trim()}>
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
