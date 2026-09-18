"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

type FileData = {
  id: number;
  name: string;
  dateModified: string;
  size: number;
  type: string;
  owner: string;
  folder: string;
};

type NavbarProps = {
  data: FileData[];
};

export default function Navbar({ data }: NavbarProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();


  const user = useAuthStore((state)=>state.user);
  const username = user?.username;
  const symbol = username?.charAt(0).toUpperCase();

  const suggestions = data.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="flex items-center px-6 py-4">

        {/* Logo */}
        <div className="w-xs text-center">
          Disk0
        </div>

        {/* Search */}
        <div className="ml-20 w-max flex flex-1 justify-between">
          <div className="relative w-xl">

            {/* Search icon */}
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-fog"
            />

            {/* Input */}
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              autoComplete="off"
              className="w-full rounded-md border-2 border-line bg-panel py-2.5 pl-10 pr-3.5 text-sm text-paper placeholder:text-fog/60 outline-none transition-colors focus:border-signal"
            />

            {/* Suggestions */}
            {search.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-md border border-line bg-panel shadow-xl hide-scrollbar">

                {suggestions.length > 0 ? (
                  suggestions.map((file) => (
                    <div
                      key={file.id}
                      className="cursor-pointer border-b border-line px-4 py-3 last:border-b-0 hover:bg-signal/5"
                    >
                      <p className="text-sm text-paper">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-fog">
                        {file.folder} · {file.type}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-fog">
                    No files found
                  </div>
                )}

              </div>
            )}

          </div>

          <button onClick={()=>router.push("/profile")}  className="flex size-11 items-center justify-center rounded-full bg-amber-700">
            <span className="relative -top-0.5 font-medium text-2xl leading-none text-amber-300">
              {symbol}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}