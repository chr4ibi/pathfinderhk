"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CVUploadProps {
  onFileUpload: (file: File | null) => void;
  currentFile: File | null;
  onNext: () => void;
}

export function CVUpload({ onFileUpload, currentFile, onNext }: CVUploadProps) {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
        setIsSuccess(true);
        // Reset success animation state after a brief delay
        setTimeout(() => setIsSuccess(false), 2000);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileUpload(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] py-12 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-8 text-center"
      >
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Upload your CV
          </h2>
          <p className="text-muted-foreground text-lg">
            We'll use this to match you with the best opportunities.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {currentFile ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-card border-2 border-[#0066CC] rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center space-y-4"
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[#00C4B4]"
                  >
                    <CheckCircle className="w-16 h-16" />
                  </motion.div>
                ) : (
                  <FileText className="w-16 h-16 text-[#0066CC]" />
                )}
                
                <div className="text-center">
                  <p className="font-semibold text-lg line-clamp-1">{currentFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive rounded-2xl"
                >
                  <X className="w-5 h-5" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                {...getRootProps()}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center space-y-4
                  ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
                  ${isDragActive && !isDragReject ? 'border-[#00C4B4] bg-[#00C4B4]/5' : ''}
                  ${!isDragActive && !isDragReject ? 'border-border hover:border-[#0066CC] hover:bg-accent/50' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className={`p-4 rounded-full ${isDragActive ? 'bg-[#00C4B4]/10 text-[#00C4B4]' : 'bg-primary/10 text-[#0066CC]'}`}>
                  <UploadCloud className="w-10 h-10" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xl font-medium">
                    {isDragActive ? "Drop your CV here" : "Click or drag to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-8">
          <Button
            onClick={onNext}
            disabled={!currentFile}
            size="lg"
            className="rounded-2xl px-8 py-6 text-lg font-medium bg-[#0066CC] hover:bg-[#0066CC]/90 text-white min-w-[200px]"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
