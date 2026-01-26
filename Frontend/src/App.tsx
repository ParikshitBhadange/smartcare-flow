<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
=======
import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";
>>>>>>> 16842f3 (Update smartcare-flow with backend controllers, models, routes and frontend chatbot component)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AppLayout } from "@/components/layout/AppLayout";
<<<<<<< HEAD
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
=======

>>>>>>> 16842f3 (Update smartcare-flow with backend controllers, models, routes and frontend chatbot component)
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Scan from "@/pages/Scan";
import Transfers from "@/pages/Transfers";
import Alerts from "@/pages/Alerts";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
<<<<<<< HEAD
import SimpleLanding from "./pages/SimpleLanding";
=======
>>>>>>> 16842f3 (Update smartcare-flow with backend controllers, models, routes and frontend chatbot component)

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
<<<<<<< HEAD
          {/* Public landing page */}
          <Route path="/" element={<SimpleLanding />} />
          <Route path="/landingpage" element={<SimpleLanding />} />

          {/* Protected App pages with layout */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><AppLayout><Inventory /></AppLayout></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><AppLayout><Scan /></AppLayout></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><AppLayout><Transfers /></AppLayout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AppLayout><Alerts /></AppLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
=======
          {/* ---------------- PUBLIC ROUTES ---------------- */}

          {/* Landing Page */}
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

          {/* Root Route */}
          <Route
            path="/"
            element={
              <>
                <ClerkLoading>
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  </div>
                </ClerkLoading>

                <ClerkLoaded>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/landingpage" replace />
                  </SignedOut>
                </ClerkLoaded>
              </>
            }
          />

          {/* ---------------- PROTECTED ROUTES ---------------- */}

          <Route
            element={
              <>
                <ClerkLoading>
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  </div>
                </ClerkLoading>

                <ClerkLoaded>
                  <SignedIn>
                    <AppLayout />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/landingpage" replace />
                  </SignedOut>
                </ClerkLoaded>
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
>>>>>>> 16842f3 (Update smartcare-flow with backend controllers, models, routes and frontend chatbot component)

          {/* ---------------- 404 ---------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>

<<<<<<< HEAD
=======
        {/* Global Toasts */}
>>>>>>> 16842f3 (Update smartcare-flow with backend controllers, models, routes and frontend chatbot component)
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
