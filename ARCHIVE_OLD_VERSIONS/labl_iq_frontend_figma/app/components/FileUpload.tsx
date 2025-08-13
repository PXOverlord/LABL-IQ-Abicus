
'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Upload, 
  FileSpreadsheet, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  Info,
  FileCheck,
  CloudUpload,
  Activity,
  Shield,
  Clock
} from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  onAnalysisStart?: (analysisId: string) => void;
}

export function FileUpload({ onFileUpload, onAnalysisStart }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'success' | 'error' }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});
  const [uploadResults, setUploadResults] = useState<{ [key: string]: any }>({});

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === 'text/csv' || 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );
    
    if (validFiles.length > 0) {
      handleFileUpload(validFiles);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = async (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    for (const file of newFiles) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Simulate progress during upload
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[file.name] || 0;
            if (current < 90) {
              return { ...prev, [file.name]: current + 10 };
            }
            return prev;
          });
        }, 100);
        
        // Upload to backend
        const response = await fetch('/api/analysis/upload', {
          method: 'POST',
          body: formData,
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Update progress to 100% and mark as success
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        setUploadResults(prev => ({ ...prev, [file.name]: result }));
        
        // Clear any previous errors
        setUploadErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[file.name];
          return newErrors;
        });
        
        // Call the analysis start callback if provided
        if (onAnalysisStart && result.analysisId) {
          onAnalysisStart(result.analysisId);
        }
        
      } catch (error) {
        console.error('File upload error:', error);
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        setUploadErrors(prev => ({ 
          ...prev, 
          [file.name]: error instanceof Error ? error.message : 'Upload failed'
        }));
      }
    }
    
    onFileUpload(newFiles);
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileName];
      return newErrors;
    });
    setUploadResults(prev => {
      const newResults = { ...prev };
      delete newResults[fileName];
      return newResults;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'text/csv') return <FileSpreadsheet className="w-6 h-6 text-blue-600" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Data Requirements:</strong> Include origin ZIP, destination ZIP, weight, dimensions, and current shipping costs in your files.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Secure Upload:</strong> Your data is encrypted and processed securely. Files are automatically deleted after analysis.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-green-200 bg-green-50">
          <Clock className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Fast Processing:</strong> Analysis typically completes in under 3 minutes for files up to 10,000 shipments.
          </AlertDescription>
        </Alert>
      </div>

      {/* Upload Area */}
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-medium flex items-center justify-center space-x-2">
            <CloudUpload className="w-7 h-7 text-blue-600" />
            <span>Upload Shipment Data</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Drag and drop your files here, or click to browse from your computer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className={`p-6 rounded-xl transition-colors duration-300 ${
                dragActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-12 h-12 ${dragActive ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              
              <div className="space-y-2">
                <p className="text-xl font-medium text-black">
                  {dragActive ? 'Drop your files here' : 'Drop your files here'}
                </p>
                <p className="text-gray-600">
                  Supports CSV and Excel files up to 50MB each
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button className="px-8 py-3 bg-black text-white hover:bg-gray-800">
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Browse Files</span>
                  </label>
                </Button>
                <span className="text-gray-600">or</span>
                <span className="text-gray-600 font-medium">drag and drop</span>
              </div>

              <input
                id="file-upload"
                type="file"
                multiple
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Supported Formats */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Supported formats:</span>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    CSV
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Excel
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center space-x-2">
              <FileCheck className="w-6 h-6 text-blue-600" />
              <span>Uploaded Files</span>
            </CardTitle>
            <CardDescription>
              {files.length} file{files.length !== 1 ? 's' : ''} ready for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.name} className="flex items-center space-x-4 p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div className="flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black truncate">{file.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      <Badge variant="outline" className="text-xs">
                        {file.type.includes('csv') ? 'CSV' : 'Excel'}
                      </Badge>
                    </div>
                    {uploadStatus[file.name] === 'uploading' && (
                      <div className="mt-3 space-y-2">
                        <Progress value={uploadProgress[file.name]} className="h-2" />
                        <p className="text-xs text-gray-600">
                          Uploading... {uploadProgress[file.name]}%
                        </p>
                      </div>
                    )}
                    {uploadStatus[file.name] === 'success' && uploadResults[file.name] && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-green-600">
                          ✓ {uploadResults[file.name].recordCount || 0} records processed
                        </p>
                        {uploadResults[file.name].missingColumns?.length > 0 && (
                          <p className="text-xs text-amber-600">
                            ⚠ Missing columns: {uploadResults[file.name].missingColumns.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                    {uploadStatus[file.name] === 'error' && uploadErrors[file.name] && (
                      <div className="mt-3">
                        <p className="text-xs text-red-600">
                          ✗ {uploadErrors[file.name]}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {uploadStatus[file.name] === 'success' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                    {uploadStatus[file.name] === 'error' && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.name)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Need a template?</CardTitle>
            <CardDescription>
              Download our sample template to see the expected file format and required columns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full flex items-center space-x-2 p-4 h-auto">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Download Sample Template</div>
                <div className="text-sm text-gray-600">Excel format with sample data</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Quick Start</CardTitle>
            <CardDescription>
              Get started quickly with these helpful resources and tips.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start p-2 h-auto text-left">
              <Activity className="w-4 h-4 mr-3 text-blue-600" />
              <div>
                <div className="font-medium text-sm">View Quick Tutorial</div>
                <div className="text-xs text-gray-600">3-minute getting started guide</div>
              </div>
            </Button>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto text-left">
              <Info className="w-4 h-4 mr-3 text-green-600" />
              <div>
                <div className="font-medium text-sm">Data Format Guide</div>
                <div className="text-xs text-gray-600">Required columns and best practices</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
