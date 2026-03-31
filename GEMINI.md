<!-- BEGIN:nextjs-agent-rules -->
# THIS IS NOT THE NEXT.JS YOU KNOW — NEXT.JS 16 + REACT 19

⚠️ **VIOLATION OF THESE RULES IS A CRITICAL ERROR** ⚠️

This version has **breaking changes** — APIs, conventions, and file structure differ from training data. Read `node_modules/next/dist/docs/` before writing ANY code. Heed deprecation notices.

---

## ARCHITECTURE PRINCIPLES — ENFORCE STRICTLY

### 1. SERVER COMPONENTS BY DEFAULT — NO EXCEPTIONS

- **Server Components are the DEFAULT**. Do NOT add `'use client'` unless absolutely necessary.
- **Client Components are the EXCEPTION**. Only use `'use client'` for:
  - Browser-only APIs (`window`, `document`, `localStorage`)
  - React hooks (`useState`, `useEffect`, `useContext`, etc.)
  - Event handlers (`onClick`, `onSubmit`, `onChange`)
  - Third-party client-only libraries

### 2. CLIENT/SERVER BOUNDARY ISOLATION — ZERO TOLERANCE

**FORBIDDEN PATTERNS:**
```tsx
// ❌ NEVER: Importing server-only code into Client Component
'use client'
import { db } from './server-db' // ERROR: Database in client

// ❌ NEVER: Using hooks in Server Component
async function Page() {
  const [data, setData] = useState() // ERROR: Hook in Server Component
}
```

**REQUIRED PATTERN:**
```tsx
// ✅ Server Component fetches data, passes to Client Component
// app/page.tsx (Server Component - NO 'use client')
import { ClientForm } from './client-form'

async function Page() {
  const data = await fetchData() // Server-side fetch
  return <ClientForm initialData={data} />
}

// app/client-form.tsx (Client Component)
'use client'
import { useState } from 'react'

export function ClientForm({ initialData }) {
  const [state, setState] = useState(initialData)
  // Client-side interactivity only
}
```

---

## REACT 19 — BREAKING CHANGES MANDATE

### FORBIDDEN LEGACY PATTERNS — NEVER USE

| ❌ FORBIDDEN (Pre-React 19) | ✅ REQUIRED (React 19) |
|---------------------------|----------------------|
| `forwardRef` | `ref` as a prop directly |
| `<Context.Provider>` | `<Context>` directly |
| `useFormState` | `useActionState` |
| `ReactDOM.useFormState` | `React.useActionState` |
| Creating promises in render for `use()` | Pass cached promises from framework |
| `useMemo` for simple calculations | React Compiler handles memoization |
| `useCallback` for event handlers | React Compiler handles memoization |

### REF AS PROP — MANDATORY MIGRATION

```tsx
// ❌ FORBIDDEN: forwardRef pattern
import { forwardRef } from 'react'
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// ✅ REQUIRED: ref as prop (React 19)
function Input({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />
}
// Usage: <Input ref={inputRef} placeholder="Name" />
```

### CONTEXT PROVIDER SIMPLIFICATION — MANDATORY

```tsx
// ❌ FORBIDDEN: Context.Provider
<ThemeContext.Provider value={theme}>
  {children}
</ThemeContext.Provider>

// ✅ REQUIRED: Context as provider
<ThemeContext value={theme}>
  {children}
</ThemeContext>
```

---

## ACTIONS — PREFERRED OVER MANUAL STATE

### USE ACTIONSTATE — REQUIRED FOR FORMS

```tsx
// ❌ FORBIDDEN: Manual form state management
const [error, setError] = useState(null)
const [isPending, setIsPending] = useState(false)
const handleSubmit = async () => {
  setIsPending(true)
  const error = await updateName(name)
  setIsPending(false)
  if (error) setError(error)
}

// ✅ REQUIRED: useActionState pattern
import { useActionState } from 'react'

function ChangeName() {
  const [error, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const error = await updateName(formData.get('name'))
      if (error) return error
      redirect('/path')
      return null
    },
    null
  )

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

### USEFORMSTATUS — REQUIRED FOR FORM COMPONENTS

```tsx
// ✅ REQUIRED: useFormStatus for shared form components
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus() // Reads parent <form> status
  return <button disabled={pending}>Submit</button>
}
```

### USEOPTIMISTIC — REQUIRED FOR OPTIMISTIC UI

```tsx
// ✅ REQUIRED: Optimistic updates pattern
import { useOptimistic } from 'react'

