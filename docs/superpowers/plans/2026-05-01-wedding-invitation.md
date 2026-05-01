# Wedding Invitation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page wedding invitation site for Екатерина & Никита (04.07.2026, Волгоград) with botanical pastel design, RSVP via Google Forms, music toggle, countdown — hosted on GitHub Pages.

**Architecture:** Static site built with Astro. One source-of-truth data file (`src/data/wedding.ts`) feeds compositional components. Logic (countdown, RSVP, music) sits in vanilla TypeScript modules referenced from component scripts. Output is plain HTML/CSS/JS in `dist/`, deployed via GitHub Actions to GitHub Pages.

**Tech Stack:** Astro 4.x · TypeScript · vanilla CSS with custom properties · Google Fonts (Pinyon Script, Cormorant Garamond, Inter) · Vitest for unit tests of pure logic · GitHub Actions for deploy.

**Spec:** `docs/superpowers/specs/2026-05-01-wedding-invitation-design.md`

---

## Task 0: Project scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `README.md`, `.nvmrc`

- [ ] **Step 1: Initialize npm project and install Astro**

```bash
cd /c/Users/User/projects/invite
npm init -y
npm install astro@^4.16 typescript@^5.6
npm install -D vitest@^2.1 @types/node@^22
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config'

const repoName = 'invite'
const ghUser = 'ImpossibleS5'

export default defineConfig({
  site: `https://${ghUser}.github.io`,
  base: `/${repoName}/`,
  output: 'static',
  build: { format: 'directory', assets: 'assets' },
  trailingSlash: 'always',
})
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.env.local
.DS_Store
*.log
```

- [ ] **Step 5: Update `package.json` scripts and metadata**

Open `package.json` and replace its content with:

```json
{
  "name": "invite",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^4.16",
    "typescript": "^5.6"
  },
  "devDependencies": {
    "vitest": "^2.1",
    "@types/node": "^22"
  }
}
```

- [ ] **Step 6: Create minimal `README.md`**

```markdown
# Wedding Invitation — Екатерина & Никита

Static invitation site for the wedding on **04.07.2026** in Волгоград.

## Local development

\`\`\`bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run test     # runs vitest
\`\`\`

## Deploy

Pushes to `main` trigger GitHub Actions, which builds and publishes to GitHub Pages.

Site URL: `https://impossibles5.github.io/invite/`
```

- [ ] **Step 7: Create `.nvmrc`**

File content: `20`

- [ ] **Step 8: Initialize git, make initial commit**

```bash
git init
git branch -M main
git add .
git commit -m "chore: scaffold Astro project"
```

Expected: working tree clean, one commit.

---

## Task 1: Vitest setup + first sanity test

**Files:**
- Create: `vitest.config.ts`, `tests/sanity.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
```

- [ ] **Step 2: Write sanity test**

`tests/sanity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('sanity', () => {
  it('arithmetic still works', () => {
    expect(2 + 2).toBe(4)
  })
})
```

- [ ] **Step 3: Run test**

```bash
npm test
```

Expected: 1 passed, 0 failed.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/sanity.test.ts package.json
git commit -m "test: add vitest config and sanity check"
```

---

## Task 2: Wedding data model

**Files:**
- Create: `src/data/wedding.ts`

- [ ] **Step 1: Create `src/data/wedding.ts` with the single source of truth**

```ts
export const wedding = {
  couple: {
    bride: 'Екатерина',
    groom: 'Никита',
    displayName: 'Екатерина & Никита',
  },

  date: {
    iso: '2026-07-04T15:30:00+03:00',
    weekday: 'суббота',
    day: '04',
    month: 'Июль',
    monthShort: 'июл',
    year: '2026',
    pretty: '04 Июля 2026',
  },

  venue: {
    name: 'Ресторан «Фьюжн»',
    addressShort: 'Волгоград, ул. Автомагистральная, 2/1',
    website: 'https://fusion34.ru',
    yandexMapsUrl:
      'https://yandex.ru/maps/?text=Волгоград%2C+ул.+Автомагистральная%2C+2%2F1',
    yandexMapEmbed:
      'https://yandex.ru/map-widget/v1/?ll=44.516%2C48.690&z=15&pt=44.516%2C48.690%2Cpm2rdm&l=map',
  },

  program: [
    {
      time: '11:30',
      title: 'Выкуп невесты',
      place: 'ул. Анны Купалы, 67, Волгоград',
    },
    {
      time: '15:30',
      title: 'Торжественная регистрация',
      place: 'ЗАГС Советского района, г. Волгоград',
    },
    {
      time: '16:30',
      title: 'Свадебный фуршет',
      place: 'Ресторан «Фьюжн»',
    },
  ],

  dressCode: {
    intro:
      'Мы будем признательны, если вы поддержите цветовую гамму торжества в своих нарядах',
    palette: [
      { name: 'Нежно-голубой', hex: '#B8D4E8', pantone: '13-4308' },
      { name: 'Коралловый', hex: '#F2A48E', pantone: '15-1247' },
      { name: 'Пыльная роза', hex: '#F0C4C4', pantone: '13-1407' },
      { name: 'Лавандовый', hex: '#C9BCD8', pantone: '14-3812' },
      { name: 'Мятно-зелёный', hex: '#B8D8C0', pantone: '13-6008' },
    ],
    note: 'Просьба избегать неоновых тонов и полностью чёрных нарядов',
  },

  quote: 'All you need is love',

  music: {
    src: '',
    title: 'Фоновая музыка',
    autoPromptDelayMs: 4000,
    placeholderToast: 'Музыка появится позже',
  },

  rsvp: {
    formActionUrl: 'https://docs.google.com/forms/d/e/REPLACE_FORM_ID/formResponse',
    fields: {
      name: 'entry.0000000000',
      attendance: 'entry.0000000001',
    },
    attendanceValues: {
      yes: 'Я с удовольствием приду',
      no: 'К сожалению, не смогу присутствовать',
    },
    successMessage: 'Спасибо! Мы вас ждём ❤',
    declineMessage: 'Жаль, что не сможете быть. Спасибо, что дали знать!',
    errorMessage: 'Что-то пошло не так. Попробуйте ещё раз или обновите страницу.',
  },
} as const

export type Wedding = typeof wedding
```

