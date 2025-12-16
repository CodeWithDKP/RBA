"use client";

import { useState } from "react";

export default function CreateSchool() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    createdById: "", // super admin id (temporary manual)
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/superadmin/createschool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data);
    } else {
      setMessage("School account created ");
      setForm({ name: "", email: "", password: "", createdById: "" });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md text-black"
      >
        <h1 className="text-xl font-bold mb-4">Create School</h1>

        <input
          name="name"
          placeholder="School Name"
          onChange={handleChange}
          value={form.name}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="email"
          placeholder="School Email"
          onChange={handleChange}
          value={form.email}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="password"
          placeholder="Temporary Password"
          type="password"
          onChange={handleChange}
          value={form.password}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="createdById"
          placeholder="Super Admin ID"
          onChange={handleChange}
          value={form.createdById}
          className="w-full border p-2 mb-3 rounded"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Create School
        </button>

        {message && (
          <p className="text-center mt-3 text-green-600 text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
