"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { CVUpload } from "@/components/onboarding/CVUpload";
import { PersonalityQuestions } from "@/components/onboarding/PersonalityQuestions";
import { InterestsForm } from "@/components/onboarding/InterestsForm";
import { createClient } from "@/lib/supabase";
import { CVData, OnboardingStep, PersonalityAnswers } from "@/types";

const STEPS: OnboardingStep[] = ["cv", "personality", "interests", "processing"];
const STEP_LABELS = ["Upload CV", "Quick Questions", "Interests", "Generating Profile"];

const PROCESSING_MESSAGES = [
  "Analysing your skills and experience...",
  "Mapping your personality profile...",
  "Searching Hong Kong opportunities...",
  "Calculating your best matches...",
  "Almost there...",
];

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("cv");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [personalityAnswers, setPersonalityAnswers] = useState<PersonalityAnswers | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [processingMsgIndex, setProcessingMsgIndex] = useState(0);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (data.session?.user) {
          setUserId(data.session.user.id);
        } else {
          router.replace("/auth");
        }
      });
  }, [router]);

  // Cycle processing messages every second
  useEffect(() => {
    if (step !== "processing") return;
    const interval = setInterval(() => {
      setProcessingMsgIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [step]);

  // Auto-redirect after processing animation
  useEffect(() => {
    if (step !== "processing") return;
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [step, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Progress header */}
        {step !== "processing" && (
          <div className="mb-10">
            <p className="text-blue-400 text-sm font-medium mb-2">
              Step {stepIndex + 1} of {STEPS.length} — {STEP_LABELS[stepIndex]}
            </p>
            <Progress value={progress} className="h-2 bg-slate-800" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "cv" && (
            <motion.div
              key="cv"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <CVUpload
                onComplete={(data) => {
                  setCvData(data);
                  setStep("personality");
                }}
              />
            </motion.div>
          )}

          {step === "personality" && (
            <motion.div
              key="personality"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <PersonalityQuestions
                onComplete={(answers) => {
                  setPersonalityAnswers(answers);
                  setStep("interests");
                }}
              />
            </motion.div>
          )}

          {step === "interests" && cvData && personalityAnswers && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <InterestsForm
                cvData={cvData}
                answers={personalityAnswers}
                userId={userId}
                onComplete={() => setStep("processing")}
              />
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-10 py-16"
            >
              {/* Pulsing orb */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-blue-500/30 animate-ping [animation-delay:0.2s]" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl">
                    ✦
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Building Your Profile</h2>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={processingMsgIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-slate-400"
                  >
                    {PROCESSING_MESSAGES[processingMsgIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress bar animation */}
              <div className="w-64 mx-auto h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
