import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seafood-api.onrender.com/api/v1';

export const revalidate = 30; // ISR: cache 30s

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/orders/recent-public?limit=10`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    });
  } catch {
    // Return empty array on error — toast will use fallback
    return NextResponse.json([], {
      headers: { 'Cache-Control': 's-maxage=10' },
    });
  }
}
