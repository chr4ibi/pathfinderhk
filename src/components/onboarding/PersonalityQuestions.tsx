"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PERSONALITY_QUESTIONS } from "@/lib/personality-questions";
import { PersonalityAnswers } from "@/types";

interface PersonalityQuestionsProps {
  onComplete: (answers: PersonalityAnswers) => void;
  onBack: () => void;
}

export function PersonalityQuestions({ onComplete, onBack }: PersonalityQuestionsProps) {
  const [answers, setAnswers] = useState<PersonalityAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = PERSONALITY_QUESTIONS[currentIndex];
  const isLast = currentIndex === PERSONALITY_QUESTIONS.length - 1;
  const selected = answers[current.id];
  const allAnswered = PERSONALITY_QUESTIONS.every((q) => answers[q.id]);

  function select(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function handleNext() {
    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-slate-400 text-sm mb-2">
          Question {currentIndex + 1} of {PERSONALITY_QUESTIONS.length}
        </p>
        <h3 className="text-xl font-semibold text-white">{current.question}</h3>
      </div>

      <div className="grid gap-3">
        {current.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => select(opt.value)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition-colors ${
              selected === opt.value
                ? "border-blue-500 bg-blue-500/10 text-white"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-between">
        <Button
          variant="outline"
          onClick={currentIndex === 0 ? onBack : () => setCurrentIndex((i) => i - 1)}
        >
          Back
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          disabled={!selected || (isLast && !allAnswered)}
          onClick={handleNext}
        >
          {isLast ? "Continue →" : "Next →"}
        </Button>
      </div>
    </div>
  );
}