function Messages({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  )

  async function sendMessage(formData) {
    const message = formData.get('message')
    addOptimisticMessage(message) // Instant UI update
    await saveMessage(message) // Server persistence
  }

  return (
    <form action={sendMessage}>
      {optimisticMessages.map(m => <p key={m.id}>{m.text}</p>)}
      <input name="message" />
    </form>
  )
}
```

---

## SERVER ACTIONS — STRICT PROTOCOL

### USE SERVER DIRECTIVE — EXACT PLACEMENT

```tsx
// ✅ REQUIRED: 'use server' at top of file for Server Actions
// actions.ts
'use server'

export async function createUser(formData: FormData) {
  // Server-only code: database, filesystem, etc.
  'use server' // Can also be inline for single functions
  await db.user.create({...})
  revalidateTag('users')
}
```

### CALLING SERVER ACTIONS — CLIENT COMPONENT RULES

```tsx
// ✅ REQUIRED: Import Server Action into Client Component
'use client'
import { createUser } from './actions'

export function UserForm() {
  return (
    <form action={createUser}> {/* Automatic Server Action binding */}
      <input name="email" />
      <button type="submit">Create</button>
    </form>
  )
}
```

---

## RE-RENDERING PREVENTION — ZERO TOLERANCE

### REACT COMPILER — ENABLE BY DEFAULT

```tsx
// next.config.ts
const nextConfig = {
  reactCompiler: true, // REQUIRED: Automatic memoization
}
export default nextConfig
```

### STRICT ANTI-PATTERNS — NEVER ALLOW

```tsx
// ❌ FORBIDDEN: Inline object/array in render (causes re-render)
function Component() {
  return <Child style={{ color: 'red' }} items={['a', 'b']} /> // NEW OBJECT/ARRAY EVERY RENDER
}

// ❌ FORBIDDEN: Inline function in render (causes re-render)
function Component() {
  return <button onClick={() => doSomething()}>Click</button> // NEW FUNCTION EVERY RENDER
}

// ❌ FORBIDDEN: Unnecessary useEffect for derived state
useEffect(() => {
  setFullName(`${firstName} ${lastName}`) // DERIVED STATE IN EFFECT
}, [firstName, lastName])

// ✅ REQUIRED: useMemo for expensive computations ONLY
const expensiveValue = useMemo(() => computeExpensive(data), [data])

// ✅ REQUIRED: useCallback for props that are functions (if not using React Compiler)
const handleClick = useCallback(() => doSomething(), [])
```

### STATE MANAGEMENT — MINIMAL AND PROXIMAL

```tsx
// ✅ REQUIRED: State closest to where it's used (Co-location)
// ❌ FORBIDDEN: Global state for local concerns
// ❌ FORBIDDEN: Prop drilling through 3+ levels

// ✅ REQUIRED: Lift state only when necessary
// ✅ REQUIRED: Use Server Components to fetch, pass as props
// ✅ REQUIRED: URL as state for shareable/filterable views
```

---

## PERFORMANCE OPTIMIZATION — MANDATORY

### NEXT.JS 16 CACHE COMPONENTS — USE CACHE DIRECTIVE

```tsx
// ✅ REQUIRED: 'use cache' for cacheable components/functions
// next.config.ts MUST have: cacheComponents: true

// app/page.tsx
'use cache' // Caches this component's output

export default async function Page() {
  const data = await fetchData() // Cached automatically
  return <div>{data}</div>
}

