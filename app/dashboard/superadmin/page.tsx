"use client";

import { useEffect, useState } from "react";

type SuperAdmin = {
  id: string;
  name: string;
  email: string;
};

export default function SuperAdminDashboard() {
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);

  useEffect(() => {
    fetch("/api/superadmin/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAdmin(data))
      .catch(() => setAdmin(null));
  }, []);

  if (!admin) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">
        Welcome, {admin.name} 👋
      </h1>

      <p className="text-gray-600 mt-2">
        Email: {admin.email}
      </p>
    </div>
  );
}
