import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full h-96 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center overflow-hidden
        ${isDragging 
          ? 'border-nikki-accent bg-nikki-accent/5' 
          : 'border-gray-700 bg-nikki-panel hover:border-gray-500 hover:bg-gray-800'
        }
      `}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      
      <div className="flex flex-col items-center p-6 text-center space-y-4">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-nikki-accent text-nikki-black' : 'bg-gray-800 text-gray-400'}`}>
          {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Upload an image to start</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Drag and drop or click to upload. <br/> Supports PNG, JPG, WebP.
          </p>
        </div>
      </div>
    </div>
  );
};
