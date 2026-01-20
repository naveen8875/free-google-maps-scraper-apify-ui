import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/scrape", label: "Scrape", emoji: "🔍" },
  { to: "/datasets", label: "Datasets", emoji: "📊" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-xl emoji">🗺️</span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">MapScraper</h1>
            <p className="text-xs text-muted-foreground">Data Extraction</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  )
                }
              >
                <span className="text-lg emoji">{item.emoji}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-2">API Status</p>
          <div className="flex items-center gap-2">
            <span className="emoji">✅</span>
            <span className="text-sm text-foreground font-medium">Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
