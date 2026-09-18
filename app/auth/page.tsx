"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loginApi,
  registerApi,
} from "../api/authApi";
import { useAuthStore } from "../store/authStore";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left side */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mode switch */}
          <div className="mb-8 inline-flex rounded-lg border border-line bg-panel p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={
                "rounded-md px-4 py-1.5 transition-colors " +
                (mode === "signin"
                  ? "bg-panel-raised text-paper"
                  : "text-fog hover:text-paper")
              }
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => setMode("signup")}
              className={
                "rounded-md px-4 py-1.5 transition-colors " +
                (mode === "signup"
                  ? "bg-panel-raised text-paper"
                  : "text-fog hover:text-paper")
              }
            >
              Create account
            </button>
          </div>

          {/* Auth card */}
          {mode === "signin" ? (
            <SigninCard />
          ) : (
            <SignupCard
              onRegistered={() => setMode("signin")}
            />
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="hidden border-l border-line bg-panel/40 md:block" />
    </div>
  );
}

/* =====================================================
   SIGN IN
===================================================== */

function SigninCard() {
  const router = useRouter();

  const [submitting, setSubmitting] =
    useState(false);

  const login = useAuthStore(
    (state) => state.login
  );

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form = e.currentTarget;

    const identifier = (
      form.elements.namedItem(
        "identifier"
      ) as HTMLInputElement
    ).value;

    const password = (
      form.elements.namedItem(
        "password"
      ) as HTMLInputElement
    ).value;

    try {
      setSubmitting(true);

      const data = await loginApi({
        identifier,
        password,
      });

      console.log(
        "Access token:",
        data.accessToken
      );

      console.log(
        "Logged in user:",
        data.user
      );

      /*
       * Login backend returns:
       *
       * {
       *   accessToken,
       *   user
       * }
       */

      login(
        data.accessToken,
        data.user
      );

      router.replace("/dashboard");

    } catch (err) {
      console.error(
        "Login failed:",
        err
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl">
        Welcome back
      </h1>

      <h3 className="mb-5 text-sm text-fog">
        Sign in to reach dashboard
      </h3>

      <form onSubmit={handleSubmit}>

        {/* Identifier */}

        <label
          htmlFor="identifier"
          className="mb-2 block text-sm text-fog"
        >
          Username / Email
        </label>

        <input
          id="identifier"
          name="identifier"
          type="text"
          required
          placeholder="you@example.com"
          className="mb-3 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 outline-none focus:border-signal"
        />

        {/* Password */}

        <label
          htmlFor="password"
          className="mb-2 block text-sm text-fog"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••••••"
          className="mb-3 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 outline-none focus:border-signal"
        />

        {/* Submit */}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-shard px-3.5 py-2.5 font-medium text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Signing in..."
            : "Sign in"}
        </button>

      </form>
    </div>
  );
}

/* =====================================================
   SIGN UP
===================================================== */

type SignupCardProps = {
  onRegistered: () => void;
};

function SignupCard({
  onRegistered,
}: SignupCardProps) {
  const [submitting, setSubmitting] =
    useState(false);

  const [registered, setRegistered] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form = e.currentTarget;

    const username = (
      form.elements.namedItem(
        "username"
      ) as HTMLInputElement
    ).value;

    const email = (
      form.elements.namedItem(
        "email"
      ) as HTMLInputElement
    ).value;

    const password = (
      form.elements.namedItem(
        "password"
      ) as HTMLInputElement
    ).value;

    const confirmPassword = (
      form.elements.namedItem(
        "confirm_password"
      ) as HTMLInputElement
    ).value;

    /* Password validation */

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      setSubmitting(true);

      const data = await registerApi({
        username,
        email,
        password,
      });

      console.log(
        "Registered user:",
        data.user
      );

      /*
       * Register only returns user.
       *
       * It does NOT return accessToken.
       *
       * Therefore we do NOT call:
       *
       * login(...)
       */

      setRegistered(true);

    } catch (err) {
      console.error(
        "Registration failed:",
        err
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =====================================================
     REGISTRATION SUCCESS
  ===================================================== */

  if (registered) {
    return (
      <div>

        <div className="mb-6 rounded-lg border border-line bg-panel p-6">

          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-shard/10 text-xl text-shard">
            ✓
          </div>

          <h1 className="mb-2 text-2xl">
            Account created
          </h1>

          <p className="text-sm leading-6 text-fog">
            Your account has been created
            successfully. Please sign in to
            continue to your dashboard.
          </p>

        </div>

        <button
          type="button"
          onClick={onRegistered}
          className="w-full rounded-sm bg-shard px-3.5 py-2.5 font-medium text-ink transition-opacity hover:opacity-90"
        >
          Go to Sign in
        </button>

      </div>
    );
  }

  /* =====================================================
     REGISTRATION FORM
  ===================================================== */

  return (
    <div>
      <h1 className="mb-2 text-2xl">
        Join us
      </h1>

      <h3 className="mb-5 text-sm text-fog">
        Sign up to create your account
      </h3>

      <form onSubmit={handleSubmit}>

        {/* Username */}

        <label
          htmlFor="username"
          className="mb-2 block text-sm text-fog"
        >
          User name
        </label>

        <input
          id="username"
          name="username"
          type="text"
          required
          className="mb-3 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 outline-none focus:border-signal"
        />

        {/* Email */}

        <label
          htmlFor="email"
          className="mb-2 block text-sm text-fog"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mb-3 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 outline-none focus:border-signal"
        />

        {/* Password */}

        <label
          htmlFor="password"
          className="mb-2 block text-sm text-fog"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••••••"
          className="mb-3 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 outline-none focus:border-signal"
        />

        {/* Confirm password */}

        <label
          htmlFor="confirm_password"
          className="mb-2 block text-sm text-fog"
        >
          Confirm password
        </label>

        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          placeholder="••••••••••••"
          className="mb-3 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 outline-none focus:border-signal"
        />

        {/* Submit */}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-shard px-3.5 py-2.5 font-medium text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Creating account..."
            : "Sign up"}
        </button>

      </form>
    </div>
  );
}