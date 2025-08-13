import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye,
  Save,
  Send,
  BarChart3,
  Table,
  TrendingUp,
  PieChart,
  Image,
  Type,
  Layers,
  Settings,
  Users,
  Calendar,
  Download,
  Sparkles
} from 'lucide-react';
import { useBrandSettings } from '../hooks/useBrandSettings';

interface ReportSection {
  id: string;
  type: 'header' | 'text' | 'chart' | 'table' | 'image' | 'spacer';
  title?: string;
  content?: string;
  config?: any;
  order: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  merchantId: string;
  sections: ReportSection[];
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModified: string;
    version: string;
  };
  settings: {
    includeExecutiveSummary: boolean;
    includeCharts: boolean;
    includeTables: boolean;
    includeRecommendations: boolean;
    pageOrientation: 'portrait' | 'landscape';
    includeAppendix: boolean;
  };
}

interface ReportBuilderProps {
  merchantId?: string;
  onSave?: (template: ReportTemplate) => void;
  onPreview?: (template: ReportTemplate) => void;
  onSend?: (template: ReportTemplate) => void;
}

export function ReportBuilder({ merchantId, onSave, onPreview, onSend }: ReportBuilderProps) {
  const { merchantProfiles, getBrandSettingsByMerchantId } = useBrandSettings('analyst');
  const [selectedMerchantId, setSelectedMerchantId] = useState(merchantId || '');
  const [currentTemplate, setCurrentTemplate] = useState<ReportTemplate | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('structure');

  // Initialize template
  useEffect(() => {
    if (selectedMerchantId && !currentTemplate) {
      createNewTemplate();
    }
  }, [selectedMerchantId]);

  const createNewTemplate = () => {
    const template: ReportTemplate = {
      id: `template_${Date.now()}`,
      name: 'Shipping Analysis Report',
      description: 'Comprehensive shipping cost analysis and optimization recommendations',
      merchantId: selectedMerchantId,
      sections: [
        {
          id: 'header_1',
          type: 'header',
          title: 'Executive Summary',
          order: 0
        },
        {
          id: 'text_1',
          type: 'text',
          title: 'Analysis Overview',
          content: 'This report provides a comprehensive analysis of your shipping costs and identifies optimization opportunities.',
          order: 1
        },
        {
          id: 'chart_1',
          type: 'chart',
          title: 'Shipping Cost Breakdown',
          config: { chartType: 'pie', dataSource: 'shipping_costs' },
          order: 2
        },
        {
          id: 'table_1',
          type: 'table',
          title: 'Carrier Comparison',
          config: { dataSource: 'carrier_rates', columns: ['carrier', 'service', 'cost', 'delivery_time'] },
          order: 3
        }
      ],
      metadata: {
        createdBy: 'analyst',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
      },
      settings: {
        includeExecutiveSummary: true,
        includeCharts: true,
        includeTables: true,
        includeRecommendations: true,
        pageOrientation: 'portrait',
        includeAppendix: false
      }
    };
    setCurrentTemplate(template);
  };

  const addSection = (type: ReportSection['type']) => {
    if (!currentTemplate) return;

    const newSection: ReportSection = {
      id: `${type}_${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: type === 'text' ? 'Enter your content here...' : undefined,
      config: type === 'chart' ? { chartType: 'bar', dataSource: 'default' } : 
              type === 'table' ? { dataSource: 'default', columns: [] } : undefined,
      order: currentTemplate.sections.length
    };

    setCurrentTemplate({
      ...currentTemplate,
      sections: [...currentTemplate.sections, newSection],
      metadata: {
        ...currentTemplate.metadata,
        lastModified: new Date().toISOString()
      }
    });
  };

  const updateSection = (sectionId: string, updates: Partial<ReportSection>) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
      metadata: {
        ...currentTemplate.metadata,
        lastModified: new Date().toISOString()
      }
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      sections: currentTemplate.sections
        .filter(section => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index })),
      metadata: {
        ...currentTemplate.metadata,
        lastModified: new Date().toISOString()
      }
    });
  };

  const reorderSections = (draggedId: string, targetId: string) => {
    if (!currentTemplate || draggedId === targetId) return;

    const sections = [...currentTemplate.sections];
    const draggedIndex = sections.findIndex(s => s.id === draggedId);
    const targetIndex = sections.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedSection] = sections.splice(draggedIndex, 1);
    sections.splice(targetIndex, 0, draggedSection);

    const reorderedSections = sections.map((section, index) => ({
      ...section,
      order: index
    }));

    setCurrentTemplate({
      ...currentTemplate,
      sections: reorderedSections,
      metadata: {
        ...currentTemplate.metadata,
        lastModified: new Date().toISOString()
      }
    });
  };

  const updateTemplateSettings = (key: string, value: any) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      settings: {
        ...currentTemplate.settings,
        [key]: value
      },
      metadata: {
        ...currentTemplate.metadata,
        lastModified: new Date().toISOString()
      }
    });
  };

  const handleSave = () => {
    if (currentTemplate && onSave) {
      onSave(currentTemplate);
    }
  };

  const handlePreview = () => {
    if (currentTemplate && onPreview) {
      onPreview(currentTemplate);
    }
  };

  const handleSend = () => {
    if (currentTemplate && onSend) {
      onSend(currentTemplate);
    }
  };

  const getSectionIcon = (type: ReportSection['type']) => {
    switch (type) {
      case 'header': return Type;
      case 'text': return FileText;
      case 'chart': return BarChart3;
      case 'table': return Table;
      case 'image': return Image;
      case 'spacer': return Layers;
      default: return FileText;
    }
  };

  const currentBrandSettings = selectedMerchantId ? getBrandSettingsByMerchantId(selectedMerchantId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-black">Report Builder</h3>
          <p className="text-sm text-gray-600">Create custom branded reports for your clients</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          
          <Button size="sm" onClick={handleSend} className="bg-black text-white hover:bg-gray-800">
            <Send className="w-4 h-4 mr-2" />
            Send Report
          </Button>
        </div>
      </div>

      {/* Merchant Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Client Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="merchantSelect">Select Client</Label>
              <Select value={selectedMerchantId} onValueChange={setSelectedMerchantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent>
                  {merchantProfiles.map((merchant) => (
                    <SelectItem key={merchant.id} value={merchant.id}>
                      <div className="flex items-center space-x-2">
                        <span>{merchant.name}</span>
                        {merchant.brandSettings && (
                          <Badge variant="secondary" className="text-xs">Branded</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentBrandSettings && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: currentBrandSettings.colors.primary }}
                />
                <span className="text-sm text-gray-600">Brand theme active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentTemplate && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Report Structure</TabsTrigger>
            <TabsTrigger value="content">Content Editor</TabsTrigger>
            <TabsTrigger value="settings">Report Settings</TabsTrigger>
          </TabsList>

          {/* Report Structure */}
          <TabsContent value="structure" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Section Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Sections</CardTitle>
                  <CardDescription>Drag or click to add sections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { type: 'header', label: 'Header', icon: Type },
                    { type: 'text', label: 'Text Block', icon: FileText },
                    { type: 'chart', label: 'Chart', icon: BarChart3 },
                    { type: 'table', label: 'Data Table', icon: Table },
                    { type: 'image', label: 'Image', icon: Image },
                    { type: 'spacer', label: 'Spacer', icon: Layers }
                  ].map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => addSection(type as ReportSection['type'])}
                      className="w-full justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Report Structure */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Report Structure</CardTitle>
                  <CardDescription>
                    {currentTemplate.sections.length} sections • Drag to reorder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentTemplate.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => {
                        const Icon = getSectionIcon(section.type);
                        return (
                          <div
                            key={section.id}
                            draggable
                            onDragStart={() => setDraggedSection(section.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedSection) {
                                reorderSections(draggedSection, section.id);
                                setDraggedSection(null);
                              }
                            }}
                            className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-move ${
                              draggedSection === section.id ? 'opacity-50' : ''
                            }`}
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-gray-600" />
                            </div>

                            <div className="flex-1">
                              <div className="font-medium text-sm text-black">{section.title}</div>
                              <div className="text-xs text-gray-500 capitalize">{section.type}</div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSection(section.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        );
                      })}
                    
                    {currentTemplate.sections.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No sections added yet</p>
                        <p className="text-sm text-gray-500">Add sections from the library to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Editor */}
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              {currentTemplate.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <Card key={section.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {React.createElement(getSectionIcon(section.type), { 
                            className: "w-4 h-4 text-blue-600" 
                          })}
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="font-medium"
                          />
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {section.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {section.type === 'text' && (
                        <Textarea
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          placeholder="Enter your text content..."
                          rows={4}
                        />
                      )}
                      
                      {section.type === 'chart' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Chart Type</Label>
                              <Select 
                                value={section.config?.chartType || 'bar'}
                                onValueChange={(value) => updateSection(section.id, { 
                                  config: { ...section.config, chartType: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bar">Bar Chart</SelectItem>
                                  <SelectItem value="line">Line Chart</SelectItem>
                                  <SelectItem value="pie">Pie Chart</SelectItem>
                                  <SelectItem value="area">Area Chart</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Data Source</Label>
                              <Select 
                                value={section.config?.dataSource || 'default'}
                                onValueChange={(value) => updateSection(section.id, { 
                                  config: { ...section.config, dataSource: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="shipping_costs">Shipping Costs</SelectItem>
                                  <SelectItem value="carrier_performance">Carrier Performance</SelectItem>
                                  <SelectItem value="delivery_times">Delivery Times</SelectItem>
                                  <SelectItem value="cost_savings">Cost Savings</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'table' && (
                        <div className="space-y-3">
                          <div>
                            <Label>Data Source</Label>
                            <Select 
                              value={section.config?.dataSource || 'default'}
                              onValueChange={(value) => updateSection(section.id, { 
                                config: { ...section.config, dataSource: value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="carrier_rates">Carrier Rates</SelectItem>
                                <SelectItem value="shipment_details">Shipment Details</SelectItem>
                                <SelectItem value="cost_analysis">Cost Analysis</SelectItem>
                                <SelectItem value="recommendations">Recommendations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'image' && (
                        <div className="space-y-3">
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={section.config?.imageUrl || ''}
                              onChange={(e) => updateSection(section.id, { 
                                config: { ...section.config, imageUrl: e.target.value }
                              })}
                              placeholder="https://example.com/image.png"
                            />
                          </div>
                          <div>
                            <Label>Alt Text</Label>
                            <Input
                              value={section.config?.altText || ''}
                              onChange={(e) => updateSection(section.id, { 
                                config: { ...section.config, altText: e.target.value }
                              })}
                              placeholder="Describe the image..."
                            />
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'spacer' && (
                        <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded">
                          Spacing element - will create vertical space in the report
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Report Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Name</Label>
                    <Input
                      value={currentTemplate.name}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate,
                        name: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={currentTemplate.description}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate,
                        description: e.target.value
                      })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Display Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Include Executive Summary</Label>
                      <Switch
                        checked={currentTemplate.settings.includeExecutiveSummary}
                        onCheckedChange={(checked) => updateTemplateSettings('includeExecutiveSummary', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Include Charts</Label>
                      <Switch
                        checked={currentTemplate.settings.includeCharts}
                        onCheckedChange={(checked) => updateTemplateSettings('includeCharts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Include Data Tables</Label>
                      <Switch
                        checked={currentTemplate.settings.includeTables}
                        onCheckedChange={(checked) => updateTemplateSettings('includeTables', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Include Recommendations</Label>
                      <Switch
                        checked={currentTemplate.settings.includeRecommendations}
                        onCheckedChange={(checked) => updateTemplateSettings('includeRecommendations', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Include Appendix</Label>
                      <Switch
                        checked={currentTemplate.settings.includeAppendix}
                        onCheckedChange={(checked) => updateTemplateSettings('includeAppendix', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Page Orientation</Label>
                    <Select 
                      value={currentTemplate.settings.pageOrientation}
                      onValueChange={(value) => updateTemplateSettings('pageOrientation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}