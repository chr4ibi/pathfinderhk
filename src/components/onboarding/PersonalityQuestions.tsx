"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PERSONALITY_QUESTIONS } from "@/lib/personality-questions";
import { PersonalityAnswers } from "@/types";

interface PersonalityQuestionsProps {
  onComplete: (answers: PersonalityAnswers) => void;
}

export function PersonalityQuestions({ onComplete }: PersonalityQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PersonalityAnswers>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  const question = PERSONALITY_QUESTIONS[currentIndex];
  const isLast = currentIndex === PERSONALITY_QUESTIONS.length - 1;
  const selectedAnswer = answers[question.id];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const goNext = () => {
    if (!selectedAnswer) return;
    if (!isLast) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
      return;
    }
    onComplete(answers);
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Quick Questions</h2>
        <p className="text-slate-400">
          Answer a few questions so we can understand how you think and work.
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {PERSONALITY_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 bg-blue-400"
                : i < currentIndex
                ? "w-2 bg-blue-700"
                : "w-2 bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-slate-900 rounded-2xl p-8 space-y-6"
          >
            <p className="text-lg font-semibold text-center leading-relaxed">
              {question.question}
            </p>

            <div className="space-y-3">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 text-sm ${
                    selectedAnswer === opt.value
                      ? "border-blue-400 bg-blue-950/40 text-white"
                      : "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={goNext}
          disabled={!selectedAnswer}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-40"
        >
          {isLast ? "Finish →" : "Next →"}
        </Button>
      </div>
    </div>
  );
}
