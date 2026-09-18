'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/');
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🦐</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--gray-900)' }}>Sea<span style={{ color: 'var(--primary)' }}>Shop</span></span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Đăng nhập</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>Chào mừng bạn trở lại!</p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input className="form-input" id="email" type="email" name="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Mật khẩu</label>
              <input className="form-input" id="password" type="password" name="password" required autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: 'var(--gray-500)' }}>
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
