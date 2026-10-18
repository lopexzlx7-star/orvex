import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { AutomationStatus, ExecutionStatus } from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass p-5 sm:p-6", className)}>{children}</div>;
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-fg-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  err: "bg-err-soft text-err",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-line text-fg-2",
} as const;

export type Tone = keyof typeof TONES;

export function Badge({ tone = "neutral", children, dot = true }: { tone?: Tone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", TONES[tone])}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const AUTOMATION_STATUS: Record<AutomationStatus, { label: string; tone: Tone }> = {
  active: { label: "Ativa", tone: "ok" },
  paused: { label: "Pausada", tone: "neutral" },
  error: { label: "Com erro", tone: "err" },
};

const EXECUTION_STATUS: Record<ExecutionStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pendente", tone: "neutral" },
  running: { label: "Em execução", tone: "accent" },
  success: { label: "Sucesso", tone: "ok" },
  error: { label: "Erro", tone: "err" },
};

export function AutomationStatusBadge({ status }: { status: AutomationStatus }) {
  const s = AUTOMATION_STATUS[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function ExecutionStatusBadge({ status }: { status: ExecutionStatus }) {
  const s = EXECUTION_STATUS[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="glass mb-4 flex h-12 w-12 items-center justify-center !rounded-2xl">
        <Icon className="h-5 w-5 text-fg-2" strokeWidth={1.6} />
      </div>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-fg-2">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size,
  children,
  className,
}: {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)}>
      {children}
    </Link>
  );
}

export function Notice({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <div className={cn("rounded-xl px-4 py-3 text-sm", TONES[tone])}>{children}</div>;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-err">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
