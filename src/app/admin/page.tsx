'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthGate } from '@/components/admin/auth-gate';
import { ProductManager } from '@/components/admin/product-manager';
import { BillManager } from '@/components/admin/bill-manager';
import { Product, Bill, ProductInput } from '@/lib/types';
import { Package, Receipt, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, billsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/bills'),
      ]);
      const [productsData, billsData] = await Promise.all([
        productsRes.json(),
        billsRes.json(),
      ]);
      setProducts(productsData);
      setBills(billsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Product handlers
  const handleAddProduct = async (data: ProductInput) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts(prev => [...prev, newProduct]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleReorderProducts = async (orderedIds: string[]) => {
    // Optimistic update
    const reordered = orderedIds.map(id => products.find(p => p.id === id)!).filter(Boolean);
    setProducts(reordered);
    
    try {
      await fetch('/api/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (error) {
      console.error('Error reordering products:', error);
      loadData(); // Reload on error
    }
  };

  // Bill handlers
  const handleAddBill = async (imageUrl: string, description?: string) => {
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, description }),
      });
      if (res.ok) {
        const newBill = await res.json();
        setBills(prev => [...prev, newBill]);
      }
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      const res = await fetch(`/api/bills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBills(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="border-b border-[#2a2a3e] px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <Link 
              href="/"
              className="flex items-center gap-2 text-[#a0a0b0] hover:text-[#00d4ff] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Xem trang chủ</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
            </div>
          ) : (
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="bg-[#1a1a2e] border border-[#2a2a3e] mb-6">
                <TabsTrigger 
                  value="products"
                  className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff]"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Sản phẩm ({products.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="bills"
                  className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff]"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Bills ({bills.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <ProductManager
                  products={products}
                  onAdd={handleAddProduct}
                  onUpdate={handleUpdateProduct}
                  onDelete={handleDeleteProduct}
                  onReorder={handleReorderProducts}
                />
              </TabsContent>

              <TabsContent value="bills">
                <BillManager
                  bills={bills}
                  onAdd={handleAddBill}
                  onDelete={handleDeleteBill}
                />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </AuthGate>
  );
}
