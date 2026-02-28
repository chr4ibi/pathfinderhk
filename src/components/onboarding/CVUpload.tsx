"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CVData } from "@/types";

interface CVUploadProps {
  onComplete: (cvData: CVData) => void;
}

export function CVUpload({ onComplete }: CVUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "parsed" | "error">("idle");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to parse CV");

      const data: CVData = await res.json();
      setCvData(data);
      setStatus("parsed");
    } catch {
      setStatus("error");
      setErrorMsg("Could not parse your CV. Please try a different file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: status === "uploading",
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Upload Your CV</h2>
        <p className="text-slate-400">
          Upload your CV (PDF or DOCX) and our AI will extract your skills,
          education, and experience.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status !== "parsed" && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-950/30"
                  : "border-slate-700 hover:border-slate-500"
              } ${status === "uploading" ? "pointer-events-none opacity-60" : ""}`}
            >
              <input {...getInputProps()} />

              {status === "uploading" ? (
                <div className="flex flex-col items-center gap-3 text-blue-400">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <p>Parsing your CV...</p>
                </div>
              ) : (
                <div className="text-slate-400 space-y-2">
                  <p className="text-4xl">📄</p>
                  <p className="font-medium">
                    {isDragActive ? "Drop it here" : "Drop your CV here or click to browse"}
                  </p>
                  <p className="text-sm text-slate-600">PDF or DOCX · max 10 MB</p>
                </div>
              )}
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm text-center mt-3">{errorMsg}</p>
            )}
          </motion.div>
        )}

        {status === "parsed" && cvData && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-2xl p-6 space-y-5 text-left"
          >
            {/* Name */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Name</p>
              <p className="text-lg font-semibold">{cvData.name}</p>
              {cvData.email && (
                <p className="text-sm text-slate-400">{cvData.email}</p>
              )}
            </div>

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(0, 12).map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {cvData.skills.length > 12 && (
                    <span className="text-slate-500 text-xs py-1">
                      +{cvData.skills.length - 12} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Education</p>
                <ul className="space-y-1">
                  {cvData.education.map((e, i) => (
                    <li key={i} className="text-sm text-slate-300">
                      {e.degree} in {e.field} — {e.institution}
                      {e.end_year ? ` (${e.end_year})` : " (ongoing)"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Experience</p>
                <ul className="space-y-1">
                  {cvData.experience.slice(0, 3).map((e, i) => (
                    <li key={i} className="text-sm text-slate-300">
                      {e.title} at {e.company}
                    </li>
                  ))}
                  {cvData.experience.length > 3 && (
                    <li className="text-slate-500 text-sm">
                      +{cvData.experience.length - 3} more roles
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setCvData(null);
                  setStatus("idle");
                }}
              >
                Re-upload
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                onClick={() => onComplete(cvData)}
              >
                Looks good →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
