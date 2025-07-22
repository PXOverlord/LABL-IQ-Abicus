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
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'success' | 'error' }>({});

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

  const handleFileUpload = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setUploadStatus(prevStatus => ({ ...prevStatus, [file.name]: 'success' }));
            return prev;
          }
          return { ...prev, [file.name]: currentProgress + 10 };
        });
      }, 200);
    });
    
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
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'text/csv') return <FileSpreadsheet className="w-6 h-6 text-primary" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FileSpreadsheet className="w-6 h-6 text-accent" />;
    return <File className="w-6 h-6 text-muted-foreground" />;
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
      {/* Upload Instructions - Updated colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-5 w-5 text-primary" />
          <AlertDescription className="text-primary">
            <strong>Data Requirements:</strong> Include origin ZIP, destination ZIP, weight, dimensions, and current shipping costs in your files.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-5 w-5 text-primary" />
          <AlertDescription className="text-primary">
            <strong>Secure Upload:</strong> Your data is encrypted and processed securely. Files are automatically deleted after analysis.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-accent/20 bg-accent/5">
          <Clock className="h-5 w-5 text-accent" />
          <AlertDescription className="text-[rgba(14,18,27,1)]">
            <strong>Fast Processing:</strong> Analysis typically completes in under 3 minutes for files up to 10,000 shipments.
          </AlertDescription>
        </Alert>
      </div>

      {/* Upload Area */}
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-medium flex items-center justify-center space-x-2">
            <CloudUpload className="w-7 h-7 text-primary" />
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
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-border/80 hover:bg-muted/20'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className={`p-6 rounded-xl transition-colors duration-300 ${
                dragActive ? 'bg-primary/10' : 'bg-muted/50'
              }`}>
                <Upload className={`w-12 h-12 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              
              <div className="space-y-2">
                <p className="text-xl font-medium text-foreground">
                  {dragActive ? 'Drop your files here' : 'Drop your files here'}
                </p>
                <p className="text-muted-foreground">
                  Supports CSV and Excel files up to 50MB each
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-[rgba(255,255,255,1)]">Browse Files</span>
                  </label>
                </Button>
                <span className="text-muted-foreground">or</span>
                <span className="text-muted-foreground font-medium">drag and drop</span>
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
              <div className="flex items-center space-x-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Supported formats:</span>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    CSV
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
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
              <FileCheck className="w-6 h-6 text-primary" />
              <span>Uploaded Files</span>
            </CardTitle>
            <CardDescription>
              {files.length} file{files.length !== 1 ? 's' : ''} ready for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.name} className="flex items-center space-x-4 p-6 border border-border rounded-xl hover:border-border/80 transition-colors">
                  <div className="flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      <Badge variant="outline" className="text-xs">
                        {file.type.includes('csv') ? 'CSV' : 'Excel'}
                      </Badge>
                    </div>
                    {uploadStatus[file.name] === 'uploading' && (
                      <div className="mt-3 space-y-2">
                        <Progress value={uploadProgress[file.name]} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {uploadProgress[file.name]}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {uploadStatus[file.name] === 'success' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                    {uploadStatus[file.name] === 'error' && (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.name)}
                      className="hover:bg-destructive/10 hover:text-destructive"
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
                <div className="text-sm text-muted-foreground">Excel format with sample data</div>
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
              <Activity className="w-4 h-4 mr-3 text-primary" />
              <div>
                <div className="font-medium text-sm">View Quick Tutorial</div>
                <div className="text-xs text-muted-foreground">3-minute getting started guide</div>
              </div>
            </Button>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto text-left">
              <Info className="w-4 h-4 mr-3 text-accent" />
              <div>
                <div className="font-medium text-sm">Data Format Guide</div>
                <div className="text-xs text-muted-foreground">Required columns and best practices</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}