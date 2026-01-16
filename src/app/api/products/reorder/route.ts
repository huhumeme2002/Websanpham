import { NextRequest, NextResponse } from 'next/server';
import { reorderProducts } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const { orderedIds } = await request.json();
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 });
    }

    await reorderProducts(orderedIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder products' }, { status: 500 });
  }
}
