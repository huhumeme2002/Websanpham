'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Ảnh' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-[#a0a0b0]">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[#0a0a0f] border border-[#2a2a3e]">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 border-none hover:bg-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className={mode === 'upload' 
            ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]' 
            : 'border-[#2a2a3e] hover:bg-[#2a2a3e]'
          }
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className={mode === 'url' 
            ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]' 
            : 'border-[#2a2a3e] hover:bg-[#2a2a3e]'
          }
        >
          <Link className="w-4 h-4 mr-1" />
          URL
        </Button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full border-[#2a2a3e] border-dashed hover:bg-[#2a2a3e] h-20"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang upload...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 mr-2" />
                Chọn ảnh từ máy tính
              </>
            )}
          </Button>
          <p className="text-xs text-[#a0a0b0] mt-1">JPEG, PNG, GIF, WEBP. Tối đa 5MB</p>
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bg-[#0a0a0f] border-[#2a2a3e] text-white"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            className="bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-[#0a0a0f]"
          >
            OK
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
