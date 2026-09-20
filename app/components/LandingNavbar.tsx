'use client'

import { useRouter } from "next/navigation";

export default function LandingNavbar() {

  const router = useRouter();  
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5 text-lg font-semibold">
          Disk0
        </div>

        <nav className="hidden items-center gap-8 text-sm text-fog md:flex">
          <a href="#" className="hover:text-paper transition-colors">How it works</a>
          <a href="#" className="hover:text-paper transition-colors">Network</a>
          <a href="#" className="hover:text-paper transition-colors">Zero-knowledge model</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden text-sm text-fog hover:text-paper sm:block" onClick={()=>router.push("/auth?mode=signin")}>Sign in</button>
          <button className="rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink hover:bg-signal/90" onClick={()=>router.push("/auth?mode=signup")}>
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
