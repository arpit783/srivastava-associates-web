# Srivastava Associates – Full-Stack Loan DSA Website

> **Easy Loan, Happy Life** | Built with Next.js 14, Firebase, WhatsApp Cloud API

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Email**: Nodemailer (Gmail SMTP)
- **WhatsApp**: Meta WhatsApp Cloud API
- **Deployment**: Vercel (free tier)
- **Styling**: Tailwind CSS

---

## Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local` and fill in your values:

```env
# Firebase Client SDK (from Firebase Console → Project Settings → Web App)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK (from Firebase Console → Service Accounts → Generate new private key)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Gmail SMTP (use App Password, not account password)
GMAIL_USER=srivastavaassociates01@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# WhatsApp Cloud API (Meta Business Manager)
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_VERIFY_TOKEN=srivastava_webhook_verify_2024
NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=918306445333

# Admin
ADMIN_PASSWORD=srivastava@admin2024
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
CRON_SECRET=your-random-secret
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Setup Checklist

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Firestore Database** (production mode)
4. Enable **Firebase Storage**
5. Create a Web App → copy the config into `NEXT_PUBLIC_FIREBASE_*` env vars
6. Go to Project Settings → Service Accounts → Generate new private key → use in `FIREBASE_*` env vars
7. Deploy Firestore rules: `firebase deploy --only firestore:rules`

### Gmail SMTP Setup
1. Go to Google Account → Security → 2-Step Verification (enable)
2. Go to App Passwords → Create app password for "Mail"
3. Use this 16-char password as `GMAIL_APP_PASSWORD`

### WhatsApp Cloud API Setup (One-time)
1. Go to [business.facebook.com](https://business.facebook.com) → Create Business Manager
2. Add your dedicated WhatsApp Business number → verify via OTP
3. Go to Meta Developers → Create App → Add WhatsApp product
4. Generate permanent access token
5. Register webhook URL: `https://your-vercel-url.vercel.app/api/whatsapp/webhook`
6. Verify token: `srivastava_webhook_verify_2024`
7. Submit message templates for approval (follow-up nudge, document received ack)

---

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Add all environment variables in Vercel Dashboard → Settings → Environment Variables**

The cron job in `vercel.json` runs daily at 10 AM IST automatically.

---

## Admin Portal
Access at `/admin` with the password set in `ADMIN_PASSWORD`.

**Features:**
- Leads & Customers table with filters and CSV export
- Per-lead case file with document vault (3-folder structure)
- WhatsApp send panel (checklist, EMI, custom messages)
- Email triggers
- Activity log with call notes and outcomes
- Bulk CSV import for existing customers
- Employee work tracker
- Bank rate table editor
- Testimonials CMS

---

## Project Structure

```
app/
├── (site)/          # Public website pages
├── admin/           # Admin portal (password protected)
├── upload/[token]/  # Lead browser document upload
└── api/             # Server API routes

components/
├── home/            # Homepage sections
├── calculators/     # EMI calculator
├── admin/           # Admin UI components
└── ui/              # Shared components

lib/
├── firebase.ts           # Client-side Firebase
├── firebase-admin.ts     # Server-side Firebase Admin
├── whatsapp.ts           # WhatsApp Cloud API client
├── mailer.ts             # Nodemailer email
├── document-checklists.ts # Loan document checklists
├── document-matcher.ts    # WhatsApp caption → document slot
├── csv-parser.ts          # Bulk customer import
└── types.ts               # TypeScript types
```
