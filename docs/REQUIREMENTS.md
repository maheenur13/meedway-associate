# Meedway Overseas — Website Requirements Document

_Last updated: 2026-07-25_

## 1. Project Summary
A bilingual (English + Bengali) marketing website with a fully content-managed
admin portal for an international recruitment agency that connects skilled,
semi-skilled, and general workers with overseas employers. Public visitors can
browse jobs, apply, request workers, and contact the company. Admins manage all
site content and view submissions through a secure dashboard.

## 2. Confirmed Decisions
| Area | Decision |
|------|----------|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui components + Framer Motion animations |
| Design theme | "Meedway Trust" — see DESIGN_SYSTEM.md (Navy/Teal/Amber, Sora + Inter + Noto Sans Bengali) |
| ORM / DB | Prisma + Neon (Postgres) |
| File storage | Cloudinary (CV uploads, logo, photos) |
| Forms | Stored in database + viewable in admin panel |
| Admin auth | Email + password (NextAuth / Auth.js, credentials) |
| CMS scope | Full content management — company info, logo, licence, address, photos, jobs, page text |
| Languages | English (default) + Bengali (i18n, both editable in admin) |
| Design direction | I choose — professional, trustworthy recruitment look; strong UI/UX, color, animation |

## 3. Public Website Pages

### 3.1 Home
- Hero banner: headline "Connecting Skilled Workers with International Employers" + description + CTA buttons: **View Available Jobs**, **Apply for a Job**, **Request Workers**, **Contact Us**
- Sections: company intro, countries recruited for, worker types, recruitment process (steps), why choose us, contact + floating WhatsApp button
- Worker categories: Construction, Factory, Drivers, Cleaners, Hotel/Restaurant, Electricians, Plumbers, Welders, Caregivers, General

### 3.2 About Us
- Company name, year established, background, mission, vision, licence number, office address, countries served, company values, management/team info, office & team photos

### 3.3 Services
- **For Job Seekers:** overseas job info, registration, CV collection, interview prep, skills assessment, document assistance, medical test guidance, visa processing, pre-departure orientation, travel coordination
- **For Employers:** worker sourcing, screening, interview arrangement, skills/trade testing, document verification, visa documentation, deployment, post-deployment communication
- **Industries served** (icon + short description): Construction, Manufacturing, Hospitality, Cleaning, Transportation, Agriculture, Healthcare support, Engineering, General workforce

### 3.4 Available Jobs
- Job cards with: title, country, vacancies, salary, working hours, contract duration, required experience, required documents, accommodation, application deadline, **Apply** button
- Filtering by country/category (nice-to-have)

### 3.5 Job Application Form
Fields: full name, phone, WhatsApp, email, job position, preferred country, experience, current address, CV upload, message.

### 3.6 Request Workers Form (Employers)
Fields (confirmed): company name, contact person, email, phone/WhatsApp, country, worker category, number of workers needed, message.

### 3.7 Contact
Contact details, WhatsApp button, contact form, embedded map (optional).

## 4. Admin Portal (authenticated)
- **Auth:** email + password login; manage admin accounts
- **Job listings:** full CRUD, publish/unpublish, deadline handling
- **Applications:** list, filter, view detail, download CV, export (CSV) — status tracking (new/reviewed) nice-to-have
- **Worker requests:** list, view, mark handled
- **Site content CMS:** edit company profile (name, licence, address, year, mission, vision, values), manage logo & photos, edit page copy, worker categories, industries, recruitment steps, countries — all with English + Bengali fields
- **Media management:** upload/replace logo and photos

## 5. Internationalization
- next-intl (or similar). Default English, Bengali toggle.
- Admin content stored with per-language fields (en / bn).
- Bengali is LTR (no RTL needed).

## 6. Data Model (initial draft)
- `User` (admin): id, email, passwordHash, name, role
- `Job`: id, title{en,bn}, country, category, vacancies, salary, workingHours, contractDuration, experience, requiredDocuments, accommodation, deadline, isPublished, timestamps
- `Application`: id, jobId?, fullName, phone, whatsapp, email, position, preferredCountry, experience, address, cvUrl, message, status, createdAt
- `WorkerRequest`: id, companyName, contactPerson, email, phone, country, category, quantity, message, status, createdAt
- `SiteContent` / `CompanyProfile`: key-value or structured content with {en,bn} fields
- `WorkerCategory`, `Industry`, `RecruitmentStep`, `Country`, `MediaAsset`

## 7. Non-Functional
- Responsive (mobile-first), fast, SEO-friendly (metadata, sitemap), accessible
- Smooth animations (scroll reveal, hover, page transitions) without hurting performance
- Secure admin routes, hashed passwords, input validation, file-type/size limits on uploads, spam protection on public forms

## 8. Open Items / To Confirm
1. Company name & logo — provide when ready (placeholder "Meedway Overseas" until then).
2. Licence number, office address, year established, phone, WhatsApp, email.
3. Real countries served & initial job listings (or seed with placeholders).
4. Office/team photos.
5. Domain & hosting (Vercel recommended for Next.js + Neon).
6. Cloudinary account/credentials (cloud name, API key/secret).
7. Neon Postgres connection string.

## 9. Proposed Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Prisma + Neon Postgres
- NextAuth (Auth.js) credentials
- next-intl for i18n
- File uploads: Cloudinary
- Deployment: Vercel

## 10. Suggested Build Phases
1. Project setup (Next.js, Tailwind, Prisma/Neon, i18n scaffolding)
2. Data model + migrations + seed
3. Public pages with placeholder content + design system
4. Forms (application, worker request, contact) wired to DB + uploads
5. Admin auth + dashboard (jobs, applications, requests)
6. Content CMS + media management
7. Bengali translations + language toggle
8. Polish: animations, SEO, accessibility, deploy
