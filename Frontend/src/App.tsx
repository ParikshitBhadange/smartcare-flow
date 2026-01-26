import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Scan from "@/pages/Scan";
import Transfers from "@/pages/Transfers";
import Alerts from "@/pages/Alerts";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import SimpleLanding from "./pages/SimpleLanding";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
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

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;