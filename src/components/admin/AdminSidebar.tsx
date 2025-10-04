import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  FileText, 
  Calendar,
  Settings,
  LogOut,
  Shield
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Volunteers",
    url: "/dashboard/volunteers",
    icon: Users,
  },
  {
    title: "Donations",
    url: "/dashboard/donations",
    icon: Heart,
  },
  {
    title: "Content",
    url: "/dashboard/content",
    icon: FileText,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Calendar,
  },
];

export function AdminSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={`${!open ? "w-14" : "w-64"} transition-all duration-300`}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {open && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Panel</h2>
              <p className="text-xs text-sidebar-foreground/60">EJO Heza Sport</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive: linkActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          (linkActive || isActive(item.url))
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {open && user?.email && (
            <div className="px-3 py-2 text-xs text-sidebar-foreground/60 border-t border-sidebar-border">
              Signed in as<br />
              <span className="font-medium text-sidebar-foreground">{user.email}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size={!open ? "icon" : "sm"}
            onClick={handleSignOut}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}