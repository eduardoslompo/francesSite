
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { parseCSV, parseJSON } from '@/lib/fileUtils';
import { Question, Category } from '@/types/quiz';
import { bulkAddQuestions, bulkAddCategories } from '@/lib/quizService';

interface FileUploaderProps {
  onUploadSuccess: () => void;
  type: 'questions' | 'categories';
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, type }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          let data;
          
          if (file.name.endsWith('.json')) {
            data = parseJSON(content);
          } else if (file.name.endsWith('.csv')) {
            data = parseCSV(content);
          } else {
            toast.error("Formato de arquivo não suportado. Use JSON ou CSV.");
            setIsUploading(false);
            return;
          }
          
          if (type === 'questions') {
            await bulkAddQuestions(data as Omit<Question, "id">[]);
            toast.success(`${data.length} questões importadas com sucesso!`);
          } else {
            await bulkAddCategories(data as Omit<Category, "id">[]);
            toast.success(`${data.length} categorias importadas com sucesso!`);
          }
          
          onUploadSuccess();
        } catch (error: any) {
          toast.error(`Erro ao processar arquivo: ${error.message}`);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast.error(`Erro ao ler arquivo: ${error.message}`);
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging ? 'border-french-blue bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-french-lightGray p-4 rounded-full">
          <Upload className="h-8 w-8 text-french-blue" />
        </div>
        <div className="text-center">
          <p className="text-french-dark font-medium">
            {isUploading ? 'Processando...' : 'Arraste um arquivo ou clique para fazer upload'}
          </p>
          <p className="text-french-gray text-sm mt-1">
            Suporta arquivos JSON e CSV
          </p>
        </div>
        
        <div className="flex gap-4 mt-2">
          <div className="flex items-center border rounded px-3 py-1 text-sm text-french-gray">
            <FileJson className="h-4 w-4 mr-1" />
            <span>JSON</span>
          </div>
          <div className="flex items-center border rounded px-3 py-1 text-sm text-french-gray">
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            <span>CSV</span>
          </div>
        </div>
        
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept=".json,.csv"
          disabled={isUploading}
        />
        
        <button 
          className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? 'Processando...' : 'Selecionar arquivo'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
