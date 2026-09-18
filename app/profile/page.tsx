"use client";

import {
  Calendar,
  CheckCircle2,
  Edit,
  Lock,
  LogOut,
  Mail,
  Shield,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Profile = () => {
  const user = useAuthStore((state)=>state.user);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-semibold tracking-tight">
            Profile
          </h1>

          <p className="mt-2 text-m text-fog">
            Manage your account and security settings.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* Profile Card */}
          <section className="h-fit rounded-2xl border border-line bg-panel p-7">
            <div className="flex flex-col items-center text-center">

              {/* Avatar */}
              <div className="flex size-28 items-center justify-center rounded-full bg-amber-700">
                <span className="text-7xl pb-4 font-medium text-amber-300">
                  {user?.username.charAt(0)}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                {user?.username}
              </h2>


              <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm transition hover:bg-ink">
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </section>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Personal Information */}
            <section className="rounded-2xl border border-line bg-panel">

              <div className="border-b border-line px-6 py-5">
                <h2 className="font-medium">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-fog">
                  Your account details and contact information.
                </p>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">

                {/* Name */}
                <div className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink">
                    <User size={19} className="text-fog" />
                  </div>

                  <div>
                    <p className="text-xs text-fog">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {user?.username}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink">
                    <Mail size={19} className="text-fog" />
                  </div>

                  <div>
                    <p className="text-xs text-fog">
                      Email Address
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink">
                    <Calendar size={19} className="text-fog" />
                  </div>

                  <div>
                    <p className="text-xs text-fog">
                      Member Since
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {user?.created_at.slice(0,10)}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Email Verification */}
            <section className="rounded-2xl border border-line bg-panel">

              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <div>
                  <h2 className="font-medium">
                    Email Verification
                  </h2>

                  <p className="mt-1 text-sm text-fog">
                    Verify your email to keep your account secure.
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5">
                  <span className="size-2 rounded-full bg-amber-400" />

                  <span className="text-xs font-medium text-amber-300">
                    Pending
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 px-6 py-6">

                <div className="flex items-center gap-4">

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                    <Mail size={21} className="text-amber-300" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Verify your email address
                    </p>

                    <p className="mt-1 text-xs text-fog">
                      A verification link will be sent to{" "}
                      <span className="text-paper">
                        {user?.email}
                      </span>
                    </p>
                  </div>

                </div>

                <button className="flex shrink-0 items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-90">
                  Verify Email
                  <ChevronRight size={16} />
                </button>

              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-line bg-panel">

              <div className="border-b border-line px-6 py-5">
                <h2 className="font-medium">
                  Security
                </h2>

                <p className="mt-1 text-sm text-fog">
                  Manage your account security.
                </p>
              </div>

              <div className="divide-y divide-line">

                {/* Change Password */}
                <button className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-ink">
                  <div className="flex items-center gap-4">

                    <div className="flex size-11 items-center justify-center rounded-xl bg-ink">
                      <Lock size={19} className="text-fog" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Change Password
                      </p>

                      <p className="mt-1 text-xs text-fog">
                        Update your account password
                      </p>
                    </div>

                  </div>

                  <ChevronRight size={18} className="text-fog" />
                </button>

                {/* Logout */}
                <button className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-ink">
                  <div className="flex items-center gap-4">

                    <div className="flex size-11 items-center justify-center rounded-xl bg-ink">
                      <LogOut size={19} className="text-fog" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Log Out
                      </p>

                      <p className="mt-1 text-xs text-fog">
                        Sign out of your account
                      </p>
                    </div>

                  </div>

                  <ChevronRight size={18} className="text-fog" />
                </button>

              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;