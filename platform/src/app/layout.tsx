import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "ORVEX Platform", template: "%s · ORVEX" },
  description: "Automações, agentes de IA e fluxos de trabalho da ORVEX.",
};

// Aplica o tema salvo antes da pintura para evitar flash.
const themeScript = `(function(){try{var t=document.documentElement.dataset.pref||'system';if(t==='system'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const saved = (await cookies()).get("orvex-theme")?.value;
  const pref = saved === "light" || saved === "dark" ? saved : "system";
  return (
    <html lang="pt-BR" data-pref={pref} data-theme={pref === "dark" ? "dark" : "light"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
