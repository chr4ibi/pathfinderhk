"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PersonalityQuestions } from "@/components/onboarding/PersonalityQuestions";
import { InterestsForm } from "@/components/onboarding/InterestsForm";
import { CVData, OnboardingStep, PersonalityAnswers } from "@/types";

const STEPS: OnboardingStep[] = ["cv", "personality", "interests", "processing"];
const STEP_LABELS = ["Upload CV", "Quick Questions", "Interests", "Generating Profile"];

// Placeholder user ID — replace with real auth when Supabase Auth is wired up
const PLACEHOLDER_USER_ID = "00000000-0000-0000-0000-000000000001";

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("cv");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [personalityAnswers, setPersonalityAnswers] = useState<PersonalityAnswers | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-blue-400 text-sm font-medium mb-2">
            Step {stepIndex + 1} of {STEPS.length} — {STEP_LABELS[stepIndex]}
          </p>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>

        {/* Step: CV Upload */}
        {step === "cv" && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Upload Your CV</h2>
            <p className="text-slate-400">
              Upload your CV (PDF or DOCX) and our AI will extract your skills,
              education, and experience.
            </p>
            {/* TODO: Replace with CVUpload component using react-dropzone */}
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-slate-500">
              Drop your CV here or click to browse
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                // TODO: Remove stub once CVUpload is implemented
                setCvData({
                  name: "Demo User",
                  education: [],
                  skills: [],
                  experience: [],
                  languages: [],
                  certifications: [],
                });
                setStep("personality");
              }}
            >
              Continue →
            </Button>
          </div>
        )}

        {/* Step: Personality Questions */}
        {step === "personality" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Quick Questions</h2>
              <p className="text-slate-400 mt-2">
                Answer a few questions so we can understand how you think and work.
              </p>
            </div>
            <PersonalityQuestions
              onComplete={(answers) => {
                setPersonalityAnswers(answers);
                setStep("interests");
              }}
              onBack={() => setStep("cv")}
            />
          </div>
        )}

        {/* Step: Interests */}
        {step === "interests" && cvData && personalityAnswers && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Tell Us About You</h2>
              <p className="text-slate-400 mt-2">
                Share a few things that inspire you — favourite book, movie, or side projects.
              </p>
            </div>
            <InterestsForm
              cvData={cvData}
              answers={personalityAnswers}
              userId={PLACEHOLDER_USER_ID}
              onComplete={() => setStep("processing")}
              onBack={() => setStep("personality")}
            />
          </div>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Building Your Profile</h2>
            <p className="text-slate-400">
              Our AI is analysing your profile and finding your best matches...
            </p>
            <div className="h-32 flex items-center justify-center text-blue-400 text-xl animate-pulse">
              ✦ Generating your career profile...
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => router.push("/dashboard")}
            >
              View Dashboard →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
