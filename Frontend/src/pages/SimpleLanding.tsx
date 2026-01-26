import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Package, BarChart3, Bell, QrCode, ArrowRightLeft, TrendingUp, CheckCircle2, ArrowRight, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Real-Time Inventory",
    description: "Track medicine batches across multiple hospitals with live stock levels.",
    color: "bg-blue-500"
  },
  {
    icon: QrCode,
    title: "QR Code Scanning",
    description: "Scan and verify medicine batches instantly with mobile-friendly integration.",
    color: "bg-purple-500"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified for low stock, overstock, and near-expiry batches.",
    color: "bg-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Demand Forecasting",
    description: "AI-powered predictions using historical data and seasonal patterns.",
    color: "bg-green-500"
  },
  {
    icon: ArrowRightLeft,
    title: "Auto Redistribution",
    description: "Intelligent suggestions for transferring stock between hospitals.",
    color: "bg-pink-500"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize state-level shortages and surpluses for informed decisions.",
    color: "bg-cyan-500"
  }
];

const stats = [
  { value: "40%", label: "Wastage Reduction" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "2M+", label: "Batches Tracked" },
  { value: "500+", label: "Hospitals" }
];

const SimpleLanding = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartCare Flow</span>
            </div>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now available for all healthcare facilities
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Medicine
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Supply Chain Management
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Real-time drug inventory and distribution management. 
            <span className="text-gray-900 font-medium"> Reduce wastage by 40%</span>, prevent shortages, and optimize your supply chain with AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
            <button className="px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:border-gray-400 transition-colors flex items-center gap-2">
              Watch Demo
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            No credit card required · Free forever plan
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Healthcare Logistics</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to manage your entire medicine supply chain efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Why Choose SmartCare Flow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-white/80">HIPAA compliant with end-to-end encryption</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-white/80">Instant notifications and live tracking</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-white/80">Smart predictions and recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Healthcare Supply Chain?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join hundreds of healthcare facilities already using SmartCare Flow
          </p>
          <SignUpButton mode="modal">
            <button className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
          <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            No credit card required · Free forever plan
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">SmartCare Flow</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 SmartCare Flow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLanding;
