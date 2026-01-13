import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data';
import { ProductInput } from '@/lib/types';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ProductInput = await request.json();
    const product = await addProduct(data);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
