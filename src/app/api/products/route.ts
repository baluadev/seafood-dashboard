// Vercel Edge Cache Proxy — Products listing
// ISR: cache 5 phút, forwards query params

import { type NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seafood-api.onrender.com/api/v1';

export const revalidate = 300; // 5 phút

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/products${searchParams ? '?' + searchParams : ''}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch products' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
