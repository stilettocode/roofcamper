"use client";

import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-purple-600">
        Tailwind is working!
      </h1>
      <main>
      <AuthButton />
      {/* other homepage content */}
    </main>
    </div>
  );
}