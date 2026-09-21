import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--gray-900)',
      color: 'var(--gray-400)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <Image src="/logo.jpg" alt="Tạp hóa nhà SIN" width={140} height={56} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Hải sản tươi ngon mỗi ngày — trực tiếp từ ngư dân đến bàn ăn của bạn.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.875rem' }}>Sản phẩm</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link href="/shop?isHot=true" style={{ transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = '')}>Sản phẩm nổi bật</Link></li>
              <li><Link href="/shop">Tất cả sản phẩm</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.875rem' }}>Tài khoản</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link href="/auth/login">Đăng nhập</Link></li>
              <li><Link href="/auth/register">Đăng ký</Link></li>
              <li><Link href="/orders">Đơn hàng của tôi</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.875rem' }}>Liên hệ</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>📍 TP. Hà Nội</li>
              <li>📞 0374524983</li>
              <li>✉️ ngoctam.vinhcity@gmail.com</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem' }}>
          © 2026 Tạp hóa nhà SIN. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