// ✅ REQUIRED: Cache individual functions
'use cache'
export async function getUser(id: string) {
  return await db.user.findUnique({ where: { id } })
}
```

### REVALIDATION — EXPLICIT API CHOICE

```tsx
// ✅ REQUIRED: revalidateTag for stale-while-revalidate
import { revalidateTag } from 'next/cache'
revalidateTag('blog-posts', 'max') // Tag + cacheLife profile

// ✅ REQUIRED: updateTag for read-your-writes (Server Actions only)
'use server'
import { updateTag } from 'next/cache'
export async function updateUser() {
  await db.user.update(...)
  updateTag('users') // Immediate fresh data
}

// ✅ REQUIRED: refresh for uncached data only
import { refresh } from 'next/cache'
refresh() // No cache touch, just refresh dynamic data
```

### RESOURCE PRELOADING — CRITICAL PATH OPTIMIZATION

```tsx
// ✅ REQUIRED: Preload critical resources
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'

function MyComponent() {
  prefetchDNS('https://api.example.com') // DNS prefetch
  preconnect('https://cdn.example.com') // Early connection
  preload('/fonts/main.woff2', { as: 'font' }) // Critical font
  preinit('/analytics.js', { as: 'script' }) // Execute immediately
  return <div>...</div>
}
```

---

## SEO & ACCESSIBILITY (A11Y) — NON-NEGOTIABLE

### DOCUMENT METADATA — NATIVE REACT 19

```tsx
// ✅ REQUIRED: Native metadata tags (hoisted to <head> automatically)
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title> {/* REQUIRED: Page title */}
      <meta name="description" content={post.excerpt} />
      <meta name="author" content={post.author} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.image} />
      <link rel="canonical" href={post.url} />
      <h1>{post.title}</h1>
    </article>
  )
}
```

### ACCESSIBILITY REQUIREMENTS — ZERO EXCUSES

```tsx
// ✅ REQUIRED: Semantic HTML always
// ❌ FORBIDDEN: <div> for buttons, <span> for headings

// ✅ REQUIRED: ARIA labels where semantic HTML insufficient
<button aria-label="Close dialog">×</button>

// ✅ REQUIRED: Form accessibility
<form>
  <label htmlFor="email">Email Address</label>
  <input 
    id="email" 
    name="email" 
    type="email" 
    required 
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">{error}</span>
</form>

// ✅ REQUIRED: Focus management
// ✅ REQUIRED: Keyboard navigation support
// ✅ REQUIRED: Color contrast WCAG 2.1 AA minimum
// ✅ REQUIRED: Reduced motion media query respect
```

### IMAGE OPTIMIZATION — NEXT/IMAGE MANDATORY

```tsx
// ✅ REQUIRED: next/image for all images
import Image from 'next/image'

// ✅ REQUIRED: Explicit dimensions to prevent layout shift
<Image
  src="/photo.jpg"
  alt="Descriptive text for screen readers"
  width={800}
  height={600}
  priority // For LCP images
  sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
/>

// ✅ REQUIRED: Remote patterns configured in next.config.ts
// ❌ FORBIDDEN: Unoptimized <img> tags
```

---

## RESPONSIVE DESIGN — STRICT BREAKPOINT SYSTEM

### MANDATORY BREAKPOINTS

```css
/* ✅ REQUIRED: Mobile-first approach */
/* Base: Mobile (320px+) */
/* Tablet: 768px+ */
/* Desktop: 1220px+ */

/* Tailwind classes (if using Tailwind) */
/* sm: 640px | md: 768px | lg: 1024px | xl: 1280px */
```

### FLUID LAYOUT REQUIREMENTS

```tsx
// ✅ REQUIRED: Fluid containers with max-width
<div className="w-full max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">

// ✅ REQUIRED: Responsive typography (clamp or Tailwind)
<h1 className="text-2xl md:text-3xl lg:text-4xl">
// Or CSS: font-size: clamp(1.5rem, 4vw + 1rem, 3rem);

// ✅ REQUIRED: Responsive grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ REQUIRED: Touch targets minimum 44x44px on mobile
<button className="min-h-[44px] min-w-[44px] p-3">
```

### IMAGE RESPONSIVENESS

```tsx
// ✅ REQUIRED: Responsive images with srcset
<Image
  src="/hero.jpg"
  alt="Hero image"
  fill
  sizes="(max-width: 320px) 100vw, 
         (max-width: 768px) 100vw, 
         (max-width: 1220px) 50vw, 
         600px"
  className="object-cover"
