"use client";

import { useEffect, useState } from "react";

type School = {
  id: string;
  name: string;
  email: string;
};

export default function SchoolDashboard() {
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    fetch("/api/school/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setSchool(data))
      .catch(() => setSchool(null));
  }, []);

  if (!school) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">
        Welcome, {school.name} 🎓
      </h1>

      <p className="text-gray-600 mt-2">
        Email: {school.email}
      </p>
    </div>
  );
}
