'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import {
  usePromotionsAdmin,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from '@/hooks/use-promotions';
import { Promotion } from '@/lib/api-services';

/* ── helpers ── */
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN');
}

const EMPTY_FORM: Partial<Promotion> = {
  tag: '', title: '', description: '', buttonText: 'Khám phá ngay →',
  linkUrl: '/shop', imageUrl: '', bgColor: '#d4f7a0', isActive: true, sortOrder: 0,
};

/* ── Preview Card ── */
function PromoPreview({ form }: { form: Partial<Promotion> }) {
  return (
    <div style={{
      background: form.bgColor || '#d4f7a0', borderRadius: '16px', padding: '24px 20px 20px',
      display: 'flex', alignItems: 'center', gap: '16px', minHeight: '140px', position: 'relative',
    }}>
      <div style={{ flex: 1 }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', padding: '3px 10px', borderRadius: '99px', marginBottom: '10px' }}>
          {form.tag || 'TAG NÃN'}
        </span>
        <div style={{ fontSize: '17px', fontWeight: 700, color: '#191c1d', marginBottom: '6px', lineHeight: 1.3 }}>
          {form.title || 'Tiêu đề card'}
        </div>
        <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '14px', lineHeight: 1.5 }}>
          {form.description || 'Mô tả ngắn hiển thị ở đây...'}
        </div>
        <button style={{ background: '#356b00', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'default', fontFamily: 'Roboto, sans-serif' }}>
          {form.buttonText || 'Khám phá ngay →'}
        </button>
      </div>
      {form.imageUrl && (
        <div style={{ width: '120px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
          <img src={form.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
}

/* ── Form Modal ── */
function PromoModal({
  initial, onClose, onSave, isSaving,
}: { initial: Partial<Promotion>; onClose: () => void; onSave: (data: Partial<Promotion>) => void; isSaving: boolean }) {
  const [form, setForm] = useState<Partial<Promotion>>(initial);

  function set(key: keyof Promotion, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const isEdit = !!initial.id;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '900px', maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{isEdit ? '✏️ Sửa Promotion' : '➕ Thêm Promotion mới'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#868889' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          {/* Form */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', borderRight: '1px solid #EBEBEB' }}>
            {[
              { label: 'Tag *', key: 'tag', placeholder: 'TƯƠI MỚI MỖI NGÀY' },
              { label: 'Tiêu đề *', key: 'title', placeholder: 'Trái cây nhiệt đới tươi mới' },
              { label: 'Mô tả', key: 'description', placeholder: 'Mô tả ngắn...' },
              { label: 'Button text', key: 'buttonText', placeholder: 'Khám phá ngay →' },
              { label: 'Link URL', key: 'linkUrl', placeholder: '/shop' },
              { label: 'Image URL *', key: 'imageUrl', placeholder: 'https://...' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                <input
                  value={(form as any)[f.key] ?? ''}
                  onChange={e => set(f.key as keyof Promotion, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: '100%', border: '1.5px solid #EBEBEB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'Roboto, sans-serif', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            ))}

            {/* Color picker */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d', display: 'block', marginBottom: '4px' }}>Màu nền</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={form.bgColor || '#d4f7a0'} onChange={e => set('bgColor', e.target.value)}
                  style={{ width: '40px', height: '36px', border: '1.5px solid #EBEBEB', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                <input value={form.bgColor || '#d4f7a0'} onChange={e => set('bgColor', e.target.value)}
                  style={{ flex: 1, border: '1.5px solid #EBEBEB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'Roboto, sans-serif', outline: 'none' }} />
                {/* Preset colors */}
                {['#d4f7a0', '#fef9c3', '#fce7f3', '#dbeafe', '#f3e8ff'].map(c => (
                  <div key={c} onClick={() => set('bgColor', c)}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, cursor: 'pointer', border: form.bgColor === c ? '2px solid #356b00' : '1px solid #EBEBEB', flexShrink: 0 }} />
                ))}
              </div>
            </div>

            {/* Sort + Active */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d', display: 'block', marginBottom: '4px' }}>Sort order</label>
                <input type="number" min={0} value={form.sortOrder ?? 0} onChange={e => set('sortOrder', Number(e.target.value))}
                  style={{ width: '100%', border: '1.5px solid #EBEBEB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'Roboto, sans-serif', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d', display: 'block', marginBottom: '4px' }}>Trạng thái</label>
                <button
                  onClick={() => set('isActive', !form.isActive)}
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #EBEBEB', borderRadius: '8px', background: form.isActive ? '#EBFFD7' : '#F4F5F9', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: form.isActive ? '#356b00' : '#868889', fontFamily: 'Roboto, sans-serif' }}
                >
                  {form.isActive ? '✅ Đang hiển thị' : '⛔ Đang ẩn'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ padding: '24px', background: '#F8F9FA', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#868889', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</div>
            <PromoPreview form={form} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #EBEBEB', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: '#F4F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving || !form.tag || !form.title || !form.imageUrl}
            style={{ padding: '10px 24px', background: isSaving || !form.tag || !form.title || !form.imageUrl ? '#D0D5DD' : '#6CC51D', border: 'none', borderRadius: '8px', cursor: isSaving ? 'wait' : 'pointer', fontWeight: 700, fontSize: '14px', color: '#fff', fontFamily: 'Roboto, sans-serif' }}
          >
            {isSaving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  Promotions Admin Page                                  */
/* ═══════════════════════════════════════════════════════ */
export default function PromotionsAdminPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const { data: promotions = [], isLoading } = usePromotionsAdmin();
  const { mutate: create, isPending: creating } = useCreatePromotion();
  const { mutate: update, isPending: updating } = useUpdatePromotion();
  const { mutate: remove } = useDeletePromotion();

  const [modal, setModal] = useState<{ open: boolean; data: Partial<Promotion> }>({ open: false, data: EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() { setModal({ open: true, data: { ...EMPTY_FORM } }); }
  function openEdit(p: Promotion) { setModal({ open: true, data: { ...p } }); }
  function closeModal() { setModal({ open: false, data: EMPTY_FORM }); }

  function handleSave(form: Partial<Promotion>) {
    if (form.id) {
      update({ id: form.id, data: form }, { onSuccess: closeModal });
    } else {
      create(form, { onSuccess: closeModal });
    }
  }

  function toggleActive(p: Promotion) {
    update({ id: p.id, data: { isActive: !p.isActive } });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#191c1d' }}>🎯 Quản lý Promotion Cards</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#868889' }}>Các banner khuyến mãi hiển thị trên trang chủ</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} style={{ padding: '10px 20px', background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Roboto, sans-serif', boxShadow: '0 2px 8px rgba(108,197,29,0.3)' }}>
            ＋ Thêm mới
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Tổng cards', value: promotions.length, icon: '🎯', color: '#EBFFD7', text: '#356b00' },
          { label: 'Đang hiển thị', value: promotions.filter(p => p.isActive).length, icon: '✅', color: '#dcfce7', text: '#16a34a' },
          { label: 'Đang ẩn', value: promotions.filter(p => !p.isActive).length, icon: '⛔', color: '#fef2f2', text: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: s.text }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#868889' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #EBEBEB', display: 'grid', gridTemplateColumns: '200px 1fr 80px 80px 120px', gap: '16px', fontSize: '12px', fontWeight: 600, color: '#868889', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div>Preview</div><div>Thông tin</div><div>Màu</div><div>Sort</div><div>Actions</div>
        </div>

        {isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#868889' }}>Đang tải...</div>
        ) : promotions.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#191c1d' }}>Chưa có promotion nào</div>
            {isAdmin && <button onClick={openCreate} style={{ marginTop: '16px', padding: '10px 24px', background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Roboto, sans-serif' }}>Thêm card đầu tiên</button>}
          </div>
        ) : promotions.map(p => (
          <div key={p.id} style={{ padding: '16px 24px', borderBottom: '1px solid #F4F5F9', display: 'grid', gridTemplateColumns: '200px 1fr 80px 80px 120px', gap: '16px', alignItems: 'center', opacity: p.isActive ? 1 : 0.5, transition: 'opacity 0.15s' }}>
            {/* Mini preview */}
            <div style={{ background: p.bgColor, borderRadius: '8px', padding: '10px 12px', height: '64px', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '8px', fontWeight: 700, color: '#356b00', background: 'rgba(255,255,255,0.5)', display: 'inline-block', padding: '1px 5px', borderRadius: '99px', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{p.tag}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#191c1d', lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</div>
              </div>
              {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />}
            </div>

            {/* Info */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#191c1d', marginBottom: '3px' }}>{p.title}</div>
              <div style={{ fontSize: '12px', color: '#868889', marginBottom: '4px' }}>{p.description}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', background: p.isActive ? '#EBFFD7' : '#F4F5F9', color: p.isActive ? '#356b00' : '#868889', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                  {p.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                </span>
                <span style={{ fontSize: '11px', color: '#868889' }}>{fmtDate(p.createdAt)}</span>
              </div>
            </div>

            {/* Color swatch */}
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: p.bgColor, border: '1px solid #EBEBEB' }} title={p.bgColor} />

            {/* Sort */}
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#191c1d', textAlign: 'center' }}>{p.sortOrder}</div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {isAdmin ? (
                <>
                  <button onClick={() => toggleActive(p)} title={p.isActive ? 'Ẩn' : 'Hiện'}
                    style={{ padding: '6px 8px', background: '#F4F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                    {p.isActive ? '⛔' : '✅'}
                  </button>
                  <button onClick={() => openEdit(p)} title="Sửa"
                    style={{ padding: '6px 8px', background: '#EBFFD7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                    ✏️
                  </button>
                  <button onClick={() => setDeleteConfirm(p.id)} title="Xóa"
                    style={{ padding: '6px 8px', background: '#FFDAD6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                    🗑️
                  </button>
                </>
              ) : (
                <span style={{ fontSize: '12px', color: '#868889' }}>Chỉ xem</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>Xác nhận xóa?</h3>
            <p style={{ margin: '0 0 24px', color: '#868889', fontSize: '14px' }}>Hành động này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '10px 24px', background: '#F4F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Roboto, sans-serif' }}>Hủy</button>
              <button onClick={() => { remove(deleteConfirm); setDeleteConfirm(null); }}
                style={{ padding: '10px 24px', background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Roboto, sans-serif' }}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <PromoModal
          initial={modal.data}
          onClose={closeModal}
          onSave={handleSave}
          isSaving={creating || updating}
        />
      )}
    </div>
  );
}
