'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ email: form.email, password: form.password, fullName: form.fullName, phone: form.phone || undefined });
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Image src="/logo.jpg" alt="Tạp hóa nhà SIN" width={180} height={72} style={{ objectFit: 'contain' }} priority />
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Tạo tài khoản</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>Đăng ký để mua hàng nhanh hơn</p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Họ và tên *</label>
              <input className="form-input" id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input className="form-input" id="email" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Số điện thoại</label>
              <input className="form-input" id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="0912 345 678" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Mật khẩu *</label>
              <input className="form-input" id="password" type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="Ít nhất 6 ký tự" />
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: 'var(--gray-500)' }}>
            Đã có tài khoản?{' '}
            <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
