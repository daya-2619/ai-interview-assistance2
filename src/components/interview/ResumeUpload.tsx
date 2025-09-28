import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { simulateResumeExtraction, ExtractedData } from '../../utils/resumeParser';

interface ResumeUploadProps {
  onResumeProcessed: (fileName: string, extractedData: ExtractedData) => void;
}

export function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    
    processFile(file);
  };

  const processFile = async (file: File) => {
    setUploading(true);
    
    // Simulate file processing delay
    setTimeout(() => {
      const extractedData = simulateResumeExtraction();
      onResumeProcessed(file.name, extractedData);
      setUploading(false);
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto">
              <FileText size={48} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Processing Resume...</h3>
              <p className="text-gray-600">Extracting your information</p>
            </div>
          </div>
        ) : (
          <>
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your PDF or DOCX file here, or click to select
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
            >
              Choose File
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: PDF, DOCX (Max 10MB)
            </p>
          </>
        )}
      </div>
      
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="text-blue-500 mt-0.5" size={16} />
          <div className="text-sm">
            <p className="font-medium text-blue-900">What happens next?</p>
            <p className="text-blue-700">We&apos;ll extract your name, email, and phone number from your resume. If any information is missing, we&apos;ll ask you to provide it before starting the interview.</p>
          </div>
        </div>
      </div>
    </div>
  );
}