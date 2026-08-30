import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hover:bg-accent/60 transition-colors" />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};