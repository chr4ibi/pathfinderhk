"use client";

// TODO (Phase 2 - Team Task): Implement the full onboarding wizard
// Steps: CV Upload → Personality Questions → Interests → Processing
// See PRD Section 4.1 and Task 2.1-2.3 in README.md

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingStep } from "@/types";

const STEPS: OnboardingStep[] = ["cv", "personality", "interests", "processing"];
const STEP_LABELS = ["Upload CV", "Quick Questions", "Interests", "Generating Profile"];

export default function OnboardPage() {
  const [step, setStep] = useState<OnboardingStep>("cv");
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

        {/* Step content */}
        {step === "cv" && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Upload Your CV</h2>
            <p className="text-slate-400">
              Upload your CV (PDF or DOCX) and our AI will extract your skills,
              education, and experience.
            </p>
            {/* TODO: Implement CVUpload component using react-dropzone */}
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-slate-500">
              Drop your CV here or click to browse
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setStep("personality")}
            >
              Continue →
            </Button>
          </div>
        )}

        {step === "personality" && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Quick Questions</h2>
            <p className="text-slate-400">
              Answer a few questions so we can understand how you think and work.
            </p>
            {/* TODO: Implement PersonalityQuestions component */}
            <div className="bg-slate-900 rounded-2xl p-8 text-slate-500">
              Personality question component goes here
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStep("cv")}>
                Back
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setStep("interests")}
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {step === "interests" && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Tell Us About You</h2>
            <p className="text-slate-400">
              Share a few things that inspire you — favourite book, movie, or side projects.
            </p>
            {/* TODO: Implement InterestsForm component */}
            <div className="bg-slate-900 rounded-2xl p-8 text-slate-500">
              Interests form component goes here
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStep("personality")}>
                Back
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setStep("processing")}
              >
                Generate My Profile →
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Building Your Profile</h2>
            <p className="text-slate-400">
              Our AI is analysing your profile and finding your best matches...
            </p>
            {/* TODO: Implement animated processing screen */}
            <div className="h-32 flex items-center justify-center text-blue-400 text-xl animate-pulse">
              ✦ Generating your career profile...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
