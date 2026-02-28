"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onboardingQuestions } from "@/lib/onboarding-questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface PersonalityQuestionsProps {
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PersonalityQuestions({
  answers,
  onAnswersChange,
  onNext,
  onPrev,
}: PersonalityQuestionsProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const question = onboardingQuestions[currentIndex];
  const isLastQuestion = currentIndex === onboardingQuestions.length - 1;
  const progress = ((currentIndex + 1) / onboardingQuestions.length) * 100;

  const handleOptionSelect = (value: string) => {
    onAnswersChange({
      ...answers,
      [question.id]: value,
    });
    
    // Automatically advance to next question after a brief delay
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 400);
    } else {
      setTimeout(() => {
        onNext();
      }, 400);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onNext();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      onPrev();
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full min-h-[400px] p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 text-sm font-medium text-muted-foreground">
          <span>Step 2 of 4</span>
          <span>Question {currentIndex + 1} of {onboardingQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2 rounded-2xl [&>div]:bg-[#0066CC]" />
      </div>

      <div className="flex-grow flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              {question.title}
            </h2>

            <div className="grid gap-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
                      flex items-center justify-between
                      ${isSelected 
                        ? 'border-[#0066CC] bg-[#0066CC]/5 text-[#0066CC]' 
                        : 'border-border hover:border-[#00C4B4] hover:bg-accent'
                      }
                    `}
                  >
                    <span className="font-medium text-lg">{option.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-[#0066CC] text-white p-1 rounded-full"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8 pt-4 border-t">
        <Button
          variant="ghost"
          onClick={handlePrev}
          className="rounded-2xl gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!answers[question.id]}
          className="rounded-2xl gap-2 bg-[#0066CC] hover:bg-[#0066CC]/90 text-white"
        >
          {isLastQuestion ? "Continue" : "Next"}
          {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
