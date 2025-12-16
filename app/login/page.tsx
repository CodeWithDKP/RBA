"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data);
      return;
    }


    /* ROLE-BASED REDIRECT */
    if (data.role === "SUPER_ADMIN") router.push("/dashboard/superadmin");
    if (data.role === "SCHOOL_ADMIN") router.push("/dashboard/school");
    if (data.role === "FACULTY") router.push("/dashboard/faculty");
    if (data.role === "PARENT") router.push("/dashboard/parent");

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 text-black">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-full max-w-md text-black"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
