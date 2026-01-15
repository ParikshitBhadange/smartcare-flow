import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Scan from "@/pages/Scan";
import Transfers from "@/pages/Transfers";
import Alerts from "@/pages/Alerts";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <>
          {/* Loading state while Clerk initializes */}
          <ClerkLoading>
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </ClerkLoading>

          {/* Main app - only renders after Clerk is loaded */}
          <ClerkLoaded>
            <Routes>
              {/* Landing Page - signed out users only */}
              <Route
                path="/landingpage"
                element={
                  <>
                    <SignedIn>
                      <Navigate to="/dashboard" replace />
                    </SignedIn>
                    <SignedOut>
                      <LandingPage />
                    </SignedOut>
                  </>
                }
              />

              {/* Root route - redirect based on auth status */}
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <Navigate to="/dashboard" replace />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/landingpage" replace />
                    </SignedOut>
                  </>
                }
              />

              {/* Protected routes - require authentication */}
              <Route
                element={
                  <>
                    <SignedIn>
                      <AppLayout />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/landingpage" replace />
                    </SignedOut>
                  </>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/transfers" element={<Transfers />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ClerkLoaded>

          {/* Toast notifications */}
          <Toaster />
          <Sonner />
        </>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;