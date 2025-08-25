import { Attachment } from '../types';
import { generateId } from './storage';

export const handleFileUpload = (files: FileList): Promise<Attachment[]> => {
  return Promise.all(
    Array.from(files).map(file => {
      return new Promise<Attachment>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: generateId(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: reader.result as string,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    })
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('doc')) return '📝';
  if (type.includes('excel') || type.includes('sheet')) return '📊';
  if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
  if (type.includes('zip') || type.includes('rar')) return '🗜️';
  return '📎';
};

export const downloadFile = (attachment: Attachment): void => {
  const link = document.createElement('a');
  link.href = attachment.url;
  link.download = attachment.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};