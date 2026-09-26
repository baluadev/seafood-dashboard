// Vercel Edge Cache Proxy — Reviews by product slug
// ISR: cache 5 phút

import { type NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seafood-api.onrender.com/api/v1';

export const revalidate = 300; // 5 phút

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const res = await fetch(`${API_URL}/reviews/product/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Reviews not found' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
