// Vercel Edge Cache Proxy — Product by slug
// ISR: cache 10 phút

import { type NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seafood-api.onrender.com/api/v1';

export const revalidate = 600; // 10 phút

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const res = await fetch(`${API_URL}/products/slug/${slug}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Product not found' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
