'use client';

import { useState } from 'react';
import { analysisAPI } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import toast from 'react-hot-toast';

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const result = await analysisAPI.testUpload(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadResult(result);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Backend Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Upload Test File</h3>
              <p className="text-sm text-gray-600 mb-4">
                This page tests the connection to your backend API without authentication.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select CSV or Excel file:
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {selectedFile && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">
                      <strong>Selected:</strong> {selectedFile.name} 
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload to Backend'}
                </Button>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            </div>

            {uploadResult && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-900 mb-2">Upload Successful!</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p><strong>File:</strong> {uploadResult.fileName}</p>
                  <p><strong>Size:</strong> {(uploadResult.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Rows:</strong> {uploadResult.rowCount}</p>
                  <p><strong>Columns:</strong> {uploadResult.columns.length}</p>
                  <div className="mt-2">
                    <p className="font-medium">Detected Columns:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {uploadResult.columns.map((col: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Backend Status</h4>
              <p className="text-sm text-blue-800">
                Backend URL: <code className="bg-blue-100 px-1 rounded">https://labl-iq-backend.onrender.com</code>
              </p>
              <p className="text-sm text-blue-800 mt-1">
                If the upload works, your backend is running correctly!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 