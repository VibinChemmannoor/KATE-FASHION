# CLAUDE.md — Next.js Ecommerce Application

> This file is the **single source of truth** for Claude (AI assistant) when generating, editing, or reviewing any code in this project.
> Every response must strictly follow the rules, patterns, and conventions defined here.

---

## 📌 Project Overview

| Property          | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| **App Type**      | B2C Ecommerce (Full-Stack)                                        |
| **Framework**     | Next.js 14+ (App Router)                                          |
| **Language**      | JavaScript (ES2022+, NO TypeScript)                               |
| **Styling**       | Tailwind CSS v3                                                   |
| **Design System** | Atomic Design (atoms → molecules → organisms → templates → pages) |
| **Payments**      | Razorpay, Google Pay, PhonePe, Paytm                              |
| **Rendering**     | SSR / SSG / ISR / Server Components                               |
| **Target**        | Mobile-first, fully responsive, SEO-optimised                     |

---

## 🏗️ Folder Structure — Atomic Design

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Route group — auth pages
│   │   ├── login/
│   │   │   ├── page.jsx
│   │   │   └── loading.jsx
│   │   ├── register/
│   │   │   └── page.jsx
│   │   └── forgot-password/
│   │       └── page.jsx
│   ├── (shop)/                       # Route group — storefront
│   │   ├── page.jsx                  # Home / Landing
│   │   ├── products/
│   │   │   ├── page.jsx              # Product listing (SSG + ISR)
│   │   │   ├── [slug]/
│   │   │   │   ├── page.jsx          # Product detail (SSG)
│   │   │   │   └── loading.jsx
│   │   │   └── loading.jsx
│   │   ├── category/
│   │   │   └── [slug]/page.jsx
│   │   ├── search/
│   │   │   └── page.jsx
│   │   ├── cart/
│   │   │   └── page.jsx
│   │   └── checkout/
│   │       ├── page.jsx
│   │       └── success/page.jsx
│   ├── (account)/                    # Route group — user account
│   │   ├── profile/page.jsx
│   │   ├── orders/
│   │   │   ├── page.jsx
│   │   │   └── [id]/page.jsx
│   │   └── wishlist/page.jsx
│   ├── (admin)/                      # Route group — admin dashboard
│   │   ├── layout.jsx                # Admin layout (role-protected)
│   │   ├── dashboard/page.jsx
│   │   ├── products/
│   │   │   ├── page.jsx
│   │   │   ├── new/page.jsx
│   │   │   └── [id]/edit/page.jsx
│   │   └── orders/page.jsx
│   ├── api/                          # API Route Handlers
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.js
│   │   ├── products/
│   │   │   ├── route.js              # GET (list), POST (create)
│   │   │   └── [id]/route.js         # GET, PUT, DELETE
│   │   ├── categories/route.js
│   │   ├── cart/route.js
│   │   ├── orders/
│   │   │   ├── route.js
│   │   │   └── [id]/route.js
│   │   ├── payment/
│   │   │   ├── razorpay/
│   │   │   │   ├── create-order/route.js
│   │   │   │   └── verify/route.js
│   │   │   ├── phonepe/
│   │   │   │   ├── initiate/route.js
│   │   │   │   └── callback/route.js
│   │   │   └── paytm/
│   │   │       ├── initiate/route.js
│   │   │       └── callback/route.js
│   │   ├── webhook/
│   │   │   └── razorpay/route.js     # Payment webhook handler
│   │   ├── upload/route.js
│   │   └── health/route.js
│   ├── layout.jsx                    # Root layout
│   ├── error.jsx                     # Global error boundary
│   ├── not-found.jsx
│   └── sitemap.js                    # Dynamic sitemap
│
├── components/                       # Atomic Design System
│   ├── atoms/                        # Smallest, stateless UI units
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.js
│   │   │   └── index.js
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Spinner/
│   │   ├── Icon/
│   │   ├── Label/
│   │   ├── Divider/
│   │   └── Typography/
│   ├── molecules/                    # Composed from atoms
│   │   ├── SearchBar/
│   │   ├── ProductCard/
│   │   ├── CartItem/
│   │   ├── ReviewCard/
│   │   ├── PriceTag/
│   │   ├── QuantitySelector/
│   │   ├── RatingStars/
│   │   ├── PaymentMethodCard/
│   │   └── FormField/
│   ├── organisms/                    # Complex, self-contained sections
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── ProductGrid/
│   │   ├── CartDrawer/
│   │   ├── CheckoutForm/
│   │   ├── PaymentGateway/           # Unified payment component
│   │   ├── FilterSidebar/
│   │   ├── ProductGallery/
│   │   ├── ReviewSection/
│   │   ├── OrderSummary/
│   │   └── AdminSidebar/
│   ├── templates/                    # Page layouts / skeletons
│   │   ├── ShopLayout/
│   │   ├── AuthLayout/
│   │   ├── DashboardLayout/
│   │   ├── ProductPageTemplate/
│   │   └── CheckoutTemplate/
│   └── providers/                    # Context providers
│       ├── AuthProvider.jsx
│       ├── CartProvider.jsx
│       └── ToastProvider.jsx
│
├── lib/                              # Core utilities & integrations
│   ├── db/
│   │   ├── prisma.js                 # Prisma client singleton
│   │   └── queries/                  # Reusable DB queries
│   │       ├── products.js
│   │       ├── orders.js
│   │       └── users.js
│   ├── auth/
│   │   ├── config.js                 # NextAuth config
│   │   ├── guards.js                 # Route protection helpers
│   │   └── permissions.js            # Role-based permissions
│   ├── payment/
│   │   ├── razorpay.js               # Razorpay SDK wrapper
│   │   ├── phonepe.js                # PhonePe integration
│   │   ├── paytm.js                  # Paytm integration
│   │   └── payment.factory.js        # Payment provider factory
│   ├── security/
│   │   ├── csrf.js
│   │   ├── rateLimit.js
│   │   ├── sanitize.js
│   │   └── encryption.js
│   ├── seo/
│   │   ├── metadata.js               # generateMetadata helpers
│   │   └── structuredData.js         # JSON-LD schema helpers
│   ├── cache/
│   │   └── redis.js                  # Upstash Redis client
│   ├── email/
│   │   └── mailer.js
│   ├── upload/
│   │   └── cloudinary.js
│   └── utils/
│       ├── format.js                 # Price, date formatters
│       ├── validation.js             # Zod schemas
│       └── constants.js
│
├── hooks/                            # Custom React hooks
│   ├── useCart.js
│   ├── useAuth.js
│   ├── useWishlist.js
│   ├── usePayment.js
│   ├── useDebounce.js
│   ├── useIntersectionObserver.js
│   └── useLocalStorage.js
│
├── store/                            # Zustand global state
│   ├── cartStore.js
│   ├── wishlistStore.js
│   └── uiStore.js
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
│
├── prisma/
│   ├── schema.prisma
│   └── seed.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── middleware.js                     # Next.js middleware (auth, security headers)
├── next.config.js
├── tailwind.config.js
├── .env.example
└── CLAUDE.md                         # ← This file
```

---

## ⚙️ Code Generation Rules

### General Rules — Always Follow

1. **Language**: JavaScript only. No TypeScript. Use JSDoc for type hints where helpful.
2. **Imports**: Use absolute imports via `@/` alias (e.g. `@/components/atoms/Button`).
3. **Components**: Always use named exports for components; default export only for page files.
4. **No inline styles**: Use Tailwind utility classes exclusively. No `style={{}}` props.
5. **No magic numbers**: Extract to named constants in `lib/utils/constants.js`.
6. **Error handling**: Every async function must have try/catch. API routes must return structured errors.
7. **Environment variables**: Never hardcode secrets. Always use `process.env.VARIABLE_NAME`.
8. **Comments**: Write JSDoc for all exported functions. Inline comments only for complex logic.

### SOLID Principles

```
S — Single Responsibility : Each component/function does ONE thing only.
                            ProductCard displays a product. It does NOT fetch data.
O — Open/Closed           : Extend via props/composition. Never modify working atoms.
                            Add variants via a `variant` prop, not new components.
L — Liskov Substitution   : Child components must be usable wherever parent is used.
I — Interface Segregation : Props should be minimal. Don't pass unused props down.
D — Dependency Inversion  : Components depend on abstractions (hooks/context),
                            not concrete implementations (direct API calls).
```

**Example — SOLID-compliant ProductCard:**

```jsx
// ✅ CORRECT — Single responsibility, receives data via props
export function ProductCard({ product, onAddToCart, onWishlist }) {
  return (
    <div className="group relative rounded-2xl border border-gray-100 ...">
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo name={product.name} price={product.price} />
      <ProductActions onAddToCart={() => onAddToCart(product.id)} />
    </div>
  )
}

// ❌ WRONG — Fetches its own data, violates SRP
export function ProductCard({ productId }) {
  const [product, setProduct] = useState(null)
  useEffect(() => { fetch(`/api/products/${productId}`)... }, [])
  // ...
}
```

### DRY Principles

```
- Extract repeated logic into custom hooks (useCart, useAuth, usePayment)
- Extract repeated UI patterns into molecules/organisms
- Extract repeated API patterns into lib/db/queries/
- Extract repeated validation into lib/utils/validation.js
- Never copy-paste more than 3 lines — abstract it
```

---

## 🔒 Security Rules — MANDATORY

> Every generated code must comply with these security requirements.
> Security is non-negotiable and must never be skipped for "simplicity".

### 1. Authentication & Authorization

```js
// middleware.js — Protect routes at edge level
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Account routes require auth
    if (path.startsWith("/account") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
```

### 2. Security Headers

```js
// next.config.js — Security headers for ALL responses
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://api.phonepe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://res.cloudinary.com",
      "connect-src 'self' https://api.razorpay.com",
      "frame-src https://api.razorpay.com https://securegw.paytm.in",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];
