"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import { ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar/80 backdrop-blur-xl">
      <SidebarHeader className="py-4">
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-3 h-12 px-3 group">
            <Link prefetch href="/workflows">
              <div className="relative size-9 flex items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200 shadow-sm shadow-cyan-500/20">
                <Image
                  src="/logos/logo.png"
                  alt="Connectivity Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Connectivity
                </span>
                <span className="text-[9px] font-semibold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent uppercase font-mono">
                  Connect • Collaborate
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        asChild
                        className={`gap-x-3 h-10 px-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary shadow-sm"
                            : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Link prefetch href={item.url}>
                          <item.icon className={`size-4 ${isActive ? "text-primary" : ""}`} />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4 pt-2 border-t border-border/40 gap-y-1">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-muted-foreground font-medium group-data-[collapsible=icon]:hidden">
              Appearance
            </span>
            <ThemeToggle className="size-8" />
          </SidebarMenuItem>

          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="gap-x-3 h-10 px-3 rounded-xl bg-gradient-to-r from-primary/15 to-secondary/15 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all border border-primary/20"
                onClick={() => authClient.checkout({ slug: "pro" })}
              >
                <StarIcon className="size-4 text-primary fill-primary/30" />
                <span className="font-semibold text-xs">Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="gap-x-3 h-10 px-3 rounded-xl hover:bg-accent/60 text-muted-foreground hover:text-foreground"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="size-4" />
              <span className="text-sm">Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="gap-x-3 h-10 px-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="size-4" />
              <span className="text-sm">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};