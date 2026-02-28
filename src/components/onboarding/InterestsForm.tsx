"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CVData, Interests, PersonalityAnswers } from "@/types";

interface InterestsFormProps {
  cvData: CVData;
  answers: PersonalityAnswers;
  userId: string;
  onComplete: () => void;
  onBack: () => void;
}

export function InterestsForm({ cvData, answers, userId, onComplete, onBack }: InterestsFormProps) {
  const [interests, setInterests] = useState<Interests>({
    favourite_book: "",
    favourite_movie: "",
    other: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cvData, answers, interests }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Profile generation failed");
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Favourite book</label>
          <input
            type="text"
            value={interests.favourite_book ?? ""}
            onChange={(e) => setInterests((prev) => ({ ...prev, favourite_book: e.target.value }))}
            placeholder="e.g. Sapiens by Yuval Noah Harari"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Favourite movie or show</label>
          <input
            type="text"
            value={interests.favourite_movie ?? ""}
            onChange={(e) => setInterests((prev) => ({ ...prev, favourite_movie: e.target.value }))}
            placeholder="e.g. The Social Network"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Side projects or passions (optional)</label>
          <textarea
            value={interests.other ?? ""}
            onChange={(e) => setInterests((prev) => ({ ...prev, other: e.target.value }))}
            placeholder="Anything that inspires you — hobbies, side projects, causes you care about..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Generating Profile…" : "Generate My Profile →"}
        </Button>
      </div>
    </div>
  );
}
