"use client";

// TODO (Phase 4 - Team Task): Implement the full Opportunities page
// Features: Ranked list, filters (industry, type, location, paid/unpaid), expandable cards with fit scores
// See PRD Section 4.3 and Task 4.3 in README.md

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { OpportunityType, Industry, HKLocation } from "@/types";

const TYPES: OpportunityType[] = ["internship", "graduate_program", "fellowship", "volunteer", "full_time"];
const INDUSTRIES: Industry[] = ["technology", "finance", "consulting", "social_impact", "government", "creative"];
const LOCATIONS: HKLocation[] = ["hk_island", "kowloon", "new_territories", "remote", "hybrid"];

export default function OpportunitiesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<OpportunityType | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<HKLocation | null>(null);
  const [paidOnly, setPaidOnly] = useState(false);

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

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Hong Kong Opportunities</h1>
        <p className="text-slate-400 mb-8">
          Ranked by AI-computed fit score based on your profile
        </p>

        {/* Filters */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-300">Filters</h3>

          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Type</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Badge
                  key={t}
                  onClick={() => setSelectedType(selectedType === t ? null : t)}
                  className={`cursor-pointer capitalize ${
                    selectedType === t
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {t.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Industry</p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((i) => (
                <Badge
                  key={i}
                  onClick={() => setSelectedIndustry(selectedIndustry === i ? null : i)}
                  className={`cursor-pointer capitalize ${
                    selectedIndustry === i
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {i.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Location</p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <Badge
                  key={l}
                  onClick={() => setSelectedLocation(selectedLocation === l ? null : l)}
                  className={`cursor-pointer capitalize ${
                    selectedLocation === l
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {l.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaidOnly(!paidOnly)}
            className={paidOnly ? "border-blue-500 text-blue-300" : "border-slate-700 text-slate-400"}
          >
            {paidOnly ? "✓ Paid Only" : "Paid Only"}
          </Button>
        </div>

        {/* TODO: Load real recommendations from Supabase and render expandable OpportunityCard components */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 text-sm">Opportunity {i} placeholder</p>
                <p className="text-slate-600 text-xs mt-1">Organisation · Type · Location</p>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                {90 - i * 5}% fit
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
