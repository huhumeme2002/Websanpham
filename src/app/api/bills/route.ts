import { NextRequest, NextResponse } from 'next/server';
import { getBills, addBill } from '@/lib/data';

export async function GET() {
  try {
    const bills = await getBills();
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, description } = await request.json();
    const bill = await addBill(imageUrl, description);
    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error adding bill:', error);
    return NextResponse.json({ error: 'Failed to add bill' }, { status: 500 });
  }
}
