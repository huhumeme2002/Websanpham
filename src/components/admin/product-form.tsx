'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, ProductInput, PricingTier } from '@/lib/types';
import { ImageUpload } from './image-upload';
import { X, Plus } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
}

const ICON_OPTIONS = ['Brain', 'Code', 'Github', 'Sparkles', 'Zap', 'Bot', 'Cpu', 'Database'];
const TAG_OPTIONS = ['', 'Best Seller', 'Hot', 'New', 'Sale'];
const DURATION_PRESETS = ['1 ngày', '3 ngày', '7 ngày', '2 tuần', '1 tháng', '3 tháng', '1 năm', 'Basic', 'Pro', 'Ultimate'];
const REQUEST_PRESETS = ['Vô Hạn', '500 Request', '1000 Request', '5000 Request', '10$', '20$', '50$'];

const defaultTier: PricingTier = { duration: '1 tháng', requestLimit: 'Vô Hạn', price: 0 };

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || '',
    description: product?.description || '',
    pricingTiers: product?.pricingTiers?.length ? product.pricingTiers : [{ ...defaultTier }],
    currency: product?.currency || 'VND',
    icon: product?.icon || 'Brain',
    imageUrl: product?.imageUrl || '',
    features: product?.features || [''],
    tag: product?.tag,
    contactLink: product?.contactLink || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty features and tiers with 0 price
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      pricingTiers: formData.pricingTiers.filter(t => t.price > 0),
      tag: formData.tag || undefined,
      imageUrl: formData.imageUrl?.trim() || undefined,
    };
    if (cleanedData.pricingTiers.length === 0) {
      alert('Vui lòng thêm ít nhất 1 gói giá!');
      return;
    }
    onSubmit(cleanedData);
  };

  // Pricing tier handlers
  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, { ...defaultTier }],
    }));
  };

  const removeTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, i) => i !== index),
    }));
  };

  const updateTier = (index: number, field: keyof PricingTier, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((t, i) => 
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  };

  // Feature handlers
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  return (
    <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
      <CardHeader>
        <CardTitle className="text-white">
          {product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Tên sản phẩm *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="VD: Cursor Vô Hạn Request"
              required
              className="bg-[#0a0a0f] border-[#2a2a3e] text-white"
            />
          </div>

          {/* Pricing Tiers */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-2">Bảng giá *</label>
            <div className="space-y-3">
              {formData.pricingTiers.map((tier, index) => (
                <div key={index} className="p-3 bg-[#0a0a0f] rounded-lg border border-[#2a2a3e]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#00d4ff]">Gói {index + 1}</span>
                    {formData.pricingTiers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTier(index)}
                        className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-[#a0a0b0] mb-1">Thời hạn</label>
                      <select
                        value={tier.duration}
                        onChange={(e) => updateTier(index, 'duration', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm bg-[#1a1a2e] border border-[#2a2a3e] rounded text-white"
                      >
                        {DURATION_PRESETS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#a0a0b0] mb-1">Request</label>
                      <Input
                        value={tier.requestLimit}
                        onChange={(e) => updateTier(index, 'requestLimit', e.target.value)}
                        placeholder="Vô Hạn"
                        list={`request-list-${index}`}
                        className="h-8 text-sm bg-[#1a1a2e] border-[#2a2a3e] text-white"
                      />
                      <datalist id={`request-list-${index}`}>
                        {REQUEST_PRESETS.map(r => (
                          <option key={r} value={r} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs text-[#a0a0b0] mb-1">Giá (VND)</label>
                      <Input
                        type="number"
                        value={tier.price || ''}
                        onChange={(e) => updateTier(index, 'price', Number(e.target.value))}
                        placeholder="100000"
                        min={0}
                        className="h-8 text-sm bg-[#1a1a2e] border-[#2a2a3e] text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTier}
                className="w-full border-[#2a2a3e] hover:bg-[#2a2a3e] border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm gói giá
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Ghi chú / Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="VD: Sử dụng được model Claude 4.5 Sonnet, Gpt 5.1..."
              rows={2}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3e] rounded-md text-white placeholder:text-[#a0a0b0] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            />
          </div>

          {/* Image URL */}
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            label="Ảnh sản phẩm (tùy chọn)"
          />

          {/* Icon */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Icon (hiển thị nếu không có ảnh)</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3e] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            >
              {ICON_OPTIONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Tag (tùy chọn)</label>
            <select
              value={formData.tag || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value || undefined }))}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3e] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            >
              {TAG_OPTIONS.map(tag => (
                <option key={tag} value={tag}>{tag || 'Không có'}</option>
              ))}
            </select>
          </div>

          {/* Contact Link */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Link liên hệ (Zalo/Messenger) *</label>
            <Input
              value={formData.contactLink}
              onChange={(e) => setFormData(prev => ({ ...prev, contactLink: e.target.value }))}
              placeholder="https://zalo.me/0123456789"
              required
              className="bg-[#0a0a0f] border-[#2a2a3e] text-white"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm text-[#a0a0b0] mb-1">Tính năng nổi bật</label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Tính năng ${index + 1}`}
                    className="bg-[#0a0a0f] border-[#2a2a3e] text-white"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      className="border-[#2a2a3e] hover:bg-red-500/20 hover:border-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="w-full border-[#2a2a3e] hover:bg-[#2a2a3e]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm tính năng
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-[#2a2a3e] hover:bg-[#2a2a3e]"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold"
            >
              {product ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
