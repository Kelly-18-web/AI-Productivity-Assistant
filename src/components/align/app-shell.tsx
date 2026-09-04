import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  ClipboardList,
  FileText,
  FlaskConical,
  Gauge,
  LayoutGrid,
  ListChecks,
  Mail,
  Menu,
  MessagesSquare,
  Search,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: Gauge, group: "Overview" },
  { to: "/projects", label: "Projects", icon: LayoutGrid, group: "Overview" },
  { to: "/meetings", label: "Meeting Summarizer", icon: MessagesSquare, group: "Workflow" },
  { to: "/requirements", label: "Requirements", icon: ClipboardList, group: "Workflow" },
  { to: "/stories", label: "User Stories", icon: ListChecks, group: "Workflow" },
  { to: "/tasks", label: "Tasks", icon: FileText, group: "Workflow" },
  { to: "/email", label: "Smart Email", icon: Mail, group: "Workflow" },
  { to: "/research", label: "Research Assistant", icon: Search, group: "Assist" },
  { to: "/knowledge", label: "Knowledge Chat", icon: Brain, group: "Assist" },
  { to: "/scope-guard", label: "Scope Guard", icon: ShieldAlert, group: "Assist" },
  { to: "/prompts", label: "Prompt Engineering", icon: FlaskConical, group: "Practice" },
  { to: "/documentation", label: "Documentation", icon: BookOpen, group: "Practice" },
  { to: "/settings", label: "Settings", icon: Settings, group: "Practice" },
] as const;

const GROUPS = ["Overview", "Workflow", "Assist", "Practice"] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-6">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
            {group}
          </p>
          <ul className="mt-2 space-y-0.5">
            {NAV.filter((n) => n.group === group).map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon
                      className={cn("size-4", active ? "text-sidebar-primary" : "opacity-70")}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-3">
      <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">
        AB
      </span>
      <span>
        <span className="block font-display text-base font-semibold leading-none text-sidebar-accent-foreground">
          AlignBA
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/60">
          BA workspace
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col justify-between bg-sidebar py-6 lg:flex">
        <div className="space-y-8 overflow-y-auto">
          <Brand />
          <div className="px-3">
            <NavList />
          </div>
        </div>
        <p className="mx-3 mt-6 rounded-lg bg-sidebar-accent/50 p-3 text-[11px] leading-relaxed text-sidebar-foreground/80">
          AI assists. You decide. Nothing leaves AlignBA without your approval.
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-xs font-bold text-primary-foreground">
            AB
          </span>
          <span className="font-display text-base font-semibold">AlignBA</span>
        </Link>
        <Button size="icon" variant="outline" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="size-4" />
        </Button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-sidebar py-6">
            <div className="mb-6 flex items-center justify-between pr-3">
              <Brand />
              <Button
                size="icon"
                variant="ghost"
                className="text-sidebar-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="px-3">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <main className="lg:pl-72">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
