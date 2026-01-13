import { NextRequest, NextResponse } from 'next/server';
import { deleteBill } from '@/lib/data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBill(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
}
