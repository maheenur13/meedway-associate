# Meedway Trust — Design System

A custom theme for an international recruitment agency. Balances **corporate trust**
(deep navy, teal) with a **warm, human touch** (amber) suited to a people-first
workforce brand.

## Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `navy` (primary) | `#12263A` | Headers, footer, primary surfaces, nav |
| `navy-700` | `#1B3A57` | Hover/darker navy surfaces |
| `teal` (accent) | `#1F8A8A` | Links, secondary buttons, icons, highlights |
| `teal-200` | `#A7D8D8` | Soft accent backgrounds, borders |
| `amber` (CTA) | `#F4A930` | Primary CTA buttons (Apply, Request Workers) |
| `amber-600` | `#D98E1C` | CTA hover |
| `cloud` (bg) | `#F7F9FB` | Page background, light sections |
| `white` | `#FFFFFF` | Cards, surfaces |
| `slate` (text) | `#33475B` | Body text |
| `slate-500` | `#5A6B7B` | Muted/secondary text |
| `success` | `#2E9E6B` | Status: open/active |
| `danger` | `#D64545` | Status: closed/errors |

## Typography
- **Headings:** Sora (700/600) — modern, confident, trustworthy
- **Body / UI:** Inter (400/500) — highly legible, great for forms & Bengali fallback
- **Bengali:** Noto Sans Bengali (matched weights for bilingual consistency)

## Scale & Style
- Rounded corners: `rounded-xl` (12px) on cards/buttons for a friendly feel
- Soft shadows for cards; generous whitespace
- Buttons: Amber (primary CTA), Navy (secondary), Teal (tertiary/links)
- Motion: Framer Motion — scroll-reveal on sections, subtle hover lifts, page transitions
- Accessibility: all text/background pairs meet WCAG AA contrast

## Tailwind mapping (to implement)
```
colors: {
  navy:   { DEFAULT: '#12263A', 700: '#1B3A57' },
  teal:   { DEFAULT: '#1F8A8A', 200: '#A7D8D8' },
  amber:  { DEFAULT: '#F4A930', 600: '#D98E1C' },
  cloud:  '#F7F9FB',
  slate:  { DEFAULT: '#33475B', 500: '#5A6B7B' },
  success:'#2E9E6B',
  danger: '#D64545',
}
fontFamily: {
  heading: ['Sora', 'sans-serif'],
  body:    ['Inter', 'Noto Sans Bengali', 'sans-serif'],
}
```
