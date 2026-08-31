"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "signin" | "signup";


export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 inline-flex rounded-lg border border-line bg-panel p-1 text-sm">
            <button
              onClick={() => setMode("signin")}
              className={
                "rounded-md px-4 py-1.5 transition-colors " +
                (mode === "signin" ? "bg-panel-raised text-paper" : "text-fog hover:text-paper")
              }
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={
                "rounded-md px-4 py-1.5 transition-colors " +
                (mode === "signup" ? "bg-panel-raised text-paper" : "text-fog hover:text-paper")
              }
            >
              Create account
            </button>
          </div>

            {mode === "signin" ? <SigninCard /> : <SignupCard />}
        </div>
        </div>
      <div className="hidden border-l border-line bg-panel/40 md:block " />
    </div>
  );
}


function SigninCard(){
    const router = useRouter();
    const [submitting,setSubmitting] = useState(false);

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const identifier = (form.elements.namedItem("identifier") as HTMLFormElement).value;
        const password = (form.elements.namedItem("password") as HTMLFormElement).value;
        const user = fetchUser(identifier,password);
        console.log(user);
        setSubmitting(true);
        router.replace("/dashboard");
    }

    async function fetchUser(identifier : string, password: string) {
        const user = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password })
        });

        console.log(user);
    }

    return (
        <div>
            <h1 className="text-2xl mb-2">Welcome back</h1>
            <h3 className="text-sm mb-5 text-fog">Sign in to reach dashboard</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="mb-2 block text-sm text-fog">
                    Username / Email
                </label>
                <input
                    id="identifier"
                    type="text"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-line bg-panel mb-3 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-signal"
                /> 

                

                <label htmlFor="password" className="mb-2 block text-sm text-fog">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-md border border-line bg-panel mb-3 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-signal"
                />  

                <button type="submit" disabled={submitting} className="w-full bg-shard py-2.5 px-3.5 rounded-sm text-ink font-medium">{submitting?"Signing in...":"Sign in"}</button>          
            </form>
        </div>
    );
}


function SignupCard(){

    const router = useRouter();
    const [submitting,setSubmitting] = useState(false);

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const username = (form.elements.namedItem("username") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirm = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;
        if(password!==confirm){
            alert("Passwords don't match");
            return;
        }
        fetchRequest(username , email , password );
        setSubmitting(true);
        
        router.replace("/dashboard");
    }

    
    async function fetchRequest(username: string, email: string, password: string) {
        const user = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        console.log(user);
    }

    return (
        <div>
            <h1 className="text-2xl mb-2">Join us</h1>
            <h3 className="text-sm mb-5 text-fog">Sign up to create your account</h3>
            <form onSubmit={handleSubmit}>

                <label htmlFor="username" className="mb-2 block text-sm text-fog">
                    User name
                </label>
                <input
                    id="username"
                    type="text"
                    required
                    className="w-full rounded-md border border-line bg-panel mb-3 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-signal"
                />
                <label htmlFor="email" className="mb-2 block text-sm text-fog">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-line bg-panel mb-3 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-signal"
                /> 


                <label htmlFor="password" className="mb-2 block text-sm text-fog">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-md border border-line bg-panel mb-3 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-signal"
                />  

                <label htmlFor="confirm_password" className="mb-2 block text-sm text-fog">
                    Confirm password
                </label>
                <input
                    id="confirm_password"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-md border border-line bg-panel mb-3 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-signal"
                /> 
                <button type="submit" disabled={submitting} className="w-full bg-shard py-2.5 px-3.5 rounded-sm text-ink font-medium">{submitting?"Creating account...":"Sign up"}</button>          
            </form>
        </div>
    );
}