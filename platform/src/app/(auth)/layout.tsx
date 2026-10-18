import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="fade-in w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Image src="/orvex-logo.png" alt="ORVEX" width={128} height={28} priority className="h-auto dark:invert" />
        </div>
        {children}
      </div>
    </main>
  );
}
