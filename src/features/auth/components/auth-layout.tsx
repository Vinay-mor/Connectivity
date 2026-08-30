import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-svh flex flex-col justify-center items-center gap-6 p-6 md:p-10 bg-background overflow-hidden">
      {/* Background ambient lighting effects matching cyan and purple */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-md flex-col gap-6 z-10">
        <Link
          href="/"
          className="flex flex-col items-center gap-2.5 self-center font-medium group transition-transform duration-200 hover:scale-105"
        >
          <div className="relative size-16 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-cyan-500/20">
            <Image
              src="/logos/logo.png"
              alt="Connectivity Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Connectivity
            </span>
            <span className="text-[10px] font-mono tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent uppercase font-semibold">
              Connect • Collaborate • Grow
            </span>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
};