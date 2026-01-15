import { SignInButton } from "@clerk/clerk-react";
import { 
  Package, 
  BarChart3, 
  Bell, 
  MapPin, 
  QrCode, 
  ArrowRightLeft,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Package,
    title: "Real-Time Inventory",
    description: "Track medicine batches across multiple hospitals with live stock levels and automated alerts."
  },
  {
    icon: QrCode,
    title: "QR Code Scanning",
    description: "Scan and verify medicine batches instantly with mobile-friendly QR code integration."
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified for low stock, overstock, and near-expiry batches before they become critical."
  },
  {
    icon: TrendingUp,
    title: "Demand Forecasting",
    description: "AI-powered predictions using historical data and seasonal disease patterns."
  },
  {
    icon: ArrowRightLeft,
    title: "Auto Redistribution",
    description: "Intelligent suggestions for transferring stock from overstocked to shortage hospitals."
  },
  {
    icon: MapPin,
    title: "Heat Map Analytics",
    description: "Visualize state-level shortages and surpluses for informed policy decisions."
  }
];

const benefits = [
  "Reduce medicine wastage by up to 40%",
  "Prevent stock-outs with predictive alerts",
  "Optimize distribution across hospital networks",
  "Real-time visibility for policy makers",
  "Surge-demand forecasting for emergencies",
  "Seamless integration with existing systems"
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SmartCare Flow</span>
            </div>
            <SignInButton>
              <Button variant="default" size="sm">
                Sign In
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Trusted by 500+ Healthcare Facilities
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            Smart Healthcare
            <br />
            <span className="text-primary">Logistics Platform</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Real-time drug inventory and distribution management across multiple hospitals. 
            Reduce wastage, prevent shortages, and optimize your healthcare supply chain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignInButton>
              <Button size="lg" className="text-base px-8">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </SignInButton>
            <Button variant="outline" size="lg" className="text-base px-8">
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary">40%</p>
              <p className="text-sm text-muted-foreground mt-1">Wastage Reduction</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary">99.9%</p>
              <p className="text-sm text-muted-foreground mt-1">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary">2M+</p>
              <p className="text-sm text-muted-foreground mt-1">Batches Tracked</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Hospitals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage
              <br />
              Healthcare Logistics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed for hospital admins, warehouse teams, and policy makers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple onboarding process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Register Your Facility</h3>
              <p className="text-muted-foreground">
                Sign up and add your hospital details, storage locations, and team members.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Import Inventory</h3>
              <p className="text-muted-foreground">
                Upload your existing inventory or start scanning batches with QR codes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Optimize & Monitor</h3>
              <p className="text-muted-foreground">
                Get real-time insights, alerts, and AI-powered redistribution suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Built for Healthcare Excellence
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                SmartCare Flow is designed to meet the unique challenges of healthcare logistics, 
                ensuring medicines reach patients when and where they're needed.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Real-Time Dashboard</p>
                  <p className="text-sm text-muted-foreground">Monitor all facilities at a glance</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Total SKUs</span>
                  <span className="font-semibold text-foreground">12,458</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Active Alerts</span>
                  <span className="font-semibold text-warning">23</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Pending Transfers</span>
                  <span className="font-semibold text-primary">8</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <span className="text-sm text-foreground">Stock Health</span>
                  <span className="font-semibold text-success">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Start in under 5 minutes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your
            <br />
            Healthcare Supply Chain?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join hundreds of healthcare facilities already using SmartCare Flow to 
            reduce wastage, prevent shortages, and save lives.
          </p>
          <SignInButton>
            <Button size="lg" className="text-base px-10">
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">SmartCare Flow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 SmartCare Flow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
