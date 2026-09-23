import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#f3f4f4',
      color: '#191c1d',
      marginTop: '32px',
      fontFamily: 'Roboto, sans-serif',
    }}>

      {/* ---- Newsletter strip ---- */}
      <div style={{ background: '#EBFFD7', padding: '32px 0' }}>
        <div style={{
          width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 40px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px',
        }}>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#244c00', margin: 0 }}>
              Đăng ký nhận thông báo ưu đãi tươi mới
            </h4>
            <p style={{ fontSize: '14px', color: '#486f21', margin: '4px 0 0' }}>
              Nhận voucher 50.000₫ cho đơn hàng thực phẩm đầu tiên của bạn
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#fff', borderRadius: '12px', padding: '4px',
            width: '100%', maxWidth: '420px',
          }}>
            <input
              type="email"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '8px 12px', fontSize: '14px', color: '#191c1d',
                fontFamily: 'Roboto, sans-serif',
              }}
              placeholder="Nhập địa chỉ email của bạn..."
            />
            <button style={{
              background: '#6CC51D', color: '#fff', fontWeight: 600, fontSize: '13px',
              padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              flexShrink: 0, transition: 'background 0.2s',
            }}>
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* ---- Main grid ---- */}
      <div style={{
        width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '40px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '32px',
      }}>

        {/* Col 1 — Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src="/logo.png"
              alt="Tạp hóa SIN"
              width={80}
              height={54}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p style={{ fontSize: '14px', color: '#868889', maxWidth: '280px', lineHeight: 1.6, margin: 0 }}>
            Mua sắm tiện lợi, giao hàng tận nơi — đồng hành cùng bữa cơm gia đình mỗi ngày.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#868889' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>&#127978;</span>
              <span>Trụ sở chính: B.28-11, Tòa nhà Osaka Complex, Hà Nội</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>&#128222;</span>
              <span>0374524983 (07:00 – 21:30 hàng ngày)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>&#9993;</span>
              <span>ngoctam.vinhcity@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Col 2 — Danh mục sản phẩm */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h5 style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', margin: 0 }}>Danh mục sản phẩm</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Sản phẩm nổi bật', 'Tất cả sản phẩm'].map(item => (
              <li key={item}>
                <Link href="/shop" style={{ fontSize: '14px', color: '#868889', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#6CC51D')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#868889')}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Chăm sóc khách hàng */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h5 style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', margin: 0 }}>Chăm sóc khách hàng</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Chính sách bảo đảm chất lượng',
              'Chính sách hoàn tiền 100%',
              'Quy trình kiểm định vệ sinh ATTP',
              'Thời gian giao hàng & Phí ship',
              'Câu hỏi thường gặp (FAQ)',
            ].map(item => (
              <li key={item}>
                <span style={{ fontSize: '14px', color: '#868889', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#6CC51D')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#868889')}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — App store buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h5 style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', margin: 0 }}>Tải ứng dụng di động</h5>
          <p style={{ fontSize: '13px', color: '#868889', margin: 0, lineHeight: 1.5 }}>
            Mua sắm tiện lợi và tích điểm thưởng ngay trên điện thoại.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Google Play */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#F4F5F9', padding: '10px 14px', borderRadius: '12px',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e7e8e9')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F4F5F9')}
            >
              <span style={{ fontSize: '22px' }}>&#9654;</span>
              <div>
                <div style={{ fontSize: '11px', color: '#868889', lineHeight: 1.2 }}>Tải trên</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#191c1d', lineHeight: 1.2 }}>Google Play</div>
              </div>
            </div>
            {/* App Store */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#F4F5F9', padding: '10px 14px', borderRadius: '12px',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e7e8e9')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F4F5F9')}
            >
              <span style={{ fontSize: '22px' }}>&#63743;</span>
              <div>
                <div style={{ fontSize: '11px', color: '#868889', lineHeight: 1.2 }}>Tải trên</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#191c1d', lineHeight: 1.2 }}>App Store</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div style={{
        width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px 40px',
        borderTop: '1px solid #EBEBEB',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px',
        fontSize: '13px', color: '#868889',
      }}>
        <p style={{ margin: 0 }}>© 2026 Tạp hóa nhà SIN</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {['Điều khoản sử dụng', 'Bảo mật thông tin', 'Sitemap'].map(item => (
            <span key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6CC51D')}
              onMouseLeave={e => (e.currentTarget.style.color = '#868889')}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
