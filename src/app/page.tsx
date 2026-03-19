import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Brain,
  LayoutDashboard,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  Github,
  Twitter,
  Mail,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl">Synapse</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Data Command Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your Data, <span className="text-primary">One Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Create personalized dashboards by combining real-time data widgets from multiple sources. 
            Let AI analyze and summarize your aggregated data for actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Synapse brings together powerful features to help you monitor, analyze, and act on your data.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={LayoutDashboard}
              title="Multi-Source Widgets"
              description="Connect to Weather, News, Crypto, GitHub, NASA, and Air Quality APIs in one place."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Insights"
              description="Get intelligent analysis and summaries of your aggregated dashboard data with Gemini AI."
            />
            <FeatureCard
              icon={Zap}
              title="Drag & Drop"
              description="Easily arrange and resize widgets with an intuitive grid layout system."
            />
            <FeatureCard
              icon={Shield}
              title="Admin Control"
              description="Comprehensive admin panel with user management, API health monitoring, and analytics."
            />
          </div>
        </div>
      </section>

      {/* Widget Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Widgets</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from a variety of data sources to build your perfect dashboard.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WidgetPreview
              title="Weather"
              description="Real-time weather data and 5-day forecasts for any city worldwide."
              icon={LayoutDashboard}
              color="bg-blue-500"
            />
            <WidgetPreview
              title="News"
              description="Latest headlines from various categories and countries."
              icon={LayoutDashboard}
              color="bg-green-500"
            />
            <WidgetPreview
              title="Cryptocurrency"
              description="Track crypto prices, market cap, and price changes in real-time."
              icon={LayoutDashboard}
              color="bg-yellow-500"
            />
            <WidgetPreview
              title="GitHub"
              description="Monitor trending repositories and user profiles."
              icon={LayoutDashboard}
              color="bg-purple-500"
            />
            <WidgetPreview
              title="NASA APOD"
              description="Daily astronomy pictures with explanations from NASA."
              icon={LayoutDashboard}
              color="bg-red-500"
            />
            <WidgetPreview
              title="Air Quality"
              description="Real-time air quality index and pollutant data for any city."
              icon={LayoutDashboard}
              color="bg-teal-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join thousands of users who trust Synapse for their data monitoring needs.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Your Free Account
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-xl">Synapse</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                AI-powered data command center for modern teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">API Reference</Link></li>
                <li><Link href="#" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Synapse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function WidgetPreview({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: typeof LayoutDashboard;
  color: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
