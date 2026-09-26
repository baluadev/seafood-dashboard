# Dashboard Page Layout Rule

Every customer-facing page in `seafood-dashboard` **MUST** include `<Header />` and `<Footer />` components.

## Required Pattern

```tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function SomePage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '88px' }}>
        {/* Page content */}
      </main>
      <Footer />
    </>
  );
}
```

## Rules

1. **Always wrap** page content with `<Header />` at the top and `<Footer />` at the bottom.
2. **Use Fragment** (`<>...</>`) as the root wrapper when Header/Footer are siblings of `<main>`.
3. **`paddingTop: '88px'`** on `<main>` to clear the fixed header.
4. **Exceptions**: Auth pages (`/auth/login`, `/auth/register`) do NOT need Header/Footer.
5. When creating a new page, copy the import pattern from an existing page like `/shop/page.tsx`.
