import React from "react";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Travel</h1>
      <ul className="list-disc pl-6">
        <li><a className="text-blue-600 underline" href="/search/flights">Search Flights</a></li>
        <li><a className="text-blue-600 underline" href="/login">Login</a></li>
      </ul>
    </main>
  );
}
