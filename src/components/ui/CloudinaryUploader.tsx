import { useCallback, useMemo, useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";

interface CloudinaryUploaderProps {
  multiple?: boolean;
  existing?: string[];
  onFilesChange: (files: File[]) => void;
  buttonLabel?: string;
  disabled?: boolean;
  max?: number;
}

export interface CloudinaryUploaderRef {
  uploadFiles: () => Promise<string[]>;
}

export const CloudinaryUploader = forwardRef<CloudinaryUploaderRef, CloudinaryUploaderProps>(({
  multiple = true,
  onFilesChange,
  buttonLabel = "Select Images",
  disabled = false,
  max,
}, ref) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const remainingSlots = useMemo(() => {
    if (!max) return undefined;
    return Math.max(0, max - selectedFiles.length);
  }, [max, selectedFiles.length]);

  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFilesSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (!filesList || filesList.length === 0) {
        // Always reset value to allow re-selecting the same file
        e.target.value = "";
        return;
      }

      const files = Array.from(filesList).slice(0, remainingSlots ?? filesList.length);

      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      const newFiles = multiple ? [...selectedFiles, ...files] : files;
      const combinedPreviewUrls = multiple ? [...previewUrls, ...newPreviewUrls] : newPreviewUrls;

      setSelectedFiles(newFiles);
      setPreviewUrls(combinedPreviewUrls);
      onFilesChange(newFiles);

      // Reset the input so selecting the same file again will trigger onChange
      e.target.value = "";
    },
    [multiple, onFilesChange, selectedFiles, remainingSlots, previewUrls]
  );

  const removeFile = useCallback(
    (idx: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== idx);
      const newPreviewUrls = previewUrls.filter((_, i) => i !== idx);
      
      // Revoke the removed URL
      if (previewUrls[idx]) URL.revokeObjectURL(previewUrls[idx]);
      
      setSelectedFiles(newFiles);
      setPreviewUrls(newPreviewUrls);
      onFilesChange(newFiles);
    },
    [selectedFiles, previewUrls, onFilesChange]
  );

  // Upload files to Cloudinary and return secure URLs
  const uploadFiles = useCallback(async (): Promise<string[]> => {
    const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    const uploadPreset = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary env vars missing: VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET");
    }

    const uploadedUrls: string[] = [];
    
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Cloudinary upload failed");
      }
      
      const data = await res.json();
      if (data?.secure_url) {
        uploadedUrls.push(data.secure_url as string);
      }
    }
    
    return uploadedUrls;
  }, [selectedFiles]);

  // Expose upload function via ref
  useImperativeHandle(ref, () => ({
    uploadFiles,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className={`px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            disabled={disabled || (remainingSlots !== undefined && remainingSlots <= 0)}
            className="hidden"
            onChange={handleFilesSelected}
          />
          {buttonLabel}
        </label>
        {typeof remainingSlots === 'number' && (
          <span className="text-sm text-gray-500">Remaining: {remainingSlots}</span>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {selectedFiles.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="relative group">
              <div className="w-full aspect-square bg-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
                <img 
                  src={previewUrls[idx]} 
                  alt={`Preview ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                  style={{ aspectRatio: '1/1' }} 
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CloudinaryUploader.displayName = 'CloudinaryUploader';

export default CloudinaryUploader;