- [ ] **Step 2: Add a type-check via TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/wedding.ts
git commit -m "feat(data): add wedding data source of truth"
```

---

## Task 3: Design tokens + global CSS

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
:root {
  /* Backgrounds */
  --bg-base:        #FBF8F3;
  --bg-paper:       #FFFFFF;
  --bg-soft:        #F5EFE6;

  /* Ink */
  --ink-primary:    #3A3530;
  --ink-secondary:  #6B5F55;
  --ink-muted:      #A39788;

  /* Accents */
  --accent-gold:    #B89968;
  --accent-gold-deep: #94793F;
  --accent-rose:    #D4A5A5;
  --accent-rose-deep: #B07878;

  /* Dress-code palette */
  --pal-blue:    #B8D4E8;
  --pal-coral:   #F2A48E;
  --pal-rose:    #F0C4C4;
  --pal-lavender:#C9BCD8;
  --pal-mint:    #B8D8C0;

  /* Lines and shadows */
  --line-soft:    #E8DFD2;
  --shadow-soft:  0 4px 24px rgba(58, 53, 48, 0.06);
  --shadow-card:  0 8px 32px rgba(58, 53, 48, 0.08);

  /* Typography */
  --font-script:  'Pinyon Script', cursive;
  --font-serif:   'Cormorant Garamond', serif;
  --font-sans:    'Inter', system-ui, sans-serif;

  /* Layout */
  --container-w:  480px;
  --section-gap:  80px;
  --section-gap-lg: 120px;
  --radius-card:  16px;
  --radius-pill:  999px;
}

@media (min-width: 768px) {
  :root {
    --section-gap: var(--section-gap-lg);
  }
}
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=Pinyon+Script&display=swap');

@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg-base);
  color: var(--ink-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img { max-width: 100%; display: block; }

a {
  color: var(--accent-gold-deep);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 150ms ease-out;
}
a:hover { border-color: var(--accent-gold-deep); }

.container {
  max-width: var(--container-w);
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: var(--section-gap) 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
}
.section.visible {
  opacity: 1;
  transform: none;
}

.section-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  color: var(--accent-gold-deep);
  margin: 0 0 24px;
}

.divider {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--accent-gold);
  margin: 0 auto;
  max-width: 240px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--accent-gold);
  opacity: 0.5;
}

button {
  font-family: inherit;
  cursor: pointer;
}

button.primary {
  background: var(--accent-rose);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  transition: background 150ms ease-out, transform 150ms ease-out;
}
button.primary:not(:disabled):hover { background: var(--accent-rose-deep); }
button.primary:not(:disabled):active { transform: translateY(1px); }
button.primary:disabled {
  background: var(--ink-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

button.ghost {
  background: transparent;
  color: var(--accent-gold-deep);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-pill);
  padding: 12px 24px;
  font-size: 14px;
  transition: background 150ms ease-out;
}
button.ghost:hover { background: rgba(184, 153, 104, 0.1); }
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat(styles): add design tokens and global CSS"
```

---

## Task 4: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css'
import { wedding } from '../data/wedding'

interface Props {
  title?: string
  description?: string
}

const {
  title = `${wedding.couple.displayName} — Приглашение на свадьбу`,
  description = `Приглашаем вас на нашу свадьбу ${wedding.date.pretty}. ${wedding.venue.name}, ${wedding.venue.addressShort}.`,
} = Astro.props
---

<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="theme-color" content="#FBF8F3" />
    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
    <title>{title}</title>
  </head>
  <body>
    <slot />

    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.15 }
      )
      document.querySelectorAll('.section').forEach((s) => observer.observe(s))
    </script>
  </body>
</html>
```

- [ ] **Step 2: Create favicon placeholder `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M16 28 C 6 22, 6 12, 12 10 C 14 9, 16 11, 16 12 C 16 11, 18 9, 20 10 C 26 12, 26 22, 16 28 Z"
        fill="#D4A5A5"/>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro public/favicon.svg
git commit -m "feat(layout): add Base layout with intersection observer for sections"
```

---

## Task 5: Botanical decor SVG

**Files:**
- Create: `public/decor/branch-corner.svg`, `public/decor/divider-leaf.svg`, `public/decor/hero-frame.svg`

- [ ] **Step 1: Create `public/decor/branch-corner.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <g stroke="#B89968" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.85">
    <path d="M5 5 C 30 25, 50 50, 70 80 C 80 95, 95 105, 115 115"/>
    <g opacity="0.85">
      <ellipse cx="20" cy="20" rx="6" ry="3" transform="rotate(-30 20 20)"/>
      <ellipse cx="35" cy="35" rx="6" ry="3" transform="rotate(-30 35 35)"/>
      <ellipse cx="55" cy="55" rx="6" ry="3" transform="rotate(-30 55 55)"/>
      <ellipse cx="75" cy="80" rx="7" ry="3.5" transform="rotate(-15 75 80)"/>
      <ellipse cx="95" cy="100" rx="7" ry="3.5" transform="rotate(-15 95 100)"/>
    </g>
  </g>
  <g fill="#D4A5A5" opacity="0.6">
    <circle cx="48" cy="46" r="4"/>
    <circle cx="86" cy="92" r="4"/>
  </g>
</svg>
```

- [ ] **Step 2: Create `public/decor/divider-leaf.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" fill="none">
  <g stroke="#B89968" stroke-width="1" stroke-linecap="round">
    <path d="M16 2 L16 14"/>
    <path d="M16 6 L8 4"/>
    <path d="M16 6 L24 4"/>
    <path d="M16 10 L10 9"/>
    <path d="M16 10 L22 9"/>
  </g>
  <circle cx="16" cy="14" r="1.5" fill="#D4A5A5"/>
</svg>
```

- [ ] **Step 3: Create `public/decor/hero-frame.svg`**

This is the placeholder for the Hero photo (1:1 botanical composition).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" fill="none">
  <rect width="480" height="480" fill="#F5EFE6"/>
  <g stroke="#B89968" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.7">
    <path d="M30 30 C 80 60, 130 100, 170 160"/>
    <path d="M450 30 C 400 60, 350 100, 310 160"/>
    <path d="M30 450 C 80 420, 130 380, 170 320"/>
    <path d="M450 450 C 400 420, 350 380, 310 320"/>
  </g>
  <g fill="#B8D8C0" opacity="0.7">
    <ellipse cx="80" cy="80" rx="14" ry="6" transform="rotate(-30 80 80)"/>
    <ellipse cx="120" cy="130" rx="14" ry="6" transform="rotate(-30 120 130)"/>
    <ellipse cx="400" cy="80" rx="14" ry="6" transform="rotate(30 400 80)"/>
    <ellipse cx="360" cy="130" rx="14" ry="6" transform="rotate(30 360 130)"/>
    <ellipse cx="80" cy="400" rx="14" ry="6" transform="rotate(30 80 400)"/>
    <ellipse cx="400" cy="400" rx="14" ry="6" transform="rotate(-30 400 400)"/>
  </g>
  <g fill="#F0C4C4" opacity="0.85">
    <circle cx="100" cy="110" r="10"/>
    <circle cx="380" cy="110" r="10"/>
    <circle cx="120" cy="380" r="10"/>
    <circle cx="360" cy="380" r="10"/>
  </g>
  <g fill="#B89968" opacity="0.5">
    <circle cx="240" cy="240" r="2"/>
  </g>
  <text x="240" y="260" text-anchor="middle"
        font-family="Pinyon Script, cursive" font-size="36" fill="#B89968" opacity="0.9">
    К & Н
  </text>
</svg>
```

- [ ] **Step 4: Commit**

```bash
git add public/decor/
git commit -m "feat(decor): add botanical SVG placeholders"
```

---

## Task 6: Header component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
const menu = [
  { href: '#letter', label: 'Приглашение' },
  { href: '#program', label: 'Программа дня' },
  { href: '#map', label: 'Карта' },
  { href: '#dresscode', label: 'Дресс-код' },
  { href: '#rsvp', label: 'Подтверждение' },
]
---

<header class="header" id="header">
  <div class="header__inner">
    <a class="header__brand" href="#hero">ПРИГЛАШЕНИЕ</a>

    <button class="header__music" id="music-toggle-header" aria-label="Включить музыку">
      <span class="header__music-icon" aria-hidden="true">♪</span>
      <span class="header__music-label">Музыка</span>
    </button>

    <button class="header__burger" id="header-burger" aria-label="Открыть меню" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>

  <nav class="menu" id="menu" aria-hidden="true">
    <button class="menu__close" id="menu-close" aria-label="Закрыть меню">×</button>
    <ul>
      {menu.map((m) => (
        <li><a href={m.href} class="menu__link">{m.label}</a></li>
      ))}
    </ul>
  </nav>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(8px);
    background: rgba(251, 248, 243, 0.85);
    border-bottom: 1px solid var(--line-soft);
  }
  .header__inner {
    max-width: var(--container-w);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
  }
  .header__brand {
    font-family: var(--font-serif);
    font-size: 14px;
    letter-spacing: 0.2em;
    color: var(--ink-primary);
    border-bottom: none;
  }
  .header__music {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-paper);
    border: 1px solid var(--line-soft);
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    color: var(--accent-gold-deep);
    font-size: 13px;
  }
  .header__music-icon { font-size: 14px; }
  .header__burger {
    background: transparent;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 0;
  }
  .header__burger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--ink-primary);
    margin: 0 auto;
  }
  .menu {
    position: fixed;
    inset: 0;
    background: var(--bg-base);
    transform: translateY(-100%);
    transition: transform 300ms ease-out;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
  }
  .menu[data-open='true'] { transform: none; }
  .menu__close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 32px;
    color: var(--ink-primary);
    line-height: 1;
  }
  .menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;
  }
  .menu__link {
    display: block;
    padding: 16px 0;
    font-family: var(--font-serif);
    font-size: 24px;
    color: var(--ink-primary);
    border-bottom: none;
  }
</style>

<script>
  const burger = document.getElementById('header-burger')
  const menu = document.getElementById('menu')
  const close = document.getElementById('menu-close')

  function setOpen(open: boolean) {
    if (!menu || !burger) return
    menu.dataset.open = String(open)
    menu.setAttribute('aria-hidden', String(!open))
    burger.setAttribute('aria-expanded', String(open))
    document.body.style.overflow = open ? 'hidden' : ''
  }

  burger?.addEventListener('click', () => setOpen(true))
  close?.addEventListener('click', () => setOpen(false))
  menu?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  )
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(header): add sticky header with menu"
```

---

## Task 7: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { wedding } from '../data/wedding'
const base = import.meta.env.BASE_URL
---

<section class="hero section" id="hero">
  <div class="container">
    <img class="hero__corner hero__corner--tl" src={`${base}decor/branch-corner.svg`} alt="" />
    <img class="hero__corner hero__corner--br" src={`${base}decor/branch-corner.svg`} alt="" />

    <div class="hero__photo">
      <img src={`${base}decor/hero-frame.svg`} alt="" />
    </div>

    <h1 class="hero__couple">{wedding.couple.displayName}</h1>

    <p class="hero__lead">
      С радостью приглашаем Вас<br/>на празднование нашей свадьбы
    </p>

    <div class="hero__date">
      <div class="hero__date-weekday">{wedding.date.weekday}</div>
      <div class="hero__date-day">{wedding.date.day}</div>
      <div class="hero__date-month">{wedding.date.month}</div>
      <div class="hero__date-year">{wedding.date.year}</div>
    </div>

    <p class="hero__venue">
      <strong>{wedding.venue.name}</strong><br/>
      {wedding.venue.addressShort}
    </p>

    <p class="hero__hint">Подтвердите присутствие ниже&nbsp;↓</p>
  </div>
</section>

<style>
  .hero {
    position: relative;
    text-align: center;
  }
  .hero__corner {
    position: absolute;
    width: 120px;
    height: 120px;
    pointer-events: none;
  }
  .hero__corner--tl { top: 0; left: 0; }
  .hero__corner--br { bottom: 0; right: 0; transform: rotate(180deg); }

  .hero__photo {
    margin: 0 auto 32px;
    width: 100%;
    aspect-ratio: 1 / 1;
    max-width: 400px;
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);
  }
  .hero__photo img { width: 100%; height: 100%; object-fit: cover; }

  .hero__couple {
    font-family: var(--font-script);
    font-size: 48px;
    font-weight: 400;
    color: var(--ink-primary);
    margin: 0 0 16px;
    line-height: 1.1;
  }
  @media (min-width: 768px) {
    .hero__couple { font-size: 64px; }
  }

  .hero__lead {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 18px;
    color: var(--ink-secondary);
    margin: 0 auto 32px;
    max-width: 360px;
  }

  .hero__date {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas:
      'wd day mo'
      'wd day year';
    gap: 0 16px;
    align-items: center;
    justify-content: center;
    width: max-content;
    margin: 0 auto 24px;
    padding: 16px 24px;
    border-top: 1px solid var(--accent-gold);
    border-bottom: 1px solid var(--accent-gold);
    color: var(--ink-primary);
  }
  .hero__date-weekday {
    grid-area: wd;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14px;
    text-transform: lowercase;
    color: var(--ink-secondary);
  }
  .hero__date-day {
    grid-area: day;
    font-family: var(--font-serif);
    font-size: 56px;
    line-height: 1;
    font-weight: 500;
    color: var(--accent-gold-deep);
  }
  .hero__date-month {
    grid-area: mo;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14px;
    color: var(--ink-secondary);
  }
  .hero__date-year {
    grid-area: year;
    font-family: var(--font-serif);
    font-size: 14px;
    color: var(--ink-secondary);
  }

  .hero__venue {
    font-family: var(--font-serif);
    font-size: 16px;
    color: var(--ink-secondary);
    margin: 0 0 32px;
    line-height: 1.5;
  }
  .hero__venue strong {
    color: var(--ink-primary);
    font-weight: 500;
  }

  .hero__hint {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14px;
    color: var(--ink-muted);
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): add Hero section"
```

---

## Task 8: Letter component (with calendar)

**Files:**
- Create: `src/components/Letter.astro`

- [ ] **Step 1: Build the calendar grid pure function**

Create `src/scripts/calendar.ts`:

```ts
export interface CalendarCell {
  day: number | null
}

export function buildMonthGrid(year: number, monthZeroBased: number): CalendarCell[] {
  const first = new Date(year, monthZeroBased, 1)
  const daysInMonth = new Date(year, monthZeroBased + 1, 0).getDate()
  const startWeekday = (first.getDay() + 6) % 7 // shift Mon=0 ... Sun=6

  const cells: CalendarCell[] = []
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d })
  while (cells.length % 7 !== 0) cells.push({ day: null })
  return cells
}
```

- [ ] **Step 2: Add tests for calendar**

Create `tests/calendar.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildMonthGrid } from '../src/scripts/calendar'

describe('buildMonthGrid', () => {
  it('builds a 5-row grid for July 2026 (35 cells)', () => {
    const cells = buildMonthGrid(2026, 6) // July is month index 6
    expect(cells.length).toBe(35)
  })

  it('starts July 2026 on Wednesday (Mon-first index 2)', () => {
    const cells = buildMonthGrid(2026, 6)
    expect(cells[0].day).toBeNull()
    expect(cells[1].day).toBeNull()
    expect(cells[2].day).toBe(1)
  })

  it('places day 4 at index 5 (Saturday)', () => {
    const cells = buildMonthGrid(2026, 6)
    expect(cells[5].day).toBe(4)
  })

  it('contains all 31 days of July', () => {
    const cells = buildMonthGrid(2026, 6)
    const days = cells.filter((c) => c.day !== null).map((c) => c.day)
    expect(days).toEqual(Array.from({ length: 31 }, (_, i) => i + 1))
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: 4 passed (plus the sanity test).

- [ ] **Step 4: Create `src/components/Letter.astro`**

```astro
---
import { wedding } from '../data/wedding'
import { buildMonthGrid } from '../scripts/calendar'

