import LandingNavbar from "./components/LandingNavbar";


export default function Home() {
  return (
    <div className="min-h-screen">
      < LandingNavbar />

      <section className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            zero-knowledge storage network
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Your spare disk space.
            <br />
            <span className="text-fog">Someone else&rsquo;s files.</span>
            <br />
            Neither can see the other.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-fog">
            Disk0 pools unused storage from people who have it, and gives it to people
            who need it — as encrypted, hash-verified fragments.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button className="rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink hover:bg-signal/90 transition-colors">
              Share your storage
            </button>
            <button className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-paper hover:border-paper/40 hover:bg-panel transition-colors">
              Store your files
            </button>
          </div>
          
        </div>
        
      </section>
    </div>
  );
}