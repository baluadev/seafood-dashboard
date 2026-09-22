import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full bg-[#edeeef] text-[#191c1d] mt-8">
      {/* Newsletter strip */}
      <div className="bg-[#EBFFD7] py-8">
        <div className="w-full px-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-[18px] font-bold text-[#244c00]">Đăng ký nhận ưu đãi mới nhất</h4>
            <p className="text-[14px] text-[#486f21] mt-1">Nhận voucher 50.000₫ cho đơn hàng đầu tiên của bạn</p>
          </div>
          <div className="flex w-full md:w-auto max-w-md items-center bg-white rounded-xl p-1">
            <input
              type="email"
              className="w-full bg-transparent px-4 py-2 text-[14px] text-black placeholder-[#868889] outline-none"
              placeholder="Nhập địa chỉ email của bạn..."
            />
            <button className="bg-[#6CC51D] text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#4CAF18] transition-colors flex-shrink-0">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="w-full px-[2.5rem] py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand col */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image src="/icon-192.png" alt="icon" width={36} height={36} className="rounded-lg object-contain" />
            <span className="text-[20px] font-bold text-black">
              Tạp hóa nhà <span className="text-[#6CC51D]">SIN</span>
            </span>
          </div>
          <p className="text-[14px] text-[#868889] max-w-sm leading-relaxed">
            Mua sắm tiện lợi, giao hàng tận nơi — đồng hành cùng bữa cơm gia đình mỗi ngày.
          </p>
          <div className="flex flex-col gap-2 text-[13px] text-[#868889]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#6CC51D]">storefront</span>
              <span>TP. Hà Nội</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#6CC51D]">call</span>
              <span>0374524983 (07:00 – 21:30)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#6CC51D]">mail</span>
              <span>ngoctam.vinhcity@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="flex flex-col gap-3">
          <h5 className="text-[15px] font-semibold text-black">Sản phẩm</h5>
          <ul className="flex flex-col gap-2 text-[14px] text-[#868889]">
            <li><Link href="/shop" className="hover:text-[#6CC51D] transition-colors">Sản phẩm nổi bật</Link></li>
            <li><Link href="/shop" className="hover:text-[#6CC51D] transition-colors">Tất cả sản phẩm</Link></li>
          </ul>
        </div>

        {/* Chăm sóc KH */}
        <div className="flex flex-col gap-3">
          <h5 className="text-[15px] font-semibold text-black">Chăm sóc khách hàng</h5>
          <ul className="flex flex-col gap-2 text-[14px] text-[#868889]">
            <li><span className="hover:text-[#6CC51D] transition-colors cursor-pointer">Chính sách đổi trả</span></li>
            <li><span className="hover:text-[#6CC51D] transition-colors cursor-pointer">Phí giao hàng</span></li>
            <li><span className="hover:text-[#6CC51D] transition-colors cursor-pointer">Câu hỏi thường gặp</span></li>
          </ul>
        </div>

        {/* Tài khoản */}
        <div className="flex flex-col gap-3">
          <h5 className="text-[15px] font-semibold text-black">Tài khoản</h5>
          <ul className="flex flex-col gap-2 text-[14px] text-[#868889]">
            <li><Link href="/auth/login" className="hover:text-[#6CC51D] transition-colors">Đăng nhập</Link></li>
            <li><Link href="/auth/register" className="hover:text-[#6CC51D] transition-colors">Đăng ký</Link></li>
            <li><Link href="/orders" className="hover:text-[#6CC51D] transition-colors">Đơn hàng của tôi</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full px-[2.5rem] py-4 border-t border-[#EBEBEB] flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-[#868889]">
        <p>© 2026 Tạp hóa nhà SIN. Tất cả quyền được bảo lưu.</p>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer hover:text-[#6CC51D]">Điều khoản sử dụng</span>
          <span className="cursor-pointer hover:text-[#6CC51D]">Bảo mật thông tin</span>
        </div>
      </div>
    </footer>
  );
}
