
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { FileUpload } from '../../components/dashboard/file-upload';
import { ColumnMapping } from '../../components/dashboard/column-mapping';
import { RateSettings } from '../../components/dashboard/rate-settings';
import { useAnalysisStore } from '../../lib/stores/analysis-store';
import { useProfilesStore } from '../../lib/stores/profiles-store';
import { useAuthStore } from '../../lib/stores/auth-store';
import { ColumnMapping as IColumnMapping } from '../../lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    startAnalysis, 
    mapColumns, 
    processAnalysis, 
    isLoading, 
    uploadProgress 
  } = useAnalysisStore();
  const { createProfile } = useProfilesStore();
  const { user, fetchUser } = useAuthStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisId, setAnalysisId] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<IColumnMapping>({});
  const [rateSettings, setRateSettings] = useState({
    originZip: '',
    markup: 0,
    surcharge: 0,
  });
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'settings' | 'processing'>('upload');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchUser();
  }, [session, status, router, fetchUser]);

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedFile(file);
      const id = await startAnalysis(file);
      setAnalysisId(id);
      
      // Simulate column extraction (in real app, this would come from backend)
      const mockColumns = [
        'Weight', 'Length', 'Width', 'Height', 
        'Origin ZIP', 'Destination ZIP', 'Service Level',
        'Package ID', 'Date', 'Cost'
      ];
      setColumns(mockColumns);
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
    if (!analysisId || !rateSettings.originZip) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      setCurrentStep('processing');
      
      // Map columns first
      await mapColumns(analysisId, columnMapping);
      
      // Start processing
      await processAnalysis(analysisId, rateSettings);
      
      toast.success('Analysis started! Redirecting to results...');
      
      // Redirect to results page after a short delay
      setTimeout(() => {
        router.push(`/analysis/${analysisId}`);
      }, 2000);
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
    rateSettings.originZip.trim() !== '' && 
    currentStep !== 'processing'
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        </div>
      </main>
    </div>
  );
}
