'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Bill } from '@/lib/types';
import { Plus, Trash2, Image as ImageIcon, Upload, Link, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

interface BillManagerProps {
  bills: Bill[];
  onAdd: (imageUrl: string, description?: string) => void;
  onDelete: (id: string) => void;
}

interface UploadStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export function BillManager({ bills, onAdd, onDelete }: BillManagerProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Bill | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploadQueue, setUploadQueue] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Initialize upload queue
    const queue: UploadStatus[] = files.map(file => ({
      file,
      status: 'pending'
    }));
    setUploadQueue(queue);
    setIsUploading(true);

    // Upload files one by one
    for (let i = 0; i < queue.length; i++) {
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'uploading' } : item
      ));

      try {
        const formData = new FormData();
        formData.append('file', queue[i].file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        // Success - add to bills
        onAdd(data.url, description.trim() || undefined);
        
        setUploadQueue(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'success', url: data.url } : item
        ));
      } catch (err) {
        setUploadQueue(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' } : item
        ));
      }
    }

    setIsUploading(false);
    setDescription('');
    
    // Clear queue after 3 seconds
    setTimeout(() => {
      setUploadQueue([]);
    }, 3000);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onAdd(imageUrl.trim(), description.trim() || undefined);
      setImageUrl('');
      setDescription('');
    }
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const successCount = uploadQueue.filter(u => u.status === 'success').length;
  const errorCount = uploadQueue.filter(u => u.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Quản lý Bill/Hóa đơn</h2>
      </div>

      {/* Add new bill form */}
      <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
        <CardContent className="pt-6 space-y-4">
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
              Upload ảnh
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
              Nhập URL
            </Button>
          </div>

          {/* Description field */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Mô tả (tùy chọn)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Giao dịch OpenAI"
              className="bg-[#0a0a0f] border-[#2a2a3e] text-white"
            />
          </div>

          {/* Upload mode */}
          {mode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFilesSelect}
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
                    Đang upload {successCount}/{uploadQueue.length}...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Chọn nhiều ảnh bill từ máy tính
                  </>
                )}
              </Button>
              <p className="text-xs text-[#a0a0b0] mt-1">JPEG, PNG, GIF, WEBP. Tối đa 5MB mỗi ảnh. Có thể chọn nhiều ảnh cùng lúc.</p>
              
              {/* Upload progress */}
              {uploadQueue.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadQueue.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {item.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border-2 border-[#a0a0b0]" />
                      )}
                      {item.status === 'uploading' && (
                        <Loader2 className="w-4 h-4 animate-spin text-[#00d4ff]" />
                      )}
                      {item.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                      )}
                      {item.status === 'error' && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={
                        item.status === 'success' ? 'text-[#00ff88]' :
                        item.status === 'error' ? 'text-red-400' :
                        'text-[#a0a0b0]'
                      }>
                        {item.file.name}
                        {item.error && ` - ${item.error}`}
                      </span>
                    </div>
                  ))}
                  {!isUploading && (
                    <p className="text-sm text-[#00ff88]">
                      ✓ Hoàn thành: {successCount} thành công{errorCount > 0 && `, ${errorCount} lỗi`}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* URL mode */}
          {mode === 'url' && (
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-1">URL hình ảnh *</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/bill.jpg"
                  required
                  className="bg-[#0a0a0f] border-[#2a2a3e] text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bill
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Bills grid */}
      {bills.length === 0 ? (
        <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
          <CardContent className="py-8 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-[#a0a0b0] mb-3" />
            <p className="text-[#a0a0b0]">Chưa có bill nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bills.map((bill) => (
            <Card key={bill.id} className="bg-[#1a1a2e] border-[#2a2a3e] overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <Image
                  src={bill.imageUrl}
                  alt={bill.description || 'Bill'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Overlay with delete button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteConfirm(bill)}
                    className="border-red-500 bg-red-500/20 hover:bg-red-500 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {bill.description && (
                <CardContent className="py-2">
                  <p className="text-xs text-[#a0a0b0] truncate">{bill.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-[#1a1a2e] border-[#2a2a3e]">
          <DialogHeader>
            <DialogTitle className="text-white">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-[#a0a0b0]">
              Bạn có chắc muốn xóa bill này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="border-[#2a2a3e] hover:bg-[#2a2a3e]"
            >
              Hủy
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
