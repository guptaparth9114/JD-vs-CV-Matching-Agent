import React, { useCallback, useState } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { UploadProgress } from "../types/matching";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes: string;
  multiple?: boolean;
  title: string;
  description: string;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptedTypes,
  multiple = false,
  title,
  description,
  maxFiles = 10,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

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

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isValidType = acceptedTypes
        .split(",")
        .some(
          (type) =>
            file.type === type.trim() ||
            file.name.toLowerCase().endsWith(type.trim().replace("*", ""))
        );
      return isValidType && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length > maxFiles) {
      validFiles.splice(maxFiles);
    }

    setSelectedFiles((prev) =>
      multiple ? [...prev, ...validFiles] : validFiles
    );

    // Simulate upload progress
    const progress: UploadProgress[] = validFiles.map((file) => ({
      fileName: file.name,
      status: "uploading",
      progress: 0,
    }));

    setUploadProgress(progress);

    // Simulate processing
    validFiles.forEach((file, index) => {
      setTimeout(() => {
        setUploadProgress((prev) =>
          prev.map((p, i) =>
            i === index ? { ...p, status: "completed", progress: 100 } : p
          )
        );
      }, 1000 + index * 500);
    });

    onFilesSelected(validFiles);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <p className="text-xs text-gray-500">
          Supported formats: PDF, DOCX • Max size: 10MB{" "}
          {multiple && `• Max files: ${maxFiles}`}
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected Files:</h4>
          {selectedFiles.map((file, index) => {
            const progress = uploadProgress[index];
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {progress && (
                    <div className="flex items-center space-x-2">
                      {progress.status === "uploading" && (
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      )}
                      {progress.status === "completed" && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Ready
                        </span>
                      )}
                      {progress.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
