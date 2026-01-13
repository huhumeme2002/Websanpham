'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Product, ProductInput } from '@/lib/types';
import { ProductForm } from './product-form';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onAdd: (data: ProductInput) => void;
  onUpdate: (id: string, data: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

export function ProductManager({ products, onAdd, onUpdate, onDelete }: ProductManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const handleAdd = (data: ProductInput) => {
    onAdd(data);
    setShowForm(false);
  };

  const handleEdit = (data: ProductInput) => {
    if (editingProduct) {
      onUpdate(editingProduct.id, data);
      setEditingProduct(null);
    }
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (showForm) {
    return (
      <ProductForm
        onSubmit={handleAdd}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={handleEdit}
        onCancel={() => setEditingProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Quản lý sản phẩm</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
          <CardContent className="py-8 text-center">
            <p className="text-[#a0a0b0]">Chưa có sản phẩm nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="bg-[#1a1a2e] border-[#2a2a3e]">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      {product.tag && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[#00d4ff]/20 text-[#00d4ff]">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[#00ff88] font-bold mt-1">
                      {product.pricingTiers.length > 1 
                        ? `${formatPrice(Math.min(...product.pricingTiers.map(t => t.price)))} - ${formatPrice(Math.max(...product.pricingTiers.map(t => t.price)))}`
                        : formatPrice(product.pricingTiers[0]?.price || 0)
                      }
                    </p>
                    <p className="text-xs text-[#a0a0b0] mt-1">{product.pricingTiers.length} gói giá</p>
                    <p className="text-sm text-[#a0a0b0] mt-1 line-clamp-1">{product.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingProduct(product)}
                      className="border-[#2a2a3e] hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteConfirm(product)}
                      className="border-[#2a2a3e] hover:bg-red-500/20 hover:border-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
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
              Bạn có chắc muốn xóa sản phẩm "{deleteConfirm?.name}"? Hành động này không thể hoàn tác.
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
