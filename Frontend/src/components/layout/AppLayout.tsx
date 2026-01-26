import { useState, ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isCollapsed={isSidebarCollapsed} />
     
      <TopBar
        onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
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
    </div>
  );
}
