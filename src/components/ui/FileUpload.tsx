import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Attachment } from '../../types';
import { formatFileSize, getFileIcon } from '../../utils/fileUtils';
import { Button } from './Button';

interface FileUploadProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length && attachments.length + newAttachments.length < maxFiles; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          newAttachments.push({
            id: Date.now().toString() + i,
            name: file.name,
            type: file.type,
            size: file.size,
            url: reader.result as string,
            file: file
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    onAttachmentsChange([...attachments, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
        <Button
          onClick={handleFileSelect}
          variant="secondary"
          size="sm"
          icon={Upload}
          disabled={attachments.length >= maxFiles}
        >
          Add Files
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />

      {attachments.length === 0 ? (
        <div 
          onClick={handleFileSelect}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Click to upload files or drag and drop</p>
          <p className="text-sm text-gray-500 mt-2">Supports all file types</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">{getFileIcon(attachment.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {attachments.length > 0 && attachments.length < maxFiles && (
        <Button
          onClick={handleFileSelect}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          Add More Files ({attachments.length}/{maxFiles})
        </Button>
      )}
    </div>
  );
};