import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';
import Chatbot from '../Chatbot';

interface AppLayoutProps {
  children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <AppSidebar isCollapsed={isSidebarCollapsed} />

      {/* Top Navigation */}
      <TopBar
        onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300 min-h-screen',
          isSidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>

      {/* 🩺 SmartCare Chatbot (FLOATING – DOES NOT BREAK UI) */}
      <Chatbot />
    </div>
  );
}
