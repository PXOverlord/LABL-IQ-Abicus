import React from 'react';
import { ViewConfiguration } from '../hooks/useViewManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Info, 
  Edit3, 
  Eye, 
  Settings,
  Sparkles,
  Layout
} from 'lucide-react';

// Import all the actual components
import { FileUpload } from './FileUpload';
import { JourneyAwareDashboard } from './JourneyAwareDashboard';
import { AnalysisResults } from './AnalysisResults';
import { Reports } from './Reports';
import { ShippingTools } from './ShippingTools';
import { Analytics } from './Analytics';
import { Integrations } from './Integrations';
import { Account } from './Account';
import { KnowledgeBase } from './KnowledgeBase';
import { AdminSettings } from './AdminSettings';

interface DynamicViewRendererProps {
  viewConfig: ViewConfiguration;
  isCustomizable?: boolean;
  onEdit?: (viewId: string) => void;
  onAnalysisStart?: (id: string) => void;
  onFileUpload?: (files: File[]) => void;
  onSettingsUpdate?: (settings: any) => void;
  [key: string]: any; // Allow additional props to be passed through
}

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  'FileUpload': FileUpload,
  'JourneyAwareDashboard': JourneyAwareDashboard,
  'AnalysisResults': AnalysisResults,
  'Reports': Reports,
  'ShippingTools': ShippingTools,
  'Analytics': Analytics,
  'Integrations': Integrations,
  'Account': Account,
  'KnowledgeBase': KnowledgeBase,
  'AdminSettings': AdminSettings
};

export function DynamicViewRenderer({ 
  viewConfig, 
  isCustomizable = false, 
  onEdit, 
  onAnalysisStart,
  onFileUpload,
  onSettingsUpdate,
  ...additionalProps 
}: DynamicViewRendererProps) {
  const ComponentToRender = componentMap[viewConfig.component];

  // If the component doesn't exist, show an error
  if (!ComponentToRender) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            Component "{viewConfig.component}" not found. Please check the view configuration.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layout className="w-5 h-5 text-gray-500" />
              <span>{viewConfig.title}</span>
            </CardTitle>
            <CardDescription>{viewConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-600">This view is not available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare props for the component
  const componentProps = {
    ...additionalProps,
    // Pass specific props based on component type
    ...(viewConfig.component === 'FileUpload' && { 
      onFileUpload, 
      onAnalysisStart 
    }),
    ...(viewConfig.component === 'AdminSettings' && { 
      onSettingsUpdate 
    })
  };

  // Custom header if view has custom content
  const hasCustomHeader = viewConfig.customization?.customContent?.header;
  const customHeader = viewConfig.customization?.customContent?.header;

  // Apply custom theme if available
  const customTheme = viewConfig.customization?.theme;
  const themeStyles = customTheme ? {
    backgroundColor: customTheme.backgroundColor,
    color: customTheme.textColor,
    '--accent-color': customTheme.accentColor
  } : {};

  return (
    <div className="space-y-6" style={themeStyles}>
      {/* Custom Header */}
      {hasCustomHeader && (
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-semibold text-black">
                  {customHeader?.title || viewConfig.title}
                </h1>
                
                {isCustomizable && onEdit && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Customizable
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-gray-600">
                {customHeader?.description || viewConfig.description}
              </p>
            </div>
            
            {/* Custom header actions */}
            {customHeader?.actions && (
              <div className="flex items-center space-x-3">
                {customHeader.actions.map((action: any, index: number) => (
                  <Button key={index} {...action.props}>
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Edit button for customizable views */}
            {isCustomizable && onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(viewConfig.id)}
                className="ml-3"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Customize View
              </Button>
            )}
          </div>
        </div>
      )}

      {/* View Content */}
      <div className="relative">
        {/* Custom sections overlay */}
        {viewConfig.customization?.customContent?.sections && (
          <div className="space-y-6 mb-6">
            {viewConfig.customization.customContent.sections
              .filter(section => section.visible)
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{section.title}</span>
                      {isCustomizable && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Custom Section
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.type === 'text' && (
                      <div className="prose max-w-none">
                        {section.content || 'Custom text content goes here...'}
                      </div>
                    )}
                    
                    {section.type === 'cards' && (
                      <div className={`grid gap-4 ${
                        section.config?.layout === 'grid' 
                          ? `grid-cols-${section.config.cardCount || 4}` 
                          : 'grid-cols-1'
                      }`}>
                        {/* Render custom cards based on config */}
                        {Array.from({ length: section.config?.cardCount || 4 }).map((_, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-semibold text-gray-600">--</div>
                                <div className="text-sm text-gray-500">Custom Metric {i + 1}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {section.type === 'chart' && (
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Eye className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600">Custom {section.config?.chartType || 'chart'} visualization</p>
                        </div>
                      </div>
                    )}
                    
                    {section.type === 'table' && (
                      <div className="border border-gray-200 rounded-lg">
                        <div className="p-4 text-center text-gray-600">
                          Custom table with {section.config?.maxRows || 10} rows
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Original Component */}
        <ComponentToRender {...componentProps} />
      </div>
    </div>
  );
}