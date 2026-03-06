'use client';

import { useState, useCallback } from 'react';
import { Upload, X, File, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface FileData {
  name: string;
  type: string;
  size: number;
  base64Content: string;
}

interface DocumentUploadFormProps {
  onFilesChange: (files: FileData[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const DocumentUploadForm = ({ onFilesChange }: DocumentUploadFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type);
      if (!isValidType) {
        toast.error(`${file.name} is not a valid document file. Please upload PDF or Word documents only.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 10MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsReading(true);
    try {
      const fileDataArray: FileData[] = await Promise.all(
        validFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          base64Content: await readFileAsBase64(file),
        }))
      );

      setFiles(validFiles);
      onFilesChange(fileDataArray);
      toast.success('Documents uploaded successfully!');
    } catch {
      toast.error('Failed to read one or more files.');
    } finally {
      setIsReading(false);
    }
  }, [onFilesChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    processFiles(selectedFiles);
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      if (newFiles.length === 0) {
        onFilesChange([]);
      } else {
        Promise.all(
          newFiles.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            base64Content: await readFileAsBase64(file),
          }))
        ).then(onFilesChange);
      }
      return newFiles;
    });
    toast.success('Document removed');
  }, [onFilesChange]);

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all"
        style={{
          borderColor: isDragging ? 'var(--accent)' : 'var(--border)',
          background: isDragging ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
        }}
      >
        <input
          type="file"
          id="fileInput"
          multiple
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileSelect}
        />
        <label htmlFor="fileInput" className="flex flex-col items-center justify-center gap-3 cursor-pointer">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent) 15%, transparent)' }}
          >
            <Upload className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div className="text-center">
            {isReading ? (
              <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Reading files...</span>
            ) : isDragging ? (
              <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Drop your documents here</span>
            ) : (
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Drag & drop your documents here or{' '}
                <span className="font-medium" style={{ color: 'var(--accent)' }}>browse</span>
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Supports: PDF, DOC, DOCX (max 10MB each)
          </p>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3.5 rounded-xl"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <File className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#5C8A6E' }} />
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-lg transition-colors btn-ghost"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadForm;
