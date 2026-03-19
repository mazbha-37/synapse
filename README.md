# Synapse — Personal Data Command Center

A real-time, AI-powered dashboard that aggregates live data from multiple APIs into a fully customizable drag-and-drop interface. Build your personal command center with widgets for weather, crypto, news, stocks, NASA, and more — all in one place.

**Live Demo → [synapse-ashy-psi.vercel.app](https://synapse-ashy-psi.vercel.app/)**

---

## Features

- **Drag & Drop Dashboard** — Freely arrange and resize widgets using a responsive 12-column grid
- **11 Live Data Widgets** — Weather, News, Crypto, GitHub, NASA APOD, Air Quality, Forex, Stocks, Earthquakes, Quote of the Day, Public Holidays
- **Synapse AI Assistant** — Streaming chat powered by Groq (compound-beta with built-in web search) and Google Gemini, with full awareness of your live dashboard data
- **Authentication** — Email/password and Google OAuth via NextAuth v5
- **Admin Panel** — User management, audit logs, API health monitoring, and analytics charts
- **Dark / Light Mode** — System-aware theme switching
- **Responsive** — Adaptive grid breakpoints for all screen sizes

---

## Tech Stack

### Framework & Language

| Technology | Details |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | App Router, API Routes, Server Components |
| [React 19](https://react.dev/) | Latest concurrent features |
| [TypeScript 5](https://www.typescriptlang.org/) | Strict mode throughout |

### Database & Auth

| Technology | Purpose |
|-----------|---------|
| [MongoDB Atlas](https://www.mongodb.com/) | Primary database |
| [Mongoose 9](https://mongoosejs.com/) | ODM & schema modeling |
| [NextAuth v5](https://authjs.dev/) | JWT sessions, Google OAuth, Credentials provider |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |

### AI & Communications

| Technology | Purpose |
|-----------|---------|
| [Groq SDK](https://console.groq.com/) | Streaming AI chat — `compound-beta` model with built-in web search |
| [Google Gemini](https://ai.google.dev/) | Alternative AI model — `gemini-1.5-flash` |
| [Resend](https://resend.com/) | Transactional email for password reset |

### UI & Styling

| Technology | Purpose |
|-----------|---------|
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible, composable component primitives |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Recharts](https://recharts.org/) | Data visualization & charts |
| [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) | Draggable & resizable dashboard grid |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark / light mode |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | CSS animation utilities |

### Forms & Validation

| Technology | Purpose |
|-----------|---------|
| [React Hook Form](https://react-hook-form.com/) | Performant form state management |
| [Zod v4](https://zod.dev/) | Runtime schema validation |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | RHF + Zod integration |

### External APIs

| API | Widget |
|-----|--------|
| [OpenWeatherMap](https://openweathermap.org/api) | Weather forecasts & conditions |
| [GNews](https://gnews.io/) | News headlines by category & country |
| [CoinGecko](https://www.coingecko.com/en/api) | Cryptocurrency prices & market data |
| [GitHub API](https://docs.github.com/en/rest) | Trending repos & user profiles |
| [NASA API](https://api.nasa.gov/) | Astronomy Picture of the Day |
| [AQICN](https://aqicn.org/api/) | Real-time air quality index |
| [ExchangeRate API](https://www.exchangerate-api.com/) | Live forex / currency rates |
| [Alpha Vantage](https://www.alphavantage.co/) | Stock market data |
| [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/) | Global seismic activity |

### Deployment & Tooling

| Technology | Purpose |
|-----------|---------|
| [Vercel](https://vercel.com/) | Hosting & CI/CD |
| [ESLint 9](https://eslint.org/) | Linting |
| [tsx](https://github.com/privatenumber/tsx) | TypeScript script runner (DB seeding) |
| [date-fns](https://date-fns.org/) | Date formatting & utilities |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (free tier works)

### Installation

```bash
git clone https://github.com/your-username/synapse.git
cd synapse
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/synapse

# NextAuth v5 (note: AUTH_SECRET and AUTH_URL, not NEXTAUTH_*)
AUTH_SECRET=        # generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
GEMINI_API_KEY=
GROQ_API_KEY=

# Widget APIs
OPENWEATHERMAP_API_KEY=
GNEWS_API_KEY=
NASA_API_KEY=
AQICN_API_KEY=
EXCHANGERATE_API_KEY=
ALPHA_VANTAGE_API_KEY=

# Email
RESEND_API_KEY=
```

### Run

```bash
# Development
npm run dev

# Seed the database with an admin user
npm run seed

# Production build
npm run build && npm start
```

After seeding, the default admin credentials are:
- **Email:** `admin@synapse.dev`
- **Password:** `Admin@123`

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, forgot/reset password
│   ├── (dashboard)/     # Main dashboard & settings
│   ├── (admin)/         # Admin panel
│   └── api/             # API routes (widgets, auth, AI, admin)
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── widgets/         # Individual widget components
│   ├── dashboard/       # Dashboard layout & controls
│   ├── ai/              # AI chat interface
│   ├── layout/          # Navbar, sidebar, shell
│   └── shared/          # Reusable shared components
├── lib/                 # Auth, DB, Groq, Gemini, utilities
├── models/              # Mongoose models
├── types/               # TypeScript type definitions
├── validators/          # Zod schemas
└── scripts/
    └── seed.ts          # Database seeding script
```

---

## Deployment (Vercel)

1. Push code to GitHub and import the project on [Vercel](https://vercel.com)
2. Add all environment variables in **Settings → Environment Variables**
   - Use `AUTH_SECRET` and `AUTH_URL` (NextAuth v5 — not the `NEXTAUTH_*` variants)
3. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` or Vercel's IP ranges
4. In Google Cloud Console, add your Vercel URL as an authorized redirect URI:
   `https://your-app.vercel.app/api/auth/callback/google`
5. Redeploy

---

## License

MIT
