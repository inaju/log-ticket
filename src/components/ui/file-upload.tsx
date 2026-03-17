"use client";

import { useCallback, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({
  onFilesChange,
  accept = ".png,.jpg,.jpeg,.pdf",
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const valid = Array.from(newFiles).filter((f) => f.size <= maxSize);
      const updated = [...files, ...valid];
      setFiles(updated);
      onFilesChange(updated);
    },
    [files, maxSize, onFilesChange]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
        Attachments
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <ImagePlus className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            Upload a file
            <input
              type="file"
              className="hidden"
              accept={accept}
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
