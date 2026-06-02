# LinguaLive AI — Next.js Full-Stack App

**Real-time AI voice translation for Indian languages** built with Next.js 16, MongoDB, and Framer Motion.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB + Mongoose
- **UI:** Tailwind CSS 4 + shadcn/ui + Framer Motion
- **Voice:** Web Speech API (browser-native)
- **Translation:** MyMemory API (free, no key needed)
- **TypeScript:** Fully typed

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Next.js API Routes
│   │   ├── contact/            # Contact form submission
│   │   └── translate/          # Translation endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── sections/               # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── LiveDemo.tsx        # Voice translation demo
│   │   ├── Contact.tsx
│   │   └── ... (13 sections total)
│   └── ui/                     # shadcn UI components
├── hooks/                      # React hooks
├── lib/
│   ├── mongodb.ts              # MongoDB connection
│   └── utils.ts                # Utilities (cn, etc.)
└── models/
    ├── Contact.ts              # Contact Mongoose schema
    └── Translation.ts          # Translation Mongoose schema
```

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/Lingulive?retryWrites=true&w=majority
NEXT_PUBLIC_APP_NAME=LinguaLive AI
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run Dev Server

```bash
npm run dev
```

App runs on **http://localhost:3000**

---

## 🎯 Features

### ✅ Implemented

- **16 Indian Languages:** Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, Sinhala, English (India)
- **Real-time Voice Recognition:** Browser Web Speech API
- **Live Translation:** MyMemory API + MongoDB logging
- **Contact Form:** MongoDB submission with rate limiting
- **Responsive Design:** Mobile-first Tailwind CSS
- **Animations:** Framer Motion for smooth transitions
- **Type Safety:** Full TypeScript coverage

### 🔧 API Routes

#### `POST /api/translate`

Translates text between Indian languages.

**Request:**
```json
{
  "text": "नमस्ते! आप कैसे हैं?",
  "sourceLanguage": "hi",
  "targetLanguage": "en",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "translation": {
    "sourceText": "नमस्ते! आप कैसे हैं?",
    "translatedText": "Hello! How are you?",
    "sourceLanguage": "hi",
    "targetLanguage": "en",
    "confidence": 0.95,
    "processingTime": 245
  }
}
```

#### `POST /api/contact`

Submits contact form.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "Interested in enterprise plan"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! We will get back to you within 24 hours.",
  "id": "507f1f77bcf86cd799439011"
}
```

---

## 🗄️ Database Models

### Translation

```typescript
{
  sourceText: string (max 2000 chars)
  translatedText: string (max 2000 chars)
  sourceLanguage: enum (16 Indian languages)
  targetLanguage: enum (16 Indian languages)
  sessionId?: string
  confidence: number (0-1)
  processingTime: number (ms)
  createdAt: Date
}
```

### Contact

```typescript
{
  name: string (max 100 chars)
  email: string (validated)
  company?: string (max 100 chars)
  message: string (max 1000 chars)
  status: 'new' | 'read' | 'replied'
  createdAt: Date
}
```

---

## 🎨 UI Components

Built with **shadcn/ui** (50+ components):

- `button`, `card`, `dialog`, `form`, `input`, `select`, `toast`, `accordion`, `tabs`, etc.
- All components in `src/components/ui/`
- Tailwind CSS 4 + CSS Variables theming

---

## 📦 Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Deploy to Vercel

```bash
vercel
```

Environment variables needed:
- `MONGO_URI`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_API_URL` (optional if using internal API routes)

---

## 🧪 Development Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run typecheck    # TypeScript validation
```

---

## 🌐 Supported Languages

| Language | Code | Voice Support | Translation Support |
|----------|------|---------------|---------------------|
| Hindi | hi | ✅ Best | ✅ Excellent |
| Bengali | bn | ✅ Good | ✅ Good |
| Telugu | te | ✅ Good | ✅ Good |
| Tamil | ta | ✅ Good | ✅ Good |
| Marathi | mr | ✅ Good | ✅ Good |
| Gujarati | gu | ✅ Good | ✅ Good |
| Kannada | kn | ✅ Good | ✅ Good |
| Malayalam | ml | ✅ Good | ✅ Good |
| Punjabi | pa | ✅ Works | ✅ Good |
| Odia | or | ⚠️ Partial | ✅ Good |
| Assamese | as | ⚠️ Partial | ✅ Good |
| Urdu | ur | ✅ Works | ✅ Good |
| Sanskrit | sa | ⚠️ Rare | ✅ Limited |
| Nepali | ne | ⚠️ Partial | ✅ Good |
| Sinhala | si | ⚠️ Limited | ✅ Good |
| English (India) | en | ✅ Best | ✅ Excellent |

**Note:** Voice recognition works best in Chrome/Edge browsers.

---

## 🔒 Security

- ✅ MongoDB connection caching (Next.js optimized)
- ✅ Environment variables for secrets
- ✅ Input validation on API routes
- ✅ CORS configured
- ⚠️ Rate limiting recommended for production

---

## 📝 License

MIT

---

## 👨‍💻 Author

Built by the LinguaLive AI team.