/>
```

---

## SUSPENSE & ERROR HANDLING — REQUIRED PATTERNS

### SUSPENSE BOUNDARIES — MANDATORY

```tsx
// ✅ REQUIRED: Suspense for all async components
import { Suspense } from 'react'

function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AsyncComponent />
    </Suspense>
  )
}

// ✅ REQUIRED: Granular Suspense for streaming
function Page() {
  return (
    <>
      <header>Static content</header>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
      <Suspense fallback={<ReviewSkeleton />}>
        <Reviews />
      </Suspense>
    </>
  )
}
```

### ERROR BOUNDARIES — REQUIRED

```tsx
// ✅ REQUIRED: Error boundaries for error isolation
// app/error.tsx (Client Component)
'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## STYLESHEETS & SCRIPTS — REACT 19 NATIVE

### STYLESHEET PRELOADING — REQUIRED

```tsx
// ✅ REQUIRED: precedence for stylesheet loading order
function Component() {
  return (
    <Suspense fallback="loading...">
      <link 
        rel="stylesheet" 
        href="/critical.css" 
        precedence="high" 
      />
      <link 
        rel="stylesheet" 
        href="/optional.css" 
        precedence="default" 
      />
      <div className="content">...</div>
    </Suspense>
  )
}
```

### ASYNC SCRIPTS — DEDUPLICATION GUARANTEED

```tsx
// ✅ REQUIRED: Async scripts anywhere in tree, deduplicated automatically
function Analytics() {
  return (
    <div>
      <script async={true} src="https://analytics.com/script.js" />
    </div>
  )
}
// Rendered multiple times = only loaded once
```

---

## PRE-CODING CHECKLIST — MANDATORY BEFORE ANY CODE

Before writing ANY function or component:

1. **Check `node_modules/next/dist/docs/`** — Is this API still valid?
2. **Server or Client?** — Default to Server, justify Client boundary
3. **Data flow** — Where does data come from? Server fetch → props
4. **Interactivity** — Can this be Server Component + Client islands?
5. **Re-rendering** — Will React Compiler prevent this? If not, useMemo/useCallback
6. **Accessibility** — ARIA labels? Semantic HTML? Keyboard support?
7. **Responsive** — Mobile (320px) → Tablet (768px) → Desktop (1220px)
8. **Performance** — 'use cache'? Suspense? Preload resources?
9. **Error handling** — Error boundary? Loading state?

---

## ANTI-PATTERN DETECTION — AUTOMATIC REJECTION

These patterns trigger IMMEDIATE correction:

```tsx
// 🚫 useEffect for data fetching in Server Component
// 🚫 useState without 'use client' directive
// 🚫 forwardRef usage
// 🚫 <Context.Provider> instead of <Context>
// 🚫 Manual isPending state instead of useActionState
// 🚫 Inline objects/functions in JSX without memoization
// 🚫 <img> instead of <Image />
// 🚫 Missing alt text on images
// 🚫 Hardcoded px values without responsive consideration
// 🚫 Missing Suspense for async components
// 🚫 'use client' at page level (island architecture required)
// 🚫 Server Actions without 'use server'
// 🚫 Client Components importing server-only modules
```

---

## DOCUMENTATION REFERENCES — CONSULT BEFORE CODING

- **Next.js 16**: `node_modules/next/dist/docs/`
- **React 19**: `node_modules/next/dist/docs/react-19.md` (if exists)
- **Server Components**: `node_modules/next/dist/docs/server-components.md`
- **Server Actions**: `node_modules/next/dist/docs/server-actions.md`
- **Caching**: `node_modules/next/dist/docs/caching.md`

**VIOLATION OF THESE RULES PRODUCES BROKEN, OUTDATED, NON-PERFORMANT CODE.**
<!-- END:nextjs-agent-rules -->
