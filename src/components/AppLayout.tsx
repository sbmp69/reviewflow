"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { LayoutDashboard, Users, MessageSquare, Settings, CreditCard, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: MessageSquare },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mr-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xl">
              »
            </div>
            <span className="text-xl font-bold tracking-tight">reviewflow</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 border-r border-gray-200 pr-4">
              <div className="text-sm font-medium text-slate-700">
                {user?.displayName || user?.email?.split('@')[0]}
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
