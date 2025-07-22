
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { FileUpload } from '../../components/dashboard/file-upload';
import { ColumnMapping } from '../../components/dashboard/column-mapping';
import { RateSettings } from '../../components/dashboard/rate-settings';
import { Button } from '../../components/ui/button';
import { useAnalysisStore } from '../../lib/stores/analysis-store';
import { useProfilesStore } from '../../lib/stores/profiles-store';
import { ColumnMapping as IColumnMapping } from '../../lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    startAnalysis, 
    mapColumns, 
    processAnalysis, 
    isLoading, 
    uploadProgress 
  } = useAnalysisStore();
  const { createProfile } = useProfilesStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisId, setAnalysisId] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<IColumnMapping>({});
  const [rateSettings, setRateSettings] = useState({
    originZip: '',
    markup: 0,
    surcharge: 0,
    fuelSurcharge: 16.0,
    dasSurcharge: 1.98,
    edasSurcharge: 3.92,
    remoteSurcharge: 14.15,
    dimDivisor: 139.0,
    discountPercent: 0.0,
  });
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'settings' | 'processing' | 'completed'>('upload');

  useEffect(() => {
    // For testing, skip authentication check
    // In production, this should check authentication
    console.log('Dashboard loaded - authentication bypassed for testing');
  }, []);

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedFile(file);
      const id = await startAnalysis(file);
      setAnalysisId(id);
      
      // Get columns from the analysis store
      const currentAnalysis = useAnalysisStore.getState().currentAnalysis;
      if (currentAnalysis?.results?.columns) {
        setColumns(currentAnalysis.results.columns);
      } else {
        // Fallback to mock columns if backend doesn't return them
        const mockColumns = [
          'Weight', 'Length', 'Width', 'Height', 
          'Origin ZIP', 'Destination ZIP', 'Service Level',
          'Package ID', 'Date', 'Cost'
        ];
        setColumns(mockColumns);
      }
      
      setCurrentStep('mapping');
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error(error);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setAnalysisId('');
    setColumns([]);
    setColumnMapping({});
    setCurrentStep('upload');
  };

  const handleMappingChange = (mapping: IColumnMapping) => {
    setColumnMapping(mapping);
    if (isRequiredFieldsMapped(mapping)) {
      setCurrentStep('settings');
    }
  };

  const handleSaveProfile = async (name: string, description: string) => {
    try {
      await createProfile({
        name,
        description,
        mapping: columnMapping,
      });
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    }
  };

  const handleRunAnalysis = async () => {
    if (!analysisId) {
      toast.error('Please upload a file first');
      return;
    }
    
    if (!rateSettings.originZip) {
      toast.error('Please set your origin ZIP code in Settings');
      return;
    }

    try {
      setCurrentStep('processing');
      
      // Map columns first
      await mapColumns(analysisId, columnMapping);
      
      // Start processing
      await processAnalysis(analysisId, rateSettings);
      
      toast.success('Analysis completed! Check the results below.');
      
      // Stay on dashboard and show results
      setCurrentStep('completed');
    } catch (error) {
      toast.error('Failed to start analysis');
      console.error(error);
      setCurrentStep('settings');
    }
  };

  const isRequiredFieldsMapped = (mapping: IColumnMapping): boolean => {
    return Boolean(mapping.weight && mapping.destinationZip);
  };

  const canRunAnalysis = Boolean(
    selectedFile && 
    isRequiredFieldsMapped(columnMapping) && 
    currentStep !== 'processing'
  );



  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Upload your shipping data and analyze rates across carriers to find optimization opportunities.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep !== 'upload' ? 'text-green-600' : 'text-primary'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep !== 'upload' ? 'bg-green-100' : 'bg-primary text-white'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Upload File</span>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep === 'mapping' || currentStep === 'settings' || currentStep === 'processing' ? 'bg-green-500' : 'bg-gray-300'}`} />
              
              <div className={`flex items-center ${
                currentStep === 'mapping' ? 'text-primary' : 
                currentStep === 'settings' || currentStep === 'processing' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'mapping' ? 'bg-primary text-white' :
                  currentStep === 'settings' || currentStep === 'processing' ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Map Columns</span>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep === 'settings' || currentStep === 'processing' ? 'bg-green-500' : 'bg-gray-300'}`} />
              
              <div className={`flex items-center ${
                currentStep === 'settings' ? 'text-primary' :
                currentStep === 'processing' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'settings' ? 'bg-primary text-white' :
                  currentStep === 'processing' ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Configure & Run</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Upload */}
            <div className="lg:col-span-1">
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                uploadProgress={uploadProgress}
                isUploading={isLoading && currentStep === 'upload'}
              />
            </div>

            {/* Column Mapping */}
            {columns.length > 0 && (
              <div className="lg:col-span-2">
                <ColumnMapping
                  columns={columns}
                  mapping={columnMapping}
                  onMappingChange={handleMappingChange}
                  onSaveProfile={handleSaveProfile}
                />
              </div>
            )}

            {/* Rate Settings */}
            {(currentStep === 'settings' || currentStep === 'processing') && (
              <div className="lg:col-span-1">
                <RateSettings
                  settings={rateSettings}
                  onSettingsChange={setRateSettings}
                  onRunAnalysis={handleRunAnalysis}
                  canRunAnalysis={canRunAnalysis}
                  isRunning={currentStep === 'processing'}
                  savedOriginZip="90210" // This would come from user settings in production
                />
              </div>
            )}
          </div>

          {/* Processing Status */}
          {currentStep === 'processing' && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h3 className="text-lg font-medium text-blue-900">
                    Analysis in Progress
                  </h3>
                  <p className="text-blue-700">
                    We're analyzing your shipping data across multiple carriers. This typically takes 2-5 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {currentStep === 'completed' && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-900">
                      Analysis Completed Successfully!
                    </h3>
                    <p className="text-green-700">
                      Your shipping data has been analyzed across multiple carriers.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                      ${useAnalysisStore.getState().currentAnalysis?.results?.summary?.totalSavings?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-gray-600">Total Potential Savings</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                      {useAnalysisStore.getState().currentAnalysis?.results?.summary?.totalShipments || 0}
                    </div>
                    <div className="text-sm text-gray-600">Shipments Analyzed</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">
                      ${useAnalysisStore.getState().currentAnalysis?.results?.summary?.averageSavings?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-gray-600">Average Savings per Shipment</div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <Button 
                    onClick={() => setCurrentStep('upload')}
                    variant="outline"
                  >
                    Start New Analysis
                  </Button>
                  <Button 
                    onClick={() => window.open('/test', '_blank')}
                    variant="outline"
                  >
                    Test Backend Connection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
