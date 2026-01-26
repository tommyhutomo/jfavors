# Pastel Events – Next.js + Tailwind CSS Template

A clean, pastel‑themed marketing site template for an events/agency company (inspired by a simple brochure site). Built with **Next.js (App Router)** and **Tailwind CSS**.

## Features
- App Router structure (`app/`)
- Pastel color palette + brand color
- Responsive Navbar & Footer
- Hero, Features, Services, CTA sections
- Contact page with working API mock (`app/api/contact/route.ts`)
- Accessible components (semantic HTML, focus states)

## Getting Started

```bash
# 1) Install dependencies
npm install

# 2) Run dev server
npm run dev
# Open http://localhost:3000

# 3) Build for production
npm run build
npm start
```

## Pastel Palette (Tailwind theme)
- Pink `#FFD1DC` · Rose `#F6D1C1` · Peach `#FDD5B1`
- Blue `#AEC6CF` · Baby Blue `#89CFF0` · Lavender `#E3E4FA` · Periwinkle `#C3CDE6`
- Green `#77DD77` · Mint `#AAF0D1` · Tea Green `#D0F0C0`
- Yellow `#FDFD96` · Cream `#FFFDD0` · Gray `#CFCFC4`

## Customize
- Update colors in `tailwind.config.js` under `theme.extend.colors`
- Replace the logo in `public/logo.svg`
- Edit sections in `app/page.tsx` and components in `components/`

## Notes
This template focuses on structure and style. Replace contact API logic with your email/CRM integration.
