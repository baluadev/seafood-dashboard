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
      <div style={{ background: '#EBFFD7' }}>
        <div className="page-wrap footer-newsletter">
          <div>
            <h4 style={{ fontSize: 'clamp(15px,2.5vw,18px)', fontWeight: 700, color: '#244c00', margin: 0 }}>
              Đăng ký nhận thông báo ưu đãi tươi mới
            </h4>
            <p style={{ fontSize: '14px', color: '#486f21', margin: '4px 0 0' }}>
              Nhận voucher 50.000₫ cho đơn hàng thực phẩm đầu tiên của bạn
            </p>
          </div>
          <div className="newsletter-row">
            <input
              type="email"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '8px 12px', fontSize: '14px', color: '#191c1d',
                fontFamily: 'Roboto, sans-serif',
              }}
              placeholder="Nhập địa chỉ email..."
            />
            <button style={{
              background: '#6CC51D', color: '#fff', fontWeight: 600, fontSize: '13px',
              padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              flexShrink: 0, transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}>
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* ---- Main grid ---- */}
      <div className="page-wrap footer-grid">

        {/* Col 1 — Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src="/logo.png"
              alt="Tạp hóa SIN"
              width={110}
              height={73}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p style={{ fontSize: '14px', color: '#868889', maxWidth: '280px', lineHeight: 1.6, margin: 0 }}>
            Mua sắm tiện lợi, giao hàng tận nơi — đồng hành cùng bữa cơm gia đình mỗi ngày.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#868889' }}>
            {/* Location icon from Figma */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ flexShrink: 0, marginTop: '1px', display: 'flex' }}>
                <svg width="15.07" height="13.5" viewBox="0 0 15.0704 13.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.2852 6.0375V12C14.2852 12.4125 14.1383 12.7656 13.8446 13.0594C13.5508 13.3531 13.1977 13.5 12.7852 13.5H2.2852C1.8727 13.5 1.51958 13.3531 1.22583 13.0594C0.932079 12.7656 0.785204 12.4125 0.785204 12V6.0375C0.497704 5.775 0.275829 5.4375 0.119579 5.025C-0.0366709 4.6125 -0.0397959 4.1625 0.110204 3.675L0.897704 1.125C0.997704 0.8 1.17583 0.53125 1.43208 0.31875C1.68833 0.10625 1.9852 0 2.3227 0H12.7477C13.0852 0 13.379 0.103125 13.629 0.309375C13.879 0.515625 14.0602 0.7875 14.1727 1.125L14.9602 3.675C15.1102 4.1625 15.1071 4.60625 14.9508 5.00625C14.7946 5.40625 14.5727 5.75 14.2852 6.0375ZM9.1852 5.25C9.5227 5.25 9.77895 5.13437 9.95395 4.90312C10.129 4.67187 10.1977 4.4125 10.1602 4.125L9.7477 1.5H8.2852V4.275C8.2852 4.5375 8.3727 4.76562 8.5477 4.95937C8.7227 5.15312 8.9352 5.25 9.1852 5.25ZM5.8102 5.25C6.0977 5.25 6.33208 5.15312 6.51333 4.95937C6.69458 4.76562 6.7852 4.5375 6.7852 4.275V1.5H5.3227L4.9102 4.125C4.8602 4.425 4.92583 4.6875 5.10708 4.9125C5.28833 5.1375 5.5227 5.25 5.8102 5.25ZM2.4727 5.25C2.6977 5.25 2.89458 5.16875 3.06333 5.00625C3.23208 4.84375 3.3352 4.6375 3.3727 4.3875L3.7852 1.5H2.3227L1.5727 4.0125C1.4977 4.2625 1.53833 4.53125 1.69458 4.81875C1.85083 5.10625 2.1102 5.25 2.4727 5.25ZM12.5977 5.25C12.9602 5.25 13.2227 5.10625 13.3852 4.81875C13.5477 4.53125 13.5852 4.2625 13.4977 4.0125L12.7102 1.5H11.2852L11.6977 4.3875C11.7352 4.6375 11.8383 4.84375 12.0071 5.00625C12.1758 5.16875 12.3727 5.25 12.5977 5.25ZM2.2852 12H12.7852V6.7125C12.7227 6.7375 12.6821 6.75 12.6633 6.75C12.6446 6.75 12.6227 6.75 12.5977 6.75C12.2602 6.75 11.9633 6.69375 11.7071 6.58125C11.4508 6.46875 11.1977 6.2875 10.9477 6.0375C10.7227 6.2625 10.4665 6.4375 10.179 6.5625C9.89145 6.6875 9.5852 6.75 9.2602 6.75C8.9227 6.75 8.60708 6.6875 8.31333 6.5625C8.01958 6.4375 7.7602 6.2625 7.5352 6.0375C7.3227 6.2625 7.07583 6.4375 6.79458 6.5625C6.51333 6.6875 6.2102 6.75 5.8852 6.75C5.5227 6.75 5.19458 6.6875 4.90083 6.5625C4.60708 6.4375 4.3477 6.2625 4.1227 6.0375C3.8602 6.3 3.60083 6.48437 3.34458 6.59062C3.08833 6.69687 2.7977 6.75 2.4727 6.75C2.4477 6.75 2.41958 6.75 2.38833 6.75C2.35708 6.75 2.3227 6.7375 2.2852 6.7125V12Z" fill="#356B00"/>
                </svg>
              </span>
              <span>Trụ sở chính: B.28-11, Tòa nhà Osaka Complex, Hà Nội</span>
            </div>
            {/* Phone icon from Figma */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ flexShrink: 0, display: 'flex' }}>
                <svg width="13.5" height="13.5" viewBox="0 0 13.5 13.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.7125 13.5C11.15 13.5 9.60625 13.1594 8.08125 12.4781C6.55625 11.7969 5.16875 10.8313 3.91875 9.58125C2.66875 8.33125 1.70312 6.94375 1.02188 5.41875C0.340625 3.89375 0 2.35 0 0.7875C0 0.5625 0.075 0.375 0.225 0.225C0.375 0.075 0.5625 0 0.7875 0H3.825C4 0 4.15625 0.059375 4.29375 0.178125C4.43125 0.296875 4.5125 0.4375 4.5375 0.6L5.025 3.225C5.05 3.425 5.04375 3.59375 5.00625 3.73125C4.96875 3.86875 4.9 3.9875 4.8 4.0875L2.98125 5.925C3.23125 6.3875 3.52813 6.83437 3.87188 7.26562C4.21563 7.69688 4.59375 8.1125 5.00625 8.5125C5.39375 8.9 5.8 9.25937 6.225 9.59062C6.65 9.92187 7.1 10.225 7.575 10.5L9.3375 8.7375C9.45 8.625 9.59687 8.54062 9.77812 8.48438C9.95937 8.42813 10.1375 8.4125 10.3125 8.4375L12.9 8.9625C13.075 9.0125 13.2188 9.10313 13.3313 9.23438C13.4438 9.36562 13.5 9.5125 13.5 9.675V12.7125C13.5 12.9375 13.425 13.125 13.275 13.275C13.125 13.425 12.9375 13.5 12.7125 13.5ZM2.26875 4.5L3.50625 3.2625L3.1875 1.5H1.51875C1.58125 2.0125 1.66875 2.51875 1.78125 3.01875C1.89375 3.51875 2.05625 4.0125 2.26875 4.5ZM8.98125 11.2125C9.46875 11.425 9.96563 11.5938 10.4719 11.7188C10.9781 11.8438 11.4875 11.925 12 11.9625V10.3125L10.2375 9.95625L8.98125 11.2125Z" fill="#356B00"/>
                </svg>
              </span>
              <span>0374524983 (07:00 – 21:30 hàng ngày)</span>
            </div>
            {/* Email icon from Figma */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ flexShrink: 0, display: 'flex' }}>
                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 12C1.0875 12 0.734375 11.8531 0.440625 11.5594C0.146875 11.2656 0 10.9125 0 10.5V1.5C0 1.0875 0.146875 0.734375 0.440625 0.440625C0.734375 0.146875 1.0875 0 1.5 0H13.5C13.9125 0 14.2656 0.146875 14.5594 0.440625C14.8531 0.734375 15 1.0875 15 1.5V10.5C15 10.9125 14.8531 11.2656 14.5594 11.5594C14.2656 11.8531 13.9125 12 13.5 12H1.5ZM7.5 6.75L1.5 3V10.5H13.5V3L7.5 6.75ZM7.5 5.25L13.5 1.5H1.5L7.5 5.25ZM1.5 3V1.5V3V10.5V3Z" fill="#356B00"/>
                </svg>
              </span>
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


        {/* Col 3 — App (coming soon) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h5 style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', margin: 0 }}>Tải ứng dụng di động</h5>
          <p style={{ fontSize: '13px', color: '#868889', margin: 0, lineHeight: 1.5 }}>
            Mua sắm tiện lợi và tích điểm thưởng ngay trên điện thoại.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Google Play badge — inactive */}
            <div style={{ display: 'inline-block', position: 'relative', opacity: 0.45, cursor: 'not-allowed', filter: 'grayscale(1)' }}>
              <Image
                src="/icons/google-play-badge.svg"
                alt="Tải trên Google Play"
                width={135}
                height={40}
                style={{ display: 'block', pointerEvents: 'none' }}
              />
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#868889', color: '#fff', fontSize: '9px', fontWeight: 700,
                padding: '2px 5px', borderRadius: '6px', lineHeight: 1.4,
              }}>Sắp ra mắt</span>
            </div>
            {/* App Store badge — inactive */}
            <div style={{ display: 'inline-block', position: 'relative', opacity: 0.45, cursor: 'not-allowed', filter: 'grayscale(1)' }}>
              <Image
                src="/icons/app-store-badge.svg"
                alt="Tải trên App Store"
                width={135}
                height={40}
                style={{ display: 'block', pointerEvents: 'none' }}
              />
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#868889', color: '#fff', fontSize: '9px', fontWeight: 700,
                padding: '2px 5px', borderRadius: '6px', lineHeight: 1.4,
              }}>Sắp ra mắt</span>
            </div>
          </div>
        </div>

      </div>

      {/* ---- Bottom bar ---- */}
      <div className="page-wrap footer-bottom">
        <p style={{ margin: 0 }}>© 2026 Tạp hóa nhà SIN</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
