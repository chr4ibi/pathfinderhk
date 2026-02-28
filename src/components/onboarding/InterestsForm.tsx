"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CVData, PersonalityTraits, Interests } from "@/types";

interface InterestsFormProps {
  cvData: CVData;
  personalityTraits: PersonalityTraits;
  userId: string;
  onComplete: () => void;
}

export function InterestsForm({
  cvData,
  personalityTraits,
  userId,
  onComplete,
}: InterestsFormProps) {
  const [interests, setInterests] = useState<Interests>({
    favourite_book: "",
    favourite_movie: "",
    other: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (interestsToSubmit: Interests) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cvData,
          personalityTraits,
          interests: interestsToSubmit,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate profile");
      onComplete();
    } catch {
      setError("Failed to generate profile. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Tell Us About You</h2>
        <p className="text-slate-400">
          Share a few things that inspire you — all fields are optional.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 space-y-5 text-left">
        <div className="space-y-2">
          <label htmlFor="book" className="block text-sm font-medium text-slate-300">
            Favourite Book
          </label>
          <Input
            id="book"
            placeholder="e.g. Shoe Dog, The Almanack of Naval Ravikant"
            value={interests.favourite_book ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInterests((prev) => ({ ...prev, favourite_book: e.target.value }))
            }
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="movie" className="block text-sm font-medium text-slate-300">
            Favourite Movie / Show
          </label>
          <Input
            id="movie"
            placeholder="e.g. The Social Network, Succession"
            value={interests.favourite_movie ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInterests((prev) => ({ ...prev, favourite_movie: e.target.value }))
            }
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="other" className="block text-sm font-medium text-slate-300">
            Anything else?
          </label>
          <textarea
            id="other"
            placeholder="Awards, side projects, essays, anything that defines you..."
            value={interests.other ?? ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInterests((prev) => ({ ...prev, other: e.target.value }))
            }
            rows={4}
            className="w-full rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none px-3 py-2 text-sm resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          disabled={submitting}
          onClick={() => handleSubmit({})}
        >
          Skip
        </Button>
        <Button
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          disabled={submitting}
          onClick={() => handleSubmit(interests)}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate My Profile →"
          )}
        </Button>
      </div>
    </div>
  );
}
