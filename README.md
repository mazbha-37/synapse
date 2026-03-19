# Synapse - AI-Powered Data Command Center

Synapse is a modern, full-stack web application that allows users to create personalized dashboards by combining real-time data widgets from multiple APIs. It features an AI assistant powered by Google Gemini that can analyze and summarize aggregated dashboard data.

![Synapse Dashboard](https://via.placeholder.com/800x400?text=Synapse+Dashboard)

## Features

- **Multi-Source Widgets**: Connect to Weather, News, Cryptocurrency, GitHub, NASA APOD, and Air Quality APIs
- **AI-Powered Insights**: Get intelligent analysis of your dashboard data with Google Gemini
- **Drag & Drop Layout**: Intuitive grid system for arranging widgets
- **Real-time Data**: All widgets fetch live data from their respective APIs
- **Admin Panel**: Comprehensive user management, API health monitoring, and analytics
- **Authentication**: Google OAuth and email/password authentication with NextAuth.js
- **Dark/Light Mode**: Full theme support with next-themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS 3.4+ |
| UI Components | shadcn/ui |
| Authentication | NextAuth.js v5 (Auth.js) |
| Database | MongoDB Atlas with Mongoose |
| AI Integration | Google Gemini API |
| Dashboard Grid | react-grid-layout |
| Charts | Recharts |

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier works)
- Google Cloud Console account (for OAuth)
- API keys for external services

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/synapse.git
cd synapse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your credentials:
```env
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/synapse?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# External APIs
OPENWEATHERMAP_API_KEY=your_key
GNEWS_API_KEY=your_key
NASA_API_KEY=your_key
AQICN_API_KEY=your_key

# AI
GEMINI_API_KEY=your_key
```

5. Seed the database:
```bash
npx tsx scripts/seed.ts
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials

After seeding, you can log in with:
- Email: `admin@synapse.dev`
- Password: `Admin@123`

## API Keys Setup

### OpenWeatherMap
1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Get your free API key
3. Add to `.env.local`

### GNews
1. Sign up at [gnews.io](https://gnews.io)
2. Get your free API key (100 requests/day)
3. Add to `.env.local`

### NASA API
1. Sign up at [api.nasa.gov](https://api.nasa.gov)
2. Get your free API key
3. Add to `.env.local`

### AQICN (Air Quality)
1. Sign up at [aqicn.org/api](https://aqicn.org/api/)
2. Get your free API key
3. Add to `.env.local`

### Google Gemini
1. Go to [AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env.local`

## Project Structure

```
synapse/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Auth route group
│   │   ├── (dashboard)/     # Dashboard route group
│   │   ├── (admin)/         # Admin route group
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── widgets/         # Widget components
│   │   ├── ai/              # AI chat components
│   │   └── admin/           # Admin components
│   ├── lib/
│   │   ├── apis/            # External API services
│   │   ├── auth.ts          # NextAuth config
│   │   ├── db.ts            # MongoDB connection
│   │   ├── gemini.ts        # Gemini AI client
│   │   └── constants.ts     # App constants
│   ├── models/              # Mongoose models
│   ├── types/               # TypeScript types
│   └── validators/          # Zod schemas
├── scripts/
│   └── seed.ts              # Database seeding
└── public/                  # Static assets
```

## Widget Types

### Weather
- Current weather conditions
- 5-day forecast
- Temperature, humidity, wind speed
- Configurable city and units (metric/imperial)

### News
- Latest headlines from GNews API
- Filter by category and country
- Configurable article count

### Cryptocurrency
- Real-time prices from CoinGecko
- Price changes and market cap
- 7-day sparkline charts
- Configurable coins and currency

### GitHub
- Trending repositories
- User profile stats
- Stars, forks, and language info

### NASA APOD
- Astronomy Picture of the Day
- HD images with explanations
- Configurable count (1-5 images)

### Air Quality
- Real-time AQI data
- Pollutant levels (PM2.5, PM10)
- Color-coded health indicators

## Admin Panel

The admin panel provides:

- **User Management**: View, activate/deactivate, and change user roles
- **API Health Monitor**: Real-time status of all API integrations
- **Analytics Dashboard**: User growth, widget popularity, API usage charts
- **Audit Logs**: Complete activity tracking with filtering

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Configuration

1. Whitelist Vercel's IP range or use `0.0.0.0/0` for all IPs
2. Ensure your connection string uses the correct password

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | For Google auth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | For Google auth |
| `OPENWEATHERMAP_API_KEY` | Weather API key | Yes |
| `GNEWS_API_KEY` | News API key | Yes |
| `NASA_API_KEY` | NASA API key | Yes |
| `AQICN_API_KEY` | Air quality API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- All the free API providers that make this project possible

## Support

For support, email support@synapse.dev or open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
