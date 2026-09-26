// Vercel Edge Cache Proxy — Categories
// ISR: cache 30 phút, serve stale while revalidating

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seafood-api.onrender.com/api/v1';

export const revalidate = 1800; // 30 phút

export async function GET() {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch categories' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