```

### 3. API Route Security Pattern

**Every API route MUST follow this pattern:**

```js
// Template for ALL API route handlers
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Rate limiting
    const rateLimitResult = await rateLimit(request, { max: 10, window: "1m" });
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 2. Authentication check
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Input parsing & sanitization
    const body = await request.json();
    const sanitized = sanitizeInput(body);

    // 4. Schema validation
    const validated = validateSchema(sanitized, myZodSchema);
    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    // 5. Business logic
    const result = await myBusinessLogic(validated.data, session.user.id);

    // 6. Return sanitized response (never expose raw DB objects)
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    // 7. Never expose internal errors to client
    console.error("[API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### 4. Input Sanitization

```js
// lib/security/sanitize.js
import DOMPurify from "isomorphic-dompurify";

/**
 * Recursively sanitize all string values in an object
 * @param {Object|string} input
 * @returns {Object|string}
 */
export function sanitizeInput(input) {
  if (typeof input === "string") return DOMPurify.sanitize(input.trim());
  if (Array.isArray(input)) return input.map(sanitizeInput);
  if (typeof input === "object" && input !== null) {
    return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, sanitizeInput(v)]));
  }
  return input;
}
```

### 5. Rate Limiting

```js
// lib/security/rateLimit.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

/**
 * Apply rate limiting to an API request
 * @param {Request} request
 * @param {{ max: number, window: string }} options
 */
export async function rateLimit(request, options) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  return ratelimit.limit(ip);
}
```

### 6. CSRF Protection

```js
// lib/security/csrf.js
import { createHash, randomBytes } from "crypto";

export function generateCsrfToken() {
  return randomBytes(32).toString("hex");
}

export function verifyCsrfToken(token, sessionToken) {
  const expected = createHash("sha256").update(sessionToken).digest("hex");
  return token === expected;
}
```

### 7. SQL Injection Prevention

```
- ALWAYS use Prisma ORM — never raw SQL strings
- NEVER use template literals in queries
- ALWAYS use Prisma's parameterized where clauses
```

```js
// ✅ CORRECT
const product = await prisma.product.findFirst({
  where: { slug: params.slug }, // Prisma handles parameterization
});

// ❌ NEVER DO THIS
const product = await prisma.$queryRaw`SELECT * FROM products WHERE slug = ${params.slug}`;
```

### 8. Environment Variables Security

```
# .env.example — Document ALL required variables here (no real values)
NEXTAUTH_SECRET=             # Min 32 chars random string
NEXTAUTH_URL=                # https://yourdomain.com

DATABASE_URL=                # Prisma connection string

RAZORPAY_KEY_ID=             # Razorpay dashboard > API Keys
RAZORPAY_KEY_SECRET=         # NEVER expose to client
RAZORPAY_WEBHOOK_SECRET=     # Webhook verification

PHONEPE_MERCHANT_ID=
PHONEPE_SALT_KEY=
PHONEPE_SALT_INDEX=

PAYTM_MID=
PAYTM_MERCHANT_KEY=
PAYTM_WEBSITE=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

ENCRYPTION_KEY=              # 32-char key for sensitive data encryption
```

---

## 💳 Payment Integration — Security-First

### Architecture: Payment Factory Pattern

```js
// lib/payment/payment.factory.js
import { RazorpayProvider } from "./razorpay";
import { PhonePeProvider } from "./phonepe";
import { PaytmProvider } from "./paytm";

const PROVIDERS = {
  razorpay: RazorpayProvider,
  phonepe: PhonePeProvider,
  paytm: PaytmProvider,
  // Google Pay is handled via Razorpay (UPI intent flow)
  googlepay: RazorpayProvider,
};

/**
 * Get the payment provider by name
 * @param {'razorpay'|'phonepe'|'paytm'|'googlepay'} provider
 * @returns {PaymentProvider}
 */
export function getPaymentProvider(provider) {
  const Provider = PROVIDERS[provider];
  if (!Provider) throw new Error(`Unknown payment provider: ${provider}`);
  return new Provider();
}
```

### Razorpay — Secure Integration Pattern

```js
// lib/payment/razorpay.js
import Razorpay from "razorpay";
import { createHmac } from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export class RazorpayProvider {
  /**
   * Create a Razorpay order — SERVER SIDE ONLY
   * @param {{ amount: number, currency: string, receipt: string }} options
   */
  async createOrder({ amount, currency = "INR", receipt }) {
    return razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency,
      receipt,
      payment_capture: 1,
    });
  }

  /**
   * Verify payment signature — ALWAYS verify before fulfillment
   * @param {{ orderId: string, paymentId: string, signature: string }} params
   * @returns {boolean}
   */
  verifySignature({ orderId, paymentId, signature }) {
    const body = `${orderId}|${paymentId}`;
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    return expected === signature;
  }

  /**
   * Verify webhook signature
   * @param {string} body - Raw request body string
   * @param {string} signature - X-Razorpay-Signature header
   */
  verifyWebhook(body, signature) {
    const expected = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");
    return expected === signature;
  }
}
```

### Razorpay Create Order API Route

```js
// app/api/payment/razorpay/create-order/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { getPaymentProvider } from "@/lib/payment/payment.factory";
import { rateLimit } from "@/lib/security/rateLimit";
import { prisma } from "@/lib/db/prisma";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    // Rate limit: 5 order creation attempts per minute
    const limit = await rateLimit(request, { max: 5, window: "1m" });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartId, provider = "razorpay" } = await request.json();

    // Fetch cart and calculate amount server-side — NEVER trust client amount
    const cart = await prisma.cart.findUnique({
      where: { id: cartId, userId: session.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const amount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const paymentProvider = getPaymentProvider(provider);
    const order = await paymentProvider.createOrder({
      amount,
      receipt: `receipt_${nanoid(10)}`,
    });

    // Store pending order in DB
    await prisma.order.create({
      data: {
        userId: session.user.id,
        razorpayOrderId: order.id,
        amount,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Return only what client needs — never expose secret keys
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // Public key only
    });
  } catch (error) {
    console.error("[Razorpay Create Order]", error);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
```

### Razorpay Verify API Route

```js
// app/api/payment/razorpay/verify/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { getPaymentProvider } from "@/lib/payment/payment.factory";
import { prisma } from "@/lib/db/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    // Verify signature — CRITICAL security step
    const provider = getPaymentProvider("razorpay");
    const isValid = provider.verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      console.warn("[Payment Fraud Attempt]", { razorpayOrderId, userId: session.user.id });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order status
    await prisma.order.update({
      where: { razorpayOrderId, userId: session.user.id },
      data: {
        razorpayPaymentId,
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Clear cart after successful payment
    await prisma.cart.deleteMany({ where: { userId: session.user.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Razorpay Verify]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
```

### Webhook Handler

```js
// app/api/webhook/razorpay/route.js
import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payment/payment.factory";
import { prisma } from "@/lib/db/prisma";

export async function POST(request) {
  const body = await request.text(); // Raw body for signature check
  const signature = request.headers.get("x-razorpay-signature");

  const provider = getPaymentProvider("razorpay");
  if (!provider.verifyWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case "payment.captured":
      await handlePaymentCaptured(event.payload.payment.entity);
      break;
    case "payment.failed":
      await handlePaymentFailed(event.payload.payment.entity);
      break;
    case "refund.processed":
      await handleRefundProcessed(event.payload.refund.entity);
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## 🔍 SEO Rules

### 1. generateMetadata — Every Page Must Have It

```js
// Template for ALL page.jsx files
/**
 * @param {{ params: Object, searchParams: Object }} props
 * @returns {Promise<import('next').Metadata>}
 */
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  return {
    title: `${product.name} | ShopName`,
    description: product.description.slice(0, 160),
    keywords: product.tags.join(", "),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 200),
      images: [product.image],
    },
    alternates: {
      canonical: `https://yourdomain.com/products/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
```

### 2. Structured Data (JSON-LD)

```js
// lib/seo/structuredData.js

/** Product schema for product detail pages */
export function productSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "ShopName" },
    },
    aggregateRating: product.reviews?.length
      ? {
          "@type": "AggregateRating",
          ratingValue: product.avgRating,
          reviewCount: product.reviews.length,
        }
      : undefined,
  };
}

/** Breadcrumb schema */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

### 3. Rendering Strategy per Page

| Page            | Strategy                   | Rationale                    |
| --------------- | -------------------------- | ---------------------------- |
| Home            | ISR (revalidate: 3600)     | Changes hourly, needs SEO    |
| Product Listing | ISR (revalidate: 1800)     | Category pages, SEO critical |
| Product Detail  | SSG + generateStaticParams | Pre-built, max SEO, fast     |
| Search Results  | SSR (dynamic)              | Query-dependent              |
| Cart / Checkout | CSR (dynamic)              | User-specific, no SEO needed |
| Account Pages   | SSR (protected)            | Auth-required                |
| Admin           | CSR (protected)            | No SEO needed                |

### 4. Sitemap

```js
// app/sitemap.js — Auto-generated sitemap
import { prisma } from "@/lib/db/prisma";

export default async function sitemap() {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const staticPages = ["", "/products", "/about", "/contact"].map((path) => ({
    url: `https://yourdomain.com${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...products.map((p) => ({
      url: `https://yourdomain.com/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...categories.map((c) => ({
      url: `https://yourdomain.com/category/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily",
      priority: 0.6,
    })),
  ];
}
```

---

## 📱 Responsive Design Rules

### Breakpoint System (Tailwind)

```
Mobile first. Always start with mobile styles, then add responsive prefixes.

xs:  < 480px   → Default (no prefix)
sm:  ≥ 640px   → sm:
md:  ≥ 768px   → md:
lg:  ≥ 1024px  → lg:
xl:  ≥ 1280px  → xl:
2xl: ≥ 1536px  → 2xl:
```

### Responsive Patterns

```jsx
// ✅ Product Grid — responsive columns
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

// ✅ Typography scale
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">

// ✅ Padding/spacing
<section className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">

// ✅ Navigation — hamburger on mobile
<nav className="hidden md:flex items-center gap-6">
<button className="md:hidden" aria-label="Open menu">

// ✅ Cart drawer — full screen mobile, sidebar desktop
<div className="fixed inset-0 md:inset-y-0 md:right-0 md:w-96 bg-white z-50">

// ✅ Image — always use next/image with responsive sizes
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  className="object-cover"
/>
```

### Touch & Mobile UX Rules

```
- Minimum tap target: 44×44px (use min-h-[44px] min-w-[44px])
- Never use hover-only interactions for critical actions
- Checkout form inputs: text-base (prevents iOS zoom on focus)
- Use font-size: 16px minimum on all inputs
- Implement swipe gestures on product image gallery
- Cart drawer: swipe-to-close on mobile
```

---

## ⚡ Performance & Optimization Rules

### Images

```jsx
// Always use next/image — NEVER <img> tag
import Image from "next/image";

// Product images
<Image
  src={src}
  alt={alt}
  width={400}
  height={400}
  sizes="(max-width: 640px) 100vw, 400px"
  placeholder="blur"
  blurDataURL={blurDataUrl}
  className="object-cover rounded-lg"
/>;
```

### Fonts

```js
// app/layout.jsx — Use next/font (zero layout shift)
import { Geist, Geist_Mono } from "next/font/google";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
```

### Code Splitting

```js
// Lazy load heavy components
import dynamic from "next/dynamic";

const RazorpayCheckout = dynamic(() => import("@/components/organisms/PaymentGateway"), {
  loading: () => <PaymentSkeleton />,
  ssr: false, // Payment UI is client-only
});

const ProductReviews = dynamic(() => import("@/components/organisms/ReviewSection"));
```

### Caching Strategy

```js
// lib/db/queries/products.js
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export const getProducts = unstable_cache(
  async (filters) => {
    return prisma.product.findMany({ where: filters });
  },
  ["products-list"],
  { revalidate: 3600, tags: ["products"] }
);

// Revalidate on mutation
import { revalidateTag } from "next/cache";
// After product update:
revalidateTag("products");
```

---

## 🧪 Testing Requirements

### Test File Naming

```
components/atoms/Button/Button.test.js     → Unit tests
components/molecules/ProductCard/ProductCard.test.js
app/api/products/products.test.js          → Integration tests
tests/e2e/checkout.spec.js                 → E2E tests (Playwright)
```

### Required Test Coverage

| Area                           | Tests Required                            |
| ------------------------------ | ----------------------------------------- |
| Payment signature verification | Unit — test valid + forged signatures     |
| API authentication             | Integration — unauthorized returns 401    |
| Rate limiting                  | Integration — exceeding limit returns 429 |
| Input sanitization             | Unit — XSS strings are stripped           |
| CSRF validation                | Unit — invalid token rejected             |
| Cart total calculation         | Unit — server-side amount matches DB      |
| Order creation                 | Integration — full flow                   |
| Webhook verification           | Unit — invalid webhook rejected           |

### Test Pattern

```js
// components/atoms/Button/Button.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct label", () => {
    render(<Button>Add to Cart</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Add to Cart");
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Buy Now</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    render(<Button loading>Processing</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## 🗄️ Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?
  role          Role      @default(USER)
  emailVerified DateTime?
  phone         String?
  addresses     Address[]
  orders        Order[]
  cart          Cart?
  wishlist      Wishlist[]
  reviews       Review[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

model Product {
  id          String        @id @default(cuid())
  slug        String        @unique
  name        String
  description String
  price       Decimal       @db.Decimal(10, 2)
  comparePrice Decimal?     @db.Decimal(10, 2)
  stock       Int           @default(0)
  sku         String        @unique
  brand       String?
  images      ProductImage[]
  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])
  tags        String[]
  attributes  Json?         // Color, size, etc.
  isActive    Boolean       @default(true)
  cartItems   CartItem[]
  orderItems  OrderItem[]
  wishlist    Wishlist[]
  reviews     Review[]
  avgRating   Float?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([slug])
  @@index([categoryId])
}

model Order {
  id                String      @id @default(cuid())
  userId            String
  user              User        @relation(fields: [userId], references: [id])
  items             OrderItem[]
  status            OrderStatus @default(PENDING)
  paymentProvider   String?     // razorpay | phonepe | paytm
  razorpayOrderId   String?     @unique
  razorpayPaymentId String?
  transactionId     String?     // For PhonePe/Paytm
  amount            Decimal     @db.Decimal(10, 2)
  currency          String      @default("INR")
  shippingAddressId String?
  shippingAddress   Address?    @relation(fields: [shippingAddressId], references: [id])
  notes             String?
  paidAt            DateTime?
  deliveredAt       DateTime?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

---

## 🔧 Tailwind Configuration

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef7ee",
          100: "#fdecd3",
          500: "#f97316", // Primary
          600: "#ea6c0a",
          900: "#7c2d12",
        },
        neutral: {
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "480px",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-in",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
```

---

## 📦 Package List

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next-auth": "^5.0.0-beta",
    "@prisma/client": "^5.14.0",
    "razorpay": "^2.9.2",
    "zustand": "^4.5.2",
    "zod": "^3.23.5",
    "isomorphic-dompurify": "^2.15.0",
    "@upstash/ratelimit": "^2.0.1",
    "@upstash/redis": "^1.31.3",
    "cloudinary": "^2.2.0",
    "nanoid": "^5.0.7",
    "resend": "^3.3.0",
    "crypto": "^1.0.1"
  },
  "devDependencies": {
    "prisma": "^5.14.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.2",
    "@playwright/test": "^1.44.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.13",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "tailwindcss": "^3.4.3"
  }
}
```

---

## 🚫 Anti-Patterns — Never Do These

```
❌ Never trust client-side price/amount — always calculate on server
❌ Never expose RAZORPAY_KEY_SECRET or any secret to the browser
❌ Never skip payment signature verification
❌ Never use raw SQL strings with Prisma
❌ Never store passwords in plain text
❌ Never return raw database errors to clients
❌ Never use <img> — always use next/image
❌ Never use inline styles — use Tailwind classes
❌ Never fetch data inside a component — use Server Components or hooks
❌ Never use any state management for server data — use React Query or SWR
❌ Never skip rate limiting on payment API routes
❌ Never skip CSRF validation on mutation routes
❌ Never hardcode API keys — always use environment variables
❌ Never disable ESLint rules without a comment explaining why
```

---

## ✅ Pre-Commit Checklist

Before every code generation, verify:

- [ ] API route has authentication check
- [ ] API route has rate limiting
- [ ] User input is sanitized before DB write
- [ ] Zod schema validates all inputs
- [ ] Payment amount calculated server-side
- [ ] Payment signature verified before order fulfillment
- [ ] No secrets exposed to client
- [ ] Server Component used unless interactivity is required
- [ ] generateMetadata exported from all page.jsx files
- [ ] Images use next/image with sizes prop
- [ ] Component placed in correct Atomic Design layer
- [ ] Error boundary handles failures gracefully
- [ ] Mobile-first Tailwind classes applied
- [ ] Loading state and empty state handled
- [ ] Test file exists for new component or API route

---

_Last updated: 2025 | Stack: Next.js 14 · JavaScript · Tailwind CSS · Prisma · Razorpay · PhonePe · Paytm_
