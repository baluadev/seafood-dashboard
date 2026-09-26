'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface Category { id: string; name: string; }
interface Recipe { icon: string; title: string; content: string; }
interface NutritionInfo { [key: string]: string | undefined; calories?: string; protein?: string; fat?: string; carbs?: string; fiber?: string; vitaminC?: string; }

interface Product {
  id: string; title: string; slug: string; description?: string;
  price: number; discountRate: number; thumbnailUrl?: string;
  stockQuantity: number; unit: string; isHot: boolean; isActive: boolean;
  avgRating: number; reviewCount: number; category: Category;
  // Detail fields
  origin?: string; packagingInfo?: string; preservationDays?: number;
  cultivationMethod?: string; nutritionInfo?: NutritionInfo;
  farmName?: string; farmAddress?: string; certifications: string[];
  farmImageUrl?: string; storageGuide?: string; recipes?: Recipe[];
}

const EMPTY_FORM = {
  categoryId: '', title: '', slug: '', description: '',
  price: 0, discountRate: 0, thumbnailUrl: '', stockQuantity: 0,
  unit: 'kg', isHot: false, isActive: true,
  // Detail
  origin: '', packagingInfo: '', preservationDays: 0 as number, cultivationMethod: '',
  nutritionInfo: { calories: '', protein: '', fat: '', carbs: '', fiber: '', vitaminC: '' } as Record<string, string>,
  farmName: '', farmAddress: '', certifications: [] as string[], farmImageUrl: '',
  storageGuide: '', recipes: [] as Recipe[],
};

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/');
  }, [user, router]);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [formTab, setFormTab] = useState(0);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState('');
  const [certInput, setCertInput] = useState('');

  // Data fetching
  const { data: productsRes, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products?all=true&limit=200').then(r => r.data),
  });
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories-all'],
    queryFn: () => api.get('/categories?all=true').then(r => r.data),
  });

  const products: Product[] = productsRes?.data ?? [];
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.includes(search.toLowerCase())
  );

  // Mutations
  const createMut = useMutation({
    mutationFn: (data: typeof form) => api.post('/products', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); closeModal(); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) =>
      api.patch(`/products/${id}`, data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); closeModal(); },
  });
  const toggleMut = useMutation({
    mutationFn: (id: string) => api.patch(`/products/${id}/toggle-active`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  function openCreate() {
    setForm({ ...EMPTY_FORM }); setFormTab(0); setSelected(null); setModal('create');
  }
  function openEdit(p: Product) {
    setForm({
      categoryId: p.category?.id ?? '', title: p.title, slug: p.slug,
      description: p.description ?? '', price: Number(p.price),
      discountRate: Number(p.discountRate), thumbnailUrl: p.thumbnailUrl ?? '',
      stockQuantity: p.stockQuantity, unit: p.unit, isHot: p.isHot, isActive: p.isActive,
      origin: p.origin ?? '', packagingInfo: p.packagingInfo ?? '',
      preservationDays: p.preservationDays ?? 0,
      cultivationMethod: p.cultivationMethod ?? '',
      nutritionInfo: (p.nutritionInfo ?? { calories: '', protein: '', fat: '', carbs: '', fiber: '', vitaminC: '' }) as Record<string, string>,
      farmName: p.farmName ?? '', farmAddress: p.farmAddress ?? '',
      certifications: p.certifications ?? [], farmImageUrl: p.farmImageUrl ?? '',
      storageGuide: p.storageGuide ?? '', recipes: p.recipes ?? [],
    });
    setFormTab(0); setSelected(p); setModal('edit');
  }
  function closeModal() { setModal(null); setSelected(null); setFormTab(0); }

  function setF(key: string, val: unknown) { setForm(f => ({ ...f, [key]: val })); }
  function setNutrition(key: string, val: string) {
    setForm(f => ({ ...f, nutritionInfo: { ...(f.nutritionInfo as Record<string, string>), [key]: val } }));
  }
  function addRecipe() {
    setForm(f => ({ ...f, recipes: [...(f.recipes ?? []), { icon: '🍽️', title: '', content: '' }] }));
  }
  function updateRecipe(i: number, key: string, val: string) {
    const r = [...(form.recipes ?? [])];
    r[i] = { ...r[i], [key]: val };
    setF('recipes', r);
  }
  function removeRecipe(i: number) {
    setF('recipes', form.recipes.filter((_, j) => j !== i));
  }
  function addCert() {
    if (certInput.trim() && !form.certifications.includes(certInput.trim())) {
      setF('certifications', [...form.certifications, certInput.trim()]);
      setCertInput('');
    }
  }

  function handleSubmit() {
    const data = {
      ...form,
      price: Number(form.price),
      discountRate: Number(form.discountRate),
      stockQuantity: Number(form.stockQuantity),
      preservationDays: Number(form.preservationDays) || 0,
      nutritionInfo: Object.values(form.nutritionInfo ?? {}).some(v => v)
        ? form.nutritionInfo : undefined,
      recipes: form.recipes?.length ? form.recipes : undefined,
    } as typeof form;
    if (modal === 'create') createMut.mutate(data);
    else if (selected) updateMut.mutate({ id: selected.id, data });
  }

  const isPending = createMut.isPending || updateMut.isPending;
  const FORM_TABS = ['Cơ bản', 'Dinh dưỡng', 'Nguồn gốc', 'Gợi ý & Bảo quản'];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', border: '1px solid #E0E0E0',
    borderRadius: '8px', fontSize: '14px', fontFamily: 'Roboto, sans-serif',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, color: '#868889', marginBottom: '4px', display: 'block',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#191c1d', margin: 0 }}>Quản lý sản phẩm</h1>
          <p style={{ fontSize: '14px', color: '#868889', margin: '4px 0 0' }}>{products.length} sản phẩm</p>
        </div>
        <button onClick={openCreate} style={{
          background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px',
          padding: '10px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          fontFamily: 'Roboto, sans-serif',
        }}>
          + Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Tìm theo tên hoặc slug..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: '16px', maxWidth: '400px' }}
      />

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #EBEBEB' }}>
              {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Đánh giá', 'Trạng thái', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#868889' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#868889' }}>Đang tải...</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F4F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.thumbnailUrl && (
                      <img src={p.thumbnailUrl} alt={p.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#191c1d' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: '#868889' }}>/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#486f21' }}>{p.category?.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#356b00' }}>
                  {new Intl.NumberFormat('vi-VN').format(Number(p.price))}₫
                  {Number(p.discountRate) > 0 && (
                    <span style={{ background: '#FFE0E0', color: '#ba1a1a', fontSize: '10px', borderRadius: '4px', padding: '1px 5px', marginLeft: '6px' }}>
                      -{Math.round(Number(p.discountRate) * 100)}%
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.stockQuantity} {p.unit}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                  ⭐ {p.avgRating.toFixed(1)} ({p.reviewCount})
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => toggleMut.mutate(p.id)} style={{
                    background: p.isActive ? '#EBFFD7' : '#F4F5F9',
                    color: p.isActive ? '#356b00' : '#868889',
                    border: 'none', borderRadius: '12px', padding: '4px 12px',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {p.isActive ? '✓ Hoạt động' : '○ Ẩn'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => openEdit(p)} style={{
                    background: '#F4F5F9', border: 'none', borderRadius: '6px',
                    padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}>Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          overflowY: 'auto', padding: '24px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '720px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', margin: 'auto',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#191c1d' }}>
                {modal === 'create' ? '➕ Thêm sản phẩm mới' : `✏️ Sửa: ${selected?.title}`}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#868889' }}>✕</button>
            </div>

            {/* Form Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EBEBEB', padding: '0 24px', gap: '4px' }}>
              {FORM_TABS.map((t, i) => (
                <button key={i} onClick={() => setFormTab(i)} style={{
                  padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: formTab === i ? 700 : 500,
                  color: formTab === i ? '#356b00' : '#868889',
                  borderBottom: formTab === i ? '2px solid #356b00' : '2px solid transparent',
                  fontFamily: 'Roboto, sans-serif',
                }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Tab 0: Thông tin cơ bản */}
              {formTab === 0 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Tên sản phẩm *</label>
                      <input style={inputStyle} value={form.title}
                        onChange={e => { setF('title', e.target.value); if (modal === 'create') setF('slug', toSlug(e.target.value)); }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Slug *</label>
                      <input style={inputStyle} value={form.slug} onChange={e => setF('slug', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Danh mục *</label>
                      <select style={{ ...inputStyle }} value={form.categoryId} onChange={e => setF('categoryId', e.target.value)}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Giá (₫) *</label>
                      <input type="number" style={inputStyle} value={form.price} onChange={e => setF('price', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Giảm giá (0–1, e.g. 0.15 = 15%)</label>
                      <input type="number" step="0.01" min="0" max="1" style={inputStyle} value={form.discountRate} onChange={e => setF('discountRate', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Tồn kho</label>
                      <input type="number" style={inputStyle} value={form.stockQuantity} onChange={e => setF('stockQuantity', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Đơn vị</label>
                      <input style={inputStyle} value={form.unit} onChange={e => setF('unit', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>URL ảnh đại diện</label>
                      <input style={inputStyle} value={form.thumbnailUrl} onChange={e => setF('thumbnailUrl', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Mô tả ngắn</label>
                      <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        value={form.description} onChange={e => setF('description', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Sản phẩm hot</label>
                      <input type="checkbox" checked={form.isHot} onChange={e => setF('isHot', e.target.checked)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Hiển thị (active)</label>
                      <input type="checkbox" checked={form.isActive} onChange={e => setF('isActive', e.target.checked)} />
                    </div>
                  </div>
                </>
              )}

              {/* Tab 1: Dinh dưỡng */}
              {formTab === 1 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Xuất xứ</label>
                      <input style={inputStyle} placeholder="Đắk Lắk, Việt Nam" value={form.origin} onChange={e => setF('origin', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Quy cách đóng gói</label>
                      <input style={inputStyle} placeholder="Hộp 1kg, đóng gói chân không" value={form.packagingInfo} onChange={e => setF('packagingInfo', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Thời gian bảo quản (ngày)</label>
                      <input type="number" style={inputStyle} value={form.preservationDays} onChange={e => setF('preservationDays', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phương pháp trồng</label>
                      <input style={inputStyle} placeholder="Thuần hữu cơ" value={form.cultivationMethod} onChange={e => setF('cultivationMethod', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#191c1d', marginBottom: '12px' }}>🥗 Thông tin dinh dưỡng (per 100g)</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      {[
                        { key: 'calories', label: 'Calories', placeholder: '160 kcal' },
                        { key: 'protein', label: 'Protein', placeholder: '2g' },
                        { key: 'fat', label: 'Chất béo', placeholder: '15.4g' },
                        { key: 'carbs', label: 'Carbohydrate', placeholder: '8.5g' },
                        { key: 'fiber', label: 'Chất xơ', placeholder: '6.7g' },
                        { key: 'vitaminC', label: 'Vitamin C', placeholder: '10mg' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input style={inputStyle} placeholder={f.placeholder}
                            value={(form.nutritionInfo as NutritionInfo)?.[f.key as keyof NutritionInfo] ?? ''}
                            onChange={e => setNutrition(f.key, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tab 2: Nguồn gốc & Chứng nhận */}
              {formTab === 2 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Tên trang trại / nhà vườn</label>
                      <input style={inputStyle} placeholder="Trang trại Hoàng Anh" value={form.farmName} onChange={e => setF('farmName', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Địa chỉ trang trại</label>
                      <input style={inputStyle} placeholder="Krông Pắk, Đắk Lắk" value={form.farmAddress} onChange={e => setF('farmAddress', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>URL ảnh trang trại</label>
                      <input style={inputStyle} placeholder="https://..." value={form.farmImageUrl} onChange={e => setF('farmImageUrl', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Chứng nhận</label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input style={{ ...inputStyle, flex: 1 }} placeholder="VietGAP, GlobalGAP, Organic..."
                          value={certInput} onChange={e => setCertInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCert())} />
                        <button onClick={addCert} style={{ background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}>+ Thêm</button>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {form.certifications.map(c => (
                          <span key={c} style={{ background: '#EBFFD7', color: '#356b00', borderRadius: '12px', padding: '4px 12px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {c}
                            <button onClick={() => setF('certifications', form.certifications.filter(x => x !== c))}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#356b00', fontSize: '14px', lineHeight: 1 }}>✕</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab 3: Gợi ý & Bảo quản */}
              {formTab === 3 && (
                <>
                  <div>
                    <label style={labelStyle}>Hướng dẫn bảo quản</label>
                    <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                      placeholder="Để sản phẩm trong ngăn mát tủ lạnh 0-5°C..."
                      value={form.storageGuide} onChange={e => setF('storageGuide', e.target.value)} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Gợi ý món ngon & Công thức</label>
                      <button onClick={addRecipe} style={{
                        background: '#EBFFD7', color: '#356b00', border: 'none', borderRadius: '8px',
                        padding: '6px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      }}>+ Thêm gợi ý</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(form.recipes ?? []).map((r, i) => (
                        <div key={i} style={{ background: '#F8F9FA', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                          <button onClick={() => removeRecipe(i)} style={{
                            position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none',
                            cursor: 'pointer', color: '#868889', fontSize: '16px',
                          }}>✕</button>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <label style={labelStyle}>Icon</label>
                              <input style={{ ...inputStyle, fontSize: '24px', textAlign: 'center' }}
                                value={r.icon} onChange={e => updateRecipe(i, 'icon', e.target.value)} />
                            </div>
                            <div>
                              <label style={labelStyle}>Tiêu đề</label>
                              <input style={inputStyle} placeholder="Tên món ăn / hướng dẫn"
                                value={r.title} onChange={e => updateRecipe(i, 'title', e.target.value)} />
                            </div>
                          </div>
                          <label style={labelStyle}>Nội dung</label>
                          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            placeholder="Mô tả chi tiết cách làm hoặc hướng dẫn..."
                            value={r.content} onChange={e => updateRecipe(i, 'content', e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #EBEBEB', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={closeModal} style={{
                background: '#F4F5F9', border: 'none', borderRadius: '8px',
                padding: '10px 20px', fontWeight: 600, cursor: 'pointer',
              }}>Huỷ</button>
              <button onClick={handleSubmit} disabled={isPending} style={{
                background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif', opacity: isPending ? 0.7 : 1,
              }}>
                {isPending ? 'Đang lưu...' : modal === 'create' ? '✓ Tạo sản phẩm' : '✓ Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
