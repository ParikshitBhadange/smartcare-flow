import { Menu, Bell, ChevronDown, LogOut, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Mock data - you should import these from your actual data file
const mockHospitals = [
  { id: 'h1', name: 'City General Hospital' },
  { id: 'h2', name: 'Regional Medical Center' },
  { id: 'h3', name: 'Central District Hospital' },
];

const mockAlerts = [
  {
    id: '1',
    title: 'Critical Stock Alert',
    description: 'Epinephrine levels critically low',
    severity: 'critical' as const,
    isRead: false,
  },
  {
    id: '2',
    title: 'Expiry Warning',
    description: '15 batches expiring in 30 days',
    severity: 'high' as const,
    isRead: false,
  },
  {
    id: '3',
    title: 'Transfer Approved',
    description: 'Transfer to Regional Medical approved',
    severity: 'medium' as const,
    isRead: true,
  },
];

interface TopBarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export function TopBar({ onMenuClick, isSidebarCollapsed }: TopBarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  // Local state for hospital selection (in production, use global state or context)
  const [selectedHospitalId, setSelectedHospitalId] = useState('h1');
  
  // Get user data from Clerk - updates automatically when profile changes
  const userRole = (user?.publicMetadata?.role as string) || 'hospital_admin';
  const userName = user?.fullName || user?.firstName || 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userImageUrl = user?.imageUrl; // Profile picture from Clerk
  
  const unreadAlerts = mockAlerts.filter((a) => !a.isRead).length;

  const handleLogout = async () => {
    await signOut();
    navigate('/landingpage');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Hospital Selector */}
        {userRole === 'hospital_admin' && (
          <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId}>
            <SelectTrigger className="w-[220px] bg-background">
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select hospital" />
            </SelectTrigger>
            <SelectContent>
              {mockHospitals.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {userRole !== 'hospital_admin' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>
              {userRole === 'central_admin' ? 'Central Administration' : 'Policy Dashboard'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-critical text-critical-foreground text-xs"
                >
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockAlerts.slice(0, 3).map((alert) => (
              <DropdownMenuItem
                key={alert.id}
                className="flex flex-col items-start gap-1 py-3"
                onClick={() => navigate('/alerts')}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      alert.severity === 'critical'
                        ? 'destructive'
                        : alert.severity === 'high'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                  <span className="font-medium">{alert.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {alert.description}
                </p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary"
              onClick={() => navigate('/alerts')}
            >
              View all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                {/* Show user's profile picture if uploaded, otherwise show initials */}
                {userImageUrl && <AvatarImage src={userImageUrl} alt={userName} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}