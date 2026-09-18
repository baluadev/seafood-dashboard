import Link from 'next/link';

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🦐</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>
                Sea<span style={{ color: 'var(--primary)' }}>Shop</span>
              </span>
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
              <li>📍 TP. Hồ Chí Minh</li>
              <li>📞 0912 345 678</li>
              <li>✉️ hello@seashop.vn</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem' }}>
          © 2026 SeaShop. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
