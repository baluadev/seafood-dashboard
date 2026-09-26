// Vercel Edge Cache Proxy — Sliders
// ISR: cache 15 phút

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seafood-api.onrender.com/api/v1';

export const revalidate = 900; // 15 phút

export async function GET() {
  const res = await fetch(`${API_URL}/sliders`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch sliders' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
