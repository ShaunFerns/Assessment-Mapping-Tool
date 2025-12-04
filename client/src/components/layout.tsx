import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, BookOpen, FileText, BarChart2 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/programme", label: "Programme", icon: Settings },
    { href: "/modules", label: "Modules", icon: BookOpen },
    { href: "/assessments", label: "Assessments", icon: FileText },
    { href: "/visualisations", label: "Visualisations", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,97%)] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-primary text-primary-foreground shadow-md z-10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img 
                src="/tud_logo.png" 
                alt="Home" 
                className="h-10 w-10 cursor-pointer hover:opacity-90 transition-opacity object-contain"
              />
            </Link>
            <Link href="/">
              <h1 className="font-heading font-bold text-lg tracking-tight hidden sm:block cursor-pointer hover:opacity-90 transition-opacity">
                Assessment Mapping Tool
              </h1>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                    isActive 
                      ? "bg-secondary text-white shadow-sm" 
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                  )}>
                    <Icon size={16} />
                    <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} Curriculum Insight Suite</p>
        </div>
      </footer>
    </div>
  );
}
