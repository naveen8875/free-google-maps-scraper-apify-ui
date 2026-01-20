import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="ml-64 p-8 flex-1 w-full">
          {children}
        </main>
      </div>
      <footer className="ml-64 py-6 border-t border-border/40 text-center text-sm text-muted-foreground/80">
        <p>
          Built with <span className="text-red-500 animate-pulse">❤️</span> for the cold email community by{" "}
          <a
            href="https://www.automateitplease.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            Automate It Please
          </a>
        </p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs">
          <a
            href="https://www.linkedin.com/in/naveen-choudhary-184411229/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Connect on LinkedIn
          </a>
          <span>•</span>
          <a
            href="https://www.automateitplease.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Visit Website
          </a>
        </div>
      </footer>

      {/* Floating LinkedIn Badge */}
      <a
        href="https://www.linkedin.com/in/naveen-choudhary-184411229/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-border/40 shadow-2xl rounded-full pl-1 pr-4 py-1 hover:scale-105 transition-all duration-300 group"
      >
        <img
          src="https://media.licdn.com/dms/image/v2/D5603AQFeFlEKtaBgqg/profile-displayphoto-crop_800_800/B56ZkEpCyvHcAI-/0/1756719492805?e=1770249600&v=beta&t=KduVcT50np_8s3KME-7shuz_TkNtSJGz58HV7nsifSU"
          alt="Naveen Choudhary"
          className="w-10 h-10 rounded-full border-2 border-primary/20"
        />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">Connect on</span>
          <span className="text-xs font-bold text-[#0077b5] leading-tight">LinkedIn</span>
        </div>
      </a>
    </div>
  );
};
