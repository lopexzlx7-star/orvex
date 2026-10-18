"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, LayoutDashboard, LogOut, Menu, Plug, Settings, Workflow, X } from "lucide-react";
import { cn } from "@/components/ui";
import { signOut } from "@/app/(auth)/actions";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/automacoes", label: "Automações", icon: Workflow },
  { href: "/execucoes", label: "Execuções", icon: Activity },
  { href: "/integracoes", label: "Integrações", icon: Plug },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const initials = (name || email).trim().slice(0, 1).toUpperCase();

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active ? "bg-fg text-bg" : "text-fg-2 hover:bg-line hover:text-fg",
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-medium text-accent">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name || "Sem nome"}</p>
          <p className="truncate text-xs text-fg-3">{email}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost btn-icon" title="Sair" aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <header className="glass-strong sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
        <Link href="/">
          <Image src="/orvex-logo.png" alt="ORVEX" width={96} height={21} className="h-auto dark:invert" priority />
        </Link>
        <button className="btn btn-ghost btn-icon" onClick={() => setOpen(true)} aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <aside className="glass fixed inset-y-3 left-3 z-20 hidden w-60 flex-col p-4 lg:flex">
        <Link href="/" className="mb-8 mt-1 px-2">
          <Image src="/orvex-logo.png" alt="ORVEX" width={108} height={23} className="h-auto dark:invert" priority />
        </Link>
        {nav}
        {footer}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Fechar menu" />
          <aside className="glass-strong fade-in absolute inset-y-0 left-0 flex w-72 flex-col p-4">
            <div className="mb-8 mt-1 flex items-center justify-between px-2">
              <Image src="/orvex-logo.png" alt="ORVEX" width={108} height={23} className="h-auto dark:invert" />
              <button className="btn btn-ghost btn-icon" onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