const cells = buildMonthGrid(2026, 6) // July 2026
const targetDay = parseInt(wedding.date.day, 10)
const weekdaysShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
---

<section class="letter section" id="letter">
  <div class="container">
    <h2 class="letter__hello">Дорогие родные<br/>и друзья!</h2>

    <p class="letter__body">
      Вы получили это приглашение —<br/>
      а значит мы спешим сообщить вам<br/>
      важную новость:
    </p>

    <p class="letter__highlight">Мы женимся!</p>

    <p class="letter__body">
      Приглашаем вас разделить с нами<br/>
      радость особенного дня и стать<br/>
      частью нашей семейной истории.
    </p>

    <p class="letter__waiting">Ждём Вас:</p>
    <p class="letter__date">{wedding.date.pretty}</p>

    <div class="calendar">
      <div class="calendar__header">{wedding.date.month} {wedding.date.year}</div>
      <div class="calendar__weekdays">
        {weekdaysShort.map((w) => <div class="calendar__weekday">{w}</div>)}
      </div>
      <div class="calendar__grid">
        {cells.map((c) => (
          <div class:list={[
              'calendar__cell',
              c.day === null && 'calendar__cell--empty',
              c.day === targetDay && 'calendar__cell--target',
          ]}>
            {c.day ?? ''}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

<style>
  .letter { text-align: center; }
  .letter__hello {
    font-family: var(--font-script);
    font-weight: 400;
    font-size: 40px;
    color: var(--ink-primary);
    margin: 0 0 24px;
    line-height: 1.1;
  }
  .letter__body {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 17px;
    color: var(--ink-secondary);
    margin: 0 0 24px;
    line-height: 1.6;
  }
  .letter__highlight {
    font-family: var(--font-script);
    font-size: 48px;
    color: var(--accent-rose-deep);
    margin: 0 0 32px;
    line-height: 1;
  }
  .letter__waiting {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 16px;
    color: var(--ink-muted);
    margin: 24px 0 8px;
  }
  .letter__date {
    font-family: var(--font-serif);
    font-size: 24px;
    color: var(--accent-gold-deep);
    margin: 0 0 24px;
  }
  .calendar {
    background: var(--bg-paper);
    border: 1px solid var(--line-soft);
    border-radius: var(--radius-card);
    padding: 16px;
    box-shadow: var(--shadow-soft);
    max-width: 320px;
    margin: 0 auto;
  }
  .calendar__header {
    font-family: var(--font-serif);
    font-size: 18px;
    color: var(--accent-gold-deep);
    margin-bottom: 12px;
  }
  .calendar__weekdays,
  .calendar__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .calendar__weekday {
    font-size: 11px;
    color: var(--ink-muted);
    padding: 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .calendar__cell {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--ink-primary);
    border-radius: 50%;
  }
  .calendar__cell--empty { color: transparent; }
  .calendar__cell--target {
    background: var(--accent-rose);
    color: #fff;
    font-weight: 600;
    box-shadow: 0 0 0 2px var(--accent-gold) inset;
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/scripts/calendar.ts tests/calendar.test.ts src/components/Letter.astro
git commit -m "feat(letter): add Letter section with July 2026 calendar"
```

---

## Task 9: Map component

**Files:**
- Create: `src/components/Map.astro`

- [ ] **Step 1: Create `src/components/Map.astro`**

```astro
---
import { wedding } from '../data/wedding'
---

<section class="map section" id="map">
  <div class="container">
    <h2 class="section-title">Как добраться?</h2>
    <div class="divider"><span>❀</span></div>

    <div class="map__embed">
      <iframe
        src={wedding.venue.yandexMapEmbed}
        title={`Карта проезда: ${wedding.venue.name}`}
        loading="lazy"
        referrerpolicy="no-referrer"
        allowfullscreen
      ></iframe>
    </div>

    <p class="map__text">
      Праздничный фуршет состоится в&nbsp;<strong>{wedding.venue.name}</strong>.<br/>
      {wedding.venue.addressShort}
    </p>

    <a class="map__cta" href={wedding.venue.yandexMapsUrl} target="_blank" rel="noopener">
      Построить маршрут в Яндекс.Картах →
    </a>
  </div>
</section>

<style>
  .map { text-align: center; }
  .map__embed {
    aspect-ratio: 16 / 10;
    margin: 24px 0 24px;
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    background: var(--bg-soft);
  }
  .map__embed iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
  .map__text {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 16px;
    color: var(--ink-secondary);
    margin: 0 0 24px;
  }
  .map__text strong { color: var(--ink-primary); font-weight: 500; }
  .map__cta {
    display: inline-block;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 15px;
    color: var(--accent-gold-deep);
    border: 1px solid var(--accent-gold);
    border-radius: var(--radius-pill);
    padding: 10px 22px;
    transition: background 150ms ease-out;
  }
  .map__cta:hover { background: rgba(184, 153, 104, 0.1); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Map.astro
git commit -m "feat(map): add Map section with Yandex iframe"
```

---

## Task 10: Program component

**Files:**
- Create: `src/components/Program.astro`

- [ ] **Step 1: Create `src/components/Program.astro`**

```astro
---
import { wedding } from '../data/wedding'
---

<section class="program section" id="program">
  <div class="container">
    <h2 class="section-title">Программа дня</h2>
    <div class="divider"><span>❀</span></div>

    <ol class="timeline">
      {wedding.program.map((item) => (
        <li class="timeline__item">
          <div class="timeline__marker">
            <div class="timeline__dot" aria-hidden="true"></div>
          </div>
          <div class="timeline__body">
            <div class="timeline__time">{item.time}</div>
            <div class="timeline__title">{item.title}</div>
            <div class="timeline__place">{item.place}</div>
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
  .program { text-align: left; }
  .program .section-title { text-align: center; }
  .program .divider { margin-bottom: 32px; }

  .timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 19px;
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: var(--accent-gold);
    opacity: 0.5;
  }
  .timeline__item {
    display: flex;
    gap: 20px;
    padding: 16px 0;
    position: relative;
  }
  .timeline__marker {
    flex: 0 0 40px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 4px;
  }
  .timeline__dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent-rose);
    box-shadow: 0 0 0 4px var(--bg-base), 0 0 0 5px var(--accent-gold);
    z-index: 1;
  }
  .timeline__time {
    font-family: var(--font-serif);
    font-size: 22px;
    color: var(--accent-gold-deep);
    margin-bottom: 4px;
  }
  .timeline__title {
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 15px;
    color: var(--ink-primary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }
  .timeline__place {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14px;
    color: var(--ink-secondary);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Program.astro
git commit -m "feat(program): add Program timeline section"
```

---

## Task 11: DressCode component

**Files:**
- Create: `src/components/DressCode.astro`

- [ ] **Step 1: Create `src/components/DressCode.astro`**

```astro
---
import { wedding } from '../data/wedding'
---

<section class="dresscode section" id="dresscode">
  <div class="container">
    <h2 class="section-title">Дресс-код</h2>
    <div class="divider"><span>❀</span></div>

    <p class="dresscode__intro">{wedding.dressCode.intro}</p>

    <ul class="palette">
      {wedding.dressCode.palette.map((c) => (
        <li class="palette__item">
          <div class="palette__swatch" style={`background:${c.hex}`}></div>
          <div class="palette__name">{c.name}</div>
          <div class="palette__pantone">PANTONE {c.pantone}</div>
        </li>
      ))}
    </ul>

    <p class="dresscode__note">{wedding.dressCode.note}</p>
  </div>
</section>

<style>
  .dresscode { text-align: center; }
  .dresscode__intro {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 16px;
    color: var(--ink-secondary);
    margin: 0 auto 32px;
    max-width: 360px;
    line-height: 1.6;
  }
  .palette {
    list-style: none;
    padding: 0;
    margin: 0 0 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px 12px;
  }
  .palette__item {
    flex: 0 0 calc(33% - 12px);
    max-width: 100px;
  }
  .palette__swatch {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 auto 8px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(58, 53, 48, 0.05);
    transition: transform 200ms ease-out;
  }
  .palette__item:hover .palette__swatch {
    transform: scale(1.08);
  }
  .palette__name {
    font-family: var(--font-serif);
    font-size: 13px;
    color: var(--ink-primary);
    margin-bottom: 2px;
  }
  .palette__pantone {
    font-family: var(--font-sans);
    font-size: 10px;
    color: var(--ink-muted);
    letter-spacing: 0.05em;
  }
  .dresscode__note {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14px;
    color: var(--ink-muted);
    margin: 0;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DressCode.astro
git commit -m "feat(dresscode): add DressCode palette section"
```

---

## Task 12: Countdown logic + component

**Files:**
- Create: `src/scripts/countdown.ts`, `tests/countdown.test.ts`, `src/components/Countdown.astro`

- [ ] **Step 1: Write countdown helper**

`src/scripts/countdown.ts`:

```ts
export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

export function calcRemaining(targetIso: string, now: Date = new Date()): Remaining {
  const target = new Date(targetIso).getTime()
  const diff = target - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds, isPast: false }
}

export function pluralizeRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}
```

- [ ] **Step 2: Write tests**

`tests/countdown.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { calcRemaining, pluralizeRu } from '../src/scripts/countdown'

describe('calcRemaining', () => {
  it('reports 1 day remaining when target is 24h ahead', () => {
    const now = new Date('2026-07-03T15:30:00+03:00')
    const r = calcRemaining('2026-07-04T15:30:00+03:00', now)
    expect(r.days).toBe(1)
    expect(r.hours).toBe(0)
    expect(r.isPast).toBe(false)
  })

  it('returns isPast=true when target has passed', () => {
    const now = new Date('2026-07-05T00:00:00+03:00')
    const r = calcRemaining('2026-07-04T15:30:00+03:00', now)
    expect(r.isPast).toBe(true)
  })

  it('reports zero seconds at exact target', () => {
    const target = '2026-07-04T15:30:00+03:00'
    const r = calcRemaining(target, new Date(target))
    expect(r.isPast).toBe(true)
  })
})

describe('pluralizeRu', () => {
  it('selects singular for 1', () => {
    expect(pluralizeRu(1, ['день', 'дня', 'дней'])).toBe('день')
  })
  it('selects plural for 2-4', () => {
    expect(pluralizeRu(3, ['день', 'дня', 'дней'])).toBe('дня')
  })
  it('selects general for 5+', () => {
    expect(pluralizeRu(11, ['день', 'дня', 'дней'])).toBe('дней')
    expect(pluralizeRu(25, ['день', 'дня', 'дней'])).toBe('дней')
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Create `src/components/Countdown.astro`**

```astro
---
import { wedding } from '../data/wedding'
---

<section class="countdown section" id="countdown">
  <div class="container">
    <p class="countdown__quote">«{wedding.quote}»</p>
    <p class="countdown__date">{wedding.date.pretty}</p>

    <p class="countdown__lead" id="countdown-lead">До свадьбы осталось:</p>

    <div class="countdown__grid" id="countdown-grid">
      <div class="countdown__cell"><span class="countdown__num" data-unit="days">—</span><span class="countdown__label" data-unit-label="days">дней</span></div>
      <div class="countdown__cell"><span class="countdown__num" data-unit="hours">—</span><span class="countdown__label" data-unit-label="hours">часов</span></div>
      <div class="countdown__cell"><span class="countdown__num" data-unit="minutes">—</span><span class="countdown__label" data-unit-label="minutes">минут</span></div>
      <div class="countdown__cell"><span class="countdown__num" data-unit="seconds">—</span><span class="countdown__label" data-unit-label="seconds">секунд</span></div>
    </div>

    <p class="countdown__celebrate" id="countdown-celebrate" hidden>Сегодня! 🌿</p>
  </div>
</section>

<style>
  .countdown { text-align: center; }
  .countdown__quote {
    font-family: var(--font-script);
    font-size: 36px;
    color: var(--accent-rose-deep);
    margin: 0 0 8px;
    line-height: 1;
  }
  .countdown__date {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 20px;
    color: var(--ink-secondary);
    margin: 0 0 32px;
  }
  .countdown__lead {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 16px;
    color: var(--ink-muted);
    margin: 0 0 16px;
  }
  .countdown__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    max-width: 400px;
    margin: 0 auto;
  }
  .countdown__cell {
    background: var(--bg-paper);
    border: 1px solid var(--line-soft);
    border-radius: var(--radius-card);
    padding: 16px 4px;
    box-shadow: var(--shadow-soft);
  }
  .countdown__num {
    display: block;
    font-family: var(--font-serif);
    font-size: 32px;
    font-weight: 500;
    color: var(--accent-gold-deep);
    line-height: 1;
    transition: opacity 200ms;
  }
  .countdown__label {
    display: block;
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--ink-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 6px;
  }
  .countdown__celebrate {
    font-family: var(--font-script);
    font-size: 56px;
    color: var(--accent-rose-deep);
    margin: 24px 0 0;
  }
</style>

<script>
  import { wedding } from '../data/wedding'
  import { calcRemaining, pluralizeRu } from '../scripts/countdown'

  const grid = document.getElementById('countdown-grid')!
  const lead = document.getElementById('countdown-lead')!
  const celebrate = document.getElementById('countdown-celebrate')!

  const labels = {
    days: ['день', 'дня', 'дней'] as [string, string, string],
    hours: ['час', 'часа', 'часов'] as [string, string, string],
    minutes: ['минута', 'минуты', 'минут'] as [string, string, string],
    seconds: ['секунда', 'секунды', 'секунд'] as [string, string, string],
  }

  function tick() {
    const r = calcRemaining(wedding.date.iso)
    if (r.isPast) {
      grid.hidden = true
      lead.hidden = true
      celebrate.hidden = false
      return
    }
    setNum('days', r.days)
    setNum('hours', r.hours)
    setNum('minutes', r.minutes)
    setNum('seconds', r.seconds)
    setLabel('days', pluralizeRu(r.days, labels.days))
    setLabel('hours', pluralizeRu(r.hours, labels.hours))
    setLabel('minutes', pluralizeRu(r.minutes, labels.minutes))
    setLabel('seconds', pluralizeRu(r.seconds, labels.seconds))
  }

  function setNum(unit: string, value: number) {
    const el = document.querySelector(`[data-unit="${unit}"]`)
    if (el) el.textContent = String(value)
  }
  function setLabel(unit: string, value: string) {
    const el = document.querySelector(`[data-unit-label="${unit}"]`)
    if (el) el.textContent = value
  }

  tick()
  setInterval(tick, 1000)
</script>
```

- [ ] **Step 5: Commit**

```bash
git add src/scripts/countdown.ts tests/countdown.test.ts src/components/Countdown.astro
git commit -m "feat(countdown): add countdown timer with Russian pluralization"
```

---

## Task 13: RSVP logic

**Files:**
- Create: `src/scripts/rsvp.ts`, `tests/rsvp.test.ts`

- [ ] **Step 1: Write pure RSVP helpers**

`src/scripts/rsvp.ts`:

```ts
export interface CaptchaChallenge {
  a: number
  b: number
  question: string
  answer: number
}

export function makeCaptcha(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 8) + 1
  const b = Math.floor(Math.random() * 8) + 1
  return { a, b, question: `Сколько будет ${a} + ${b}?`, answer: a + b }
}

export function isFormReady(name: string, attendance: string | null): boolean {
  return name.trim().length > 0 && (attendance === 'yes' || attendance === 'no')
}

export function isCaptchaCorrect(input: string, expected: number): boolean {
  const parsed = parseInt(input.trim(), 10)
  return !Number.isNaN(parsed) && parsed === expected
}
```

- [ ] **Step 2: Write tests**

`tests/rsvp.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { makeCaptcha, isFormReady, isCaptchaCorrect } from '../src/scripts/rsvp'

describe('makeCaptcha', () => {
  it('produces a valid arithmetic challenge', () => {
    const c = makeCaptcha()
    expect(c.a + c.b).toBe(c.answer)
    expect(c.question).toContain(`${c.a} + ${c.b}`)
  })
})

describe('isFormReady', () => {
  it('false when name empty', () => {
    expect(isFormReady('', 'yes')).toBe(false)
    expect(isFormReady('   ', 'yes')).toBe(false)
  })
  it('false when no attendance selected', () => {
    expect(isFormReady('Иван', null)).toBe(false)
  })
  it('true when both filled', () => {
    expect(isFormReady('Иван', 'yes')).toBe(true)
    expect(isFormReady('Анна', 'no')).toBe(true)
  })
})

describe('isCaptchaCorrect', () => {
  it('accepts correct answer', () => {
    expect(isCaptchaCorrect('5', 5)).toBe(true)
    expect(isCaptchaCorrect(' 5 ', 5)).toBe(true)
  })
  it('rejects wrong answer', () => {
    expect(isCaptchaCorrect('4', 5)).toBe(false)
  })
  it('rejects non-numeric input', () => {
    expect(isCaptchaCorrect('abc', 5)).toBe(false)
    expect(isCaptchaCorrect('', 5)).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/rsvp.ts tests/rsvp.test.ts
git commit -m "feat(rsvp): add pure RSVP helpers with tests"
```

---

## Task 14: RSVP component

**Files:**
- Create: `src/components/Rsvp.astro`

- [ ] **Step 1: Create `src/components/Rsvp.astro`**

```astro
---
import { wedding } from '../data/wedding'
---

<section class="rsvp section" id="rsvp">
  <div class="container">
    <h2 class="section-title">Подтвердите присутствие</h2>
    <div class="divider"><span>❀</span></div>

    <p class="rsvp__lead">
      Пожалуйста, дайте знать, сможете ли вы быть с нами в этот особенный день
    </p>

    <div class="rsvp__banner" id="rsvp-banner" hidden></div>

    <form class="rsvp-form" id="rsvp-form" novalidate>
      <label class="rsvp-form__label" for="rsvp-name">Ваше имя и фамилия</label>
      <input
        type="text"
        id="rsvp-name"
        name="name"
        autocomplete="name"
        class="rsvp-form__input"
        required
      />

      <fieldset class="rsvp-form__radios">
        <legend>Присутствие</legend>
        <label class="rsvp-form__radio">
          <input type="radio" name="attendance" value="yes" />
          <span>{wedding.rsvp.attendanceValues.yes}</span>
        </label>
        <label class="rsvp-form__radio">
          <input type="radio" name="attendance" value="no" />
          <span>{wedding.rsvp.attendanceValues.no}</span>
        </label>
      </fieldset>

      <label class="rsvp-form__label" for="rsvp-captcha" id="rsvp-captcha-label">
        Загрузка...
      </label>
      <input
        type="text"
        id="rsvp-captcha"
        inputmode="numeric"
        autocomplete="off"
        class="rsvp-form__input rsvp-form__input--captcha"
      />

      <input
        type="text"
        name="phone_alt"
        id="rsvp-honeypot"
        tabindex="-1"
        autocomplete="off"
        class="rsvp-form__honeypot"
        aria-hidden="true"
      />

      <button type="submit" class="primary rsvp-form__submit" id="rsvp-submit" disabled>
        Отправить
      </button>
    </form>
  </div>
</section>

<style>
  .rsvp { text-align: center; }
  .rsvp__lead {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 16px;
    color: var(--ink-secondary);
    margin: 0 auto 32px;
    max-width: 360px;
  }
  .rsvp__banner {
    background: var(--bg-paper);
    border: 1px solid var(--accent-gold);
    border-radius: var(--radius-card);
    padding: 14px 18px;
    margin: 0 0 20px;
    color: var(--ink-primary);
    font-family: var(--font-serif);
    font-size: 16px;
    transition: opacity 400ms;
  }
  .rsvp__banner[data-kind='error'] {
    border-color: #C97A7A;
    color: #8A4848;
  }

  .rsvp-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: left;
  }
  .rsvp-form__label {
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: -8px;
  }
  .rsvp-form__input {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--accent-gold);
    padding: 8px 0;
    font-family: var(--font-serif);
    font-size: 18px;
    color: var(--ink-primary);
    transition: border-color 150ms;
    width: 100%;
  }
  .rsvp-form__input:focus {
    outline: none;
    border-bottom-color: var(--accent-rose-deep);
  }
  .rsvp-form__radios {
    border: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rsvp-form__radios legend {
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
  .rsvp-form__radio {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-serif);
    font-size: 16px;
    cursor: pointer;
  }
  .rsvp-form__radio input[type='radio'] {
    accent-color: var(--accent-rose-deep);
    width: 18px;
    height: 18px;
  }
  .rsvp-form__honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  }
  .rsvp-form__submit {
    margin-top: 12px;
    align-self: stretch;
  }
</style>

<script>
  import { wedding } from '../data/wedding'
  import { makeCaptcha, isFormReady, isCaptchaCorrect } from '../scripts/rsvp'

  const form = document.getElementById('rsvp-form') as HTMLFormElement
  const submit = document.getElementById('rsvp-submit') as HTMLButtonElement
  const nameInput = document.getElementById('rsvp-name') as HTMLInputElement
  const captchaInput = document.getElementById('rsvp-captcha') as HTMLInputElement
  const captchaLabel = document.getElementById('rsvp-captcha-label')!
  const honeypot = document.getElementById('rsvp-honeypot') as HTMLInputElement
  const banner = document.getElementById('rsvp-banner')!
  const radios = form.querySelectorAll<HTMLInputElement>('input[name="attendance"]')

  let challenge = makeCaptcha()
  captchaLabel.textContent = challenge.question

  const validate = () => {
    const checked = [...radios].find((r) => r.checked)
    submit.disabled = !isFormReady(nameInput.value, checked?.value ?? null)
  }

  nameInput.addEventListener('input', validate)
  radios.forEach((r) => r.addEventListener('change', validate))

  function showBanner(text: string, kind: 'success' | 'error' = 'success') {
    banner.textContent = text
    banner.dataset.kind = kind
    banner.hidden = false
    if (kind === 'success') {
      window.setTimeout(() => {
        banner.hidden = true
      }, 5000)
    }
  }

  function refreshCaptcha() {
    challenge = makeCaptcha()
    captchaLabel.textContent = challenge.question
    captchaInput.value = ''
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (honeypot.value.trim() !== '') {
      // bot — fake success, do nothing
      showBanner(wedding.rsvp.successMessage)
      form.reset()
      refreshCaptcha()
      validate()
      return
    }
    if (!isCaptchaCorrect(captchaInput.value, challenge.answer)) {
      showBanner('Неверный ответ на капчу. Попробуйте ещё раз.', 'error')
      refreshCaptcha()
      return
    }
    const attendance = [...radios].find((r) => r.checked)?.value
    if (!attendance) return

    submit.disabled = true
    try {
      const body = new URLSearchParams()
      body.append(wedding.rsvp.fields.name, nameInput.value.trim())
      body.append(
        wedding.rsvp.fields.attendance,
        attendance === 'yes'
          ? wedding.rsvp.attendanceValues.yes
          : wedding.rsvp.attendanceValues.no
      )

      await fetch(wedding.rsvp.formActionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body,
      })

      const msg =
        attendance === 'yes' ? wedding.rsvp.successMessage : wedding.rsvp.declineMessage
      showBanner(msg)
      form.reset()
      refreshCaptcha()
      validate()
    } catch {
      showBanner(wedding.rsvp.errorMessage, 'error')
      validate()
    }
  })

  validate()
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Rsvp.astro
git commit -m "feat(rsvp): add RSVP form component with captcha and Google Forms submit"
```

---

## Task 15: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import { wedding } from '../data/wedding'
const base = import.meta.env.BASE_URL
---

<footer class="footer section">
  <div class="container">
    <img class="footer__corner footer__corner--tl" src={`${base}decor/branch-corner.svg`} alt="" />
    <img class="footer__corner footer__corner--br" src={`${base}decor/branch-corner.svg`} alt="" />

    <p class="footer__lead">Будем рады видеть вас<br/>на нашем празднике!</p>
    <p class="footer__couple-name">{wedding.couple.bride}</p>
    <p class="footer__amp">и</p>
    <p class="footer__couple-name">{wedding.couple.groom}</p>
    <p class="footer__cursive">See you soon</p>
  </div>
</footer>

<style>
  .footer {
    text-align: center;
    position: relative;
    background: var(--bg-soft);
    margin-top: 0;
  }
  .footer__corner {
    position: absolute;
    width: 100px;
    height: 100px;
    pointer-events: none;
    opacity: 0.7;
  }
  .footer__corner--tl { top: 12px; left: 12px; }
  .footer__corner--br { bottom: 12px; right: 12px; transform: rotate(180deg); }
  .footer__lead {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 18px;
    color: var(--ink-secondary);
    margin: 0 0 32px;
  }
  .footer__couple-name {
    font-family: var(--font-script);
    font-size: 40px;
    color: var(--ink-primary);
    margin: 0;
    line-height: 1;
  }
  .footer__amp {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 20px;
    color: var(--ink-muted);
    margin: 8px 0;
  }
  .footer__cursive {
    font-family: var(--font-script);
    font-size: 36px;
    color: var(--accent-gold-deep);
    margin: 32px 0 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): add Footer section"
```

---

## Task 16: Music UI (popup + floating toggle)

**Files:**
- Create: `src/components/MusicUI.astro`

- [ ] **Step 1: Create `src/components/MusicUI.astro`**

```astro
---
import { wedding } from '../data/wedding'
const base = import.meta.env.BASE_URL
const audioSrc = wedding.music.src
  ? wedding.music.src.startsWith('/')
    ? `${base}${wedding.music.src.slice(1)}`
    : wedding.music.src
  : ''
---

<div class="music">
  <audio id="music-audio" loop preload="none" src={audioSrc}></audio>

  <div class="music-prompt" id="music-prompt" hidden>
    <span class="music-prompt__icon">♪</span>
    <span class="music-prompt__text">Включить фоновую музыку?</span>
    <div class="music-prompt__actions">
      <button class="music-prompt__yes" id="music-yes">Да ✨</button>
      <button class="music-prompt__no" id="music-no">Не сейчас</button>
    </div>
  </div>

  <button class="music-toggle" id="music-toggle" aria-label="Включить/выключить музыку" hidden>
    <span id="music-toggle-icon">♪</span>
  </button>

  <div class="music-toast" id="music-toast" hidden></div>
</div>

<style>
  .music-prompt,
  .music-toggle,
  .music-toast {
    position: fixed;
    z-index: 100;
  }
  .music-prompt {
    right: 16px;
    bottom: 16px;
    background: var(--bg-paper);
    border: 1px solid var(--line-soft);
    border-radius: var(--radius-card);
    padding: 14px 16px;
    box-shadow: var(--shadow-card);
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    text-align: center;
  }
  .music-prompt__icon { font-size: 20px; color: var(--accent-gold-deep); }
  .music-prompt__text {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 14px;
    color: var(--ink-secondary);
  }
  .music-prompt__actions { display: flex; gap: 8px; }
  .music-prompt__yes,
  .music-prompt__no {
    font-family: var(--font-sans);
    font-size: 13px;
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    border: 1px solid var(--accent-gold);
    background: transparent;
    color: var(--accent-gold-deep);
  }
  .music-prompt__yes {
    background: var(--accent-rose);
    color: #fff;
    border-color: var(--accent-rose);
  }

  .music-toggle {
    right: 16px;
    bottom: 16px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg-paper);
    border: 1px solid var(--line-soft);
    box-shadow: var(--shadow-soft);
    color: var(--accent-gold-deep);
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .music-toggle[data-on='true'] {
    background: var(--accent-rose);
    color: #fff;
    border-color: var(--accent-rose);
  }

  .music-toast {
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background: var(--ink-primary);
    color: #fff;
    padding: 10px 16px;
    border-radius: var(--radius-pill);
    font-size: 13px;
    font-family: var(--font-sans);
  }
</style>

<script>
  import { wedding } from '../data/wedding'

  const audio = document.getElementById('music-audio') as HTMLAudioElement
  const prompt = document.getElementById('music-prompt')!
  const yes = document.getElementById('music-yes')!
  const no = document.getElementById('music-no')!
  const toggle = document.getElementById('music-toggle') as HTMLButtonElement
  const toggleIcon = document.getElementById('music-toggle-icon')!
  const toast = document.getElementById('music-toast')!
  const headerBtn = document.getElementById('music-toggle-header')

  const STORAGE_KEY = 'music_pref'
  type Pref = 'on' | 'off' | 'asked-no'

  audio.volume = 0.4

  function setToggleState(on: boolean) {
    toggle.dataset.on = String(on)
    toggleIcon.textContent = on ? '♪' : '♪'
    toggle.hidden = false
  }

  function showToast(text: string) {
    toast.textContent = text
    toast.hidden = false
    window.setTimeout(() => (toast.hidden = true), 2500)
  }

  async function tryPlay() {
    if (!audio.src || audio.src === window.location.href) {
      showToast(wedding.music.placeholderToast)
      return false
    }
    try {
      await audio.play()
      return true
    } catch {
      showToast('Браузер заблокировал автозапуск. Нажмите ♪')
      return false
    }
  }

  function pause() {
    audio.pause()
  }

  yes.addEventListener('click', async () => {
    prompt.hidden = true
    const ok = await tryPlay()
    setToggleState(ok)
    localStorage.setItem(STORAGE_KEY, ok ? ('on' as Pref) : ('off' as Pref))
  })

  no.addEventListener('click', () => {
    prompt.hidden = true
    setToggleState(false)
    localStorage.setItem(STORAGE_KEY, 'asked-no' as Pref)
  })

  toggle.addEventListener('click', async () => {
    if (audio.paused) {
      const ok = await tryPlay()
      if (ok) setToggleState(true)
    } else {
      pause()
      setToggleState(false)
    }
  })

  headerBtn?.addEventListener('click', () => toggle.click())

  const pref = localStorage.getItem(STORAGE_KEY) as Pref | null
  if (pref === 'on') {
    setToggleState(false)
    // require user gesture for autoplay; show toggle only
  } else if (pref === 'asked-no' || pref === 'off') {
    setToggleState(false)
  } else {
    window.setTimeout(() => {
      prompt.hidden = false
    }, wedding.music.autoPromptDelayMs)
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MusicUI.astro
git commit -m "feat(music): add music popup, floating toggle, and placeholder toast"
```

---

## Task 17: Index page (assemble all sections)

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import Header from '../components/Header.astro'
import Hero from '../components/Hero.astro'
import Letter from '../components/Letter.astro'
import Map from '../components/Map.astro'
import Program from '../components/Program.astro'
import DressCode from '../components/DressCode.astro'
import Countdown from '../components/Countdown.astro'
import Rsvp from '../components/Rsvp.astro'
import Footer from '../components/Footer.astro'
import MusicUI from '../components/MusicUI.astro'
---

<Base>
  <Header />
  <main>
    <Hero />
    <Letter />
    <Map />
    <Program />
    <DressCode />
    <Countdown />
    <Rsvp />
  </main>
  <Footer />
  <MusicUI />
</Base>
```

- [ ] **Step 2: Run dev server, manually verify**

```bash
npm run dev
```

Open `http://localhost:4321/invite/`. Walk through:
- Header is sticky.
- Hero shows placeholder, names, date block, venue, hint.
- Letter has «Дорогие родные и друзья!», calendar with 4-th highlighted.
- Map shows Yandex iframe + CTA button.
- Program timeline shows 11:30 / 15:30 / 16:30.
- DressCode shows 5 swatches.
- Countdown ticks every second; fewer than 65 days remaining as of 2026-05-01.
- RSVP button is disabled until name + radio selected.
- After 4 seconds — music popup appears.
- Click «Да ✨» — toast «Музыка появится позже» appears (placeholder src).
- Burger menu opens, anchor links scroll smoothly.

- [ ] **Step 3: Run full build to check for errors**

```bash
npm run build
```

Expected: build succeeds, `dist/` contains `index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(page): assemble index page with all sections"
```

---

## Task 18: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow"
```

---

## Task 19: Create GitHub repo and push

**Files:** none (git/gh operations)

- [ ] **Step 1: Create the public repository via gh CLI**

```bash
gh repo create invite --public --description "Wedding invitation Екатерина & Никита, 04.07.2026" --source=. --remote=origin
```

Expected: repo `ImpossibleS5/invite` created and `origin` set.

- [ ] **Step 2: Push initial main branch**

```bash
git push -u origin main
```

Expected: pushes all commits to remote.

- [ ] **Step 3: Enable GitHub Pages with Actions source**

```bash
gh api -X POST "repos/ImpossibleS5/invite/pages" \
  --input - <<<'{"build_type":"workflow"}'
```

Note: if Pages is already configured, the API will respond with an error — that's fine, proceed.

- [ ] **Step 4: Watch the deploy workflow**

```bash
gh run watch --exit-status
```

Expected: workflow completes with success.

- [ ] **Step 5: Open the live site**

```bash
echo "Site: https://impossibles5.github.io/invite/"
```

Manually verify the deployed page renders identically to local dev.

- [ ] **Step 6: Final commit and tag**

```bash
git tag -a v0.1.0 -m "First deploy with placeholder assets"
git push --tags
```

---

## Task 20: README — Google Form setup instructions

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Append Google Form setup instructions to `README.md`**

Append after existing content:

```markdown
## Setting up Google Forms for RSVP

The site sends RSVP submissions to a Google Form. To wire it up:

1. Go to https://forms.google.com and create a new form titled e.g. «Подтверждение присутствия».
2. Add two questions:
   - **Имя и фамилия** — short answer, required.
   - **Присутствие** — multiple choice with two options:
     - `Я с удовольствием приду`
     - `К сожалению, не смогу присутствовать`
3. Open the form's response settings and enable email notifications (Settings → ⋮ → Get email notifications for new responses).
4. Click **Send** → link tab → copy the form URL. The URL contains the form ID after `/d/e/`.
5. Get field entry IDs:
   - Click **⋮ → Get pre-filled link**.
   - Fill the fields with placeholder values (e.g. `NAME` and `Я с удовольствием приду`).
   - Click **Get link** → copy the URL.
   - The URL contains `entry.NNNNNNNN=NAME&entry.MMMMMMMM=...` — these `entry.NNNN` keys are the field IDs.
6. Open `src/data/wedding.ts` and update:
   ```ts
   rsvp: {
     formActionUrl: 'https://docs.google.com/forms/d/e/<FORM_ID>/formResponse',
     fields: {
       name: 'entry.<NUMBER>',
       attendance: 'entry.<NUMBER>',
     },
     // ...
   }
   ```
7. Commit and push — the deploy will rebuild and the form starts working.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add Google Form setup instructions"
git push
```

---

## Self-Review checklist

- [x] **Spec coverage:** Every spec section maps to a task — Hero (T7), Letter+calendar (T8), Map (T9), Program (T10), DressCode (T11), Countdown (T12), RSVP (T13–T14), Footer (T15), Music UI (T16), header/menu (T6), tokens (T3), Base layout (T4), assembly (T17), CI/deploy (T18–T19), Google Form setup (T20).
- [x] **Placeholder scan:** No TBD/TODO. `wedding.rsvp.formActionUrl` and field IDs are explicit `REPLACE_FORM_ID` / `entry.0000000000` placeholders, with Task 20 instructing how to fill them in. This is intentional — the user agreed.
- [x] **Type consistency:** `calcRemaining` returns `Remaining` interface used in `Countdown.astro` script. `pluralizeRu` signature matches usage. `makeCaptcha` returns `CaptchaChallenge` matching `isCaptchaCorrect` arguments.
- [x] **Audio placeholder:** `wedding.music.src = ''` causes `tryPlay` to show `placeholderToast` and skip playback. Replacing the file is a one-line change.
- [x] **Hero/program photo placeholders:** Hero uses `decor/hero-frame.svg`. Program timeline shows colored dots only (no per-item photos), so no per-item placeholder needed.

Plan complete. Ready for execution.
