&lt;div align="center"&gt;
  &lt;a href="https://synapse-ashy-psi.vercel.app"&gt;
    &lt;img src="public/logo.svg" alt="Synapse Logo" width="80" height="80"&gt;
  &lt;/a&gt;

  &lt;h1 align="center"&gt;Synapse&lt;/h1&gt;
  
  &lt;p align="center"&gt;
    &lt;strong&gt;Your Personal Data Command Center&lt;/strong&gt;&lt;br&gt;
    Real-time, AI-powered dashboard that aggregates live data into a customizable drag-and-drop interface.
  &lt;/p&gt;

  &lt;p align="center"&gt;
    &lt;a href="https://synapse-ashy-psi.vercel.app"&gt;&lt;strong&gt;🚀 Live Demo&lt;/strong&gt;&lt;/a&gt; •
    &lt;a href="#-screenshots"&gt;📸 Screenshots&lt;/a&gt; •
    &lt;a href="#-features"&gt;✨ Features&lt;/a&gt; •
    &lt;a href="#-tech-stack"&gt;🛠️ Tech Stack&lt;/a&gt; •
    &lt;a href="#-getting-started"&gt;⚡ Quick Start&lt;/a&gt;
  &lt;/p&gt;

  &lt;p align="center"&gt;
    &lt;img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16"&gt;
    &lt;img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19"&gt;
    &lt;img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript"&gt;
    &lt;img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind"&gt;
    &lt;img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License"&gt;
    &lt;img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel" alt="Vercel"&gt;
  &lt;/p&gt;
&lt;/div&gt;

---

## 📸 Screenshots

&lt;div align="center"&gt;
  &lt;img src="public/screenshots/landing-page.png" alt="Synapse Landing Page" width="100%"&gt;
  &lt;p&gt;&lt;em&gt;Beautiful landing page with dark theme&lt;/em&gt;&lt;/p&gt;
&lt;/div&gt;

&lt;div align="center" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;"&gt;
  &lt;img src="public/screenshots/dashboard-widgets.png" alt="Dashboard Widgets" width="48%"&gt;
  &lt;img src="public/screenshots/api-health-monitor.png" alt="API Health Monitor" width="48%"&gt;
&lt;/div&gt;
&lt;p align="center"&gt;&lt;em&gt;Left: Customizable widget dashboard | Right: Real-time API health monitoring&lt;/em&gt;&lt;/p&gt;

&lt;div align="center"&gt;
  &lt;img src="public/screenshots/analytics-dashboard.png" alt="Platform Analytics" width="80%"&gt;
  &lt;p&gt;&lt;em&gt;Comprehensive analytics for platform usage and performance&lt;/em&gt;&lt;/p&gt;
&lt;/div&gt;

---

## ✨ Features

### 🎯 Core Capabilities
- **🎛️ Drag & Drop Dashboard** — Freely arrange and resize widgets using a responsive 12-column grid powered by `react-grid-layout`
- **📊 11+ Live Data Widgets** — Weather, Crypto, News, GitHub Trends, NASA APOD, Air Quality, Forex, Stocks, Earthquakes, Quotes, and Public Holidays
- **🤖 Synapse AI Assistant** — Streaming chat powered by Groq (compound-beta with web search) and Google Gemini, with full awareness of your live dashboard data
- **🔐 Enterprise-Grade Auth** — Email/password and Google OAuth via NextAuth v5 with JWT sessions
- **🎨 Dual Theme** — System-aware dark/light mode with smooth transitions

### 🛠️ Admin & Monitoring
- **📈 Analytics Dashboard** — Track user growth, widget popularity, API usage, and AI chat metrics
- **🔍 API Health Monitor** — Real-time status monitoring for all 6 external APIs with response times and error tracking
- **📝 Audit Logs** — Complete activity tracking for security and compliance
- **👥 User Management** — Admin panel for managing users and permissions

### ⚡ Developer Experience
- **📱 Responsive Design** — Adaptive grid breakpoints for mobile, tablet, and desktop
- **🔄 Real-time Updates** — Live data refresh with manual and auto-refresh capabilities
- **⌨️ Keyboard Shortcuts** — Press `R` to refresh dashboard, `⌘+K` for command palette

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | App Router, API Routes, Server Components |
| [React 19](https://react.dev/) | Concurrent features & Server Actions |
| [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety throughout |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible component primitives |
| [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) | Draggable & resizable grid system |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| [MongoDB Atlas](https://www.mongodb.com/) | Primary database |
| [Mongoose 9](https://mongoosejs.com/) | ODM & schema modeling |
| [NextAuth v5](https://authjs.dev/) | Authentication & session management |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |

### AI & APIs
| Technology | Purpose |
|-----------|---------|
| [Groq](https://console.groq.com/) | Ultra-fast LLM inference with web search |
| [Google Gemini](https://ai.google.dev/) | Alternative AI model (gemini-1.5-flash) |
| [OpenWeatherMap](https://openweathermap.org/api) | Weather data |
| [CoinGecko](https://www.coingecko.com/en/api) | Crypto prices |
| [NASA API](https://api.nasa.gov/) | Astronomy Picture of the Day |
| [GNews](https://gnews.io/) | News headlines |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas cluster ([free tier](https://www.mongodb.com/pricing) works perfectly)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/synapse.git
cd synapse
npm install
