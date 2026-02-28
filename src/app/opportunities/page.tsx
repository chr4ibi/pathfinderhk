"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { OpportunityType, Industry, HKLocation, Recommendation, Opportunity } from "@/types";

const TYPES: OpportunityType[] = ["internship", "graduate_program", "fellowship", "volunteer", "full_time"];
const INDUSTRIES: Industry[] = ["technology", "finance", "consulting", "social_impact", "government", "creative"];
const LOCATIONS: HKLocation[] = ["hk_island", "kowloon", "new_territories", "remote", "hybrid"];

type RecommendationWithOpp = Recommendation & { opportunity: Opportunity };

function fitColor(score: number) {
  if (score >= 80) return "bg-green-500/20 text-green-300 border-green-500/30";
  if (score >= 60) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [allRecs, setAllRecs] = useState<RecommendationWithOpp[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [selectedType, setSelectedType] = useState<OpportunityType | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<HKLocation | null>(null);
  const [paidOnly, setPaidOnly] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const uid = sessionStorage.getItem("pfhk_session_id");
    if (!uid) {
      router.replace("/onboard");
      return;
    }
    setUserId(uid);

    (async () => {
      let { data: recs } = await supabase
        .from("recommendations")
        .select("*, opportunity:opportunities(*)")
        .eq("user_id", uid)
        .order("fit_score", { ascending: false })
        .limit(50);

      if (!recs || recs.length === 0) {
        setLoading(false);
        setMatching(true);
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: uid }),
        });
        const json = await res.json();
        recs = json.recommendations ?? [];
        setMatching(false);
      }

      setAllRecs((recs ?? []) as RecommendationWithOpp[]);
      setLoading(false);
    })();
  }, [router]);

  const filtered = allRecs
    .filter((r) => !selectedType || r.opportunity.type === selectedType)
    .filter((r) => !selectedIndustry || r.opportunity.industry === selectedIndustry)
    .filter((r) => !selectedLocation || r.opportunity.location === selectedLocation)
    .filter((r) => !paidOnly || r.opportunity.is_paid)
    .slice(0, 10);

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (matching) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Finding your best matches…</p>
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

        {/* Opportunity Cards */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center text-slate-500">
              No opportunities match your filters.
            </div>
          )}
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-lg">{rec.opportunity.title}</h3>
                    <Badge className={`text-xs border ${fitColor(rec.fit_score)}`}>
                      {rec.fit_score}% fit
                    </Badge>
                    {rec.opportunity.is_paid && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-0.5">{rec.opportunity.org}</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <Badge className="bg-slate-800 text-slate-300 text-xs capitalize">
                      {rec.opportunity.type.replace("_", " ")}
                    </Badge>
                    <Badge className="bg-slate-800 text-slate-300 text-xs capitalize">
                      {rec.opportunity.industry.replace("_", " ")}
                    </Badge>
                    <Badge className="bg-slate-800 text-slate-300 text-xs capitalize">
                      {rec.opportunity.location.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mt-3">{rec.fit_explanation}</p>
                  {rec.gaps && (
                    <p className="text-slate-500 text-xs mt-2">Gaps: {rec.gaps}</p>
                  )}
                  {rec.actions && rec.actions.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {rec.actions.map((action, i) => (
                        <li key={i} className="text-blue-400 text-xs flex items-start gap-1.5">
                          <span className="shrink-0 mt-0.5">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {rec.opportunity.url && (
                  <a
                    href={rec.opportunity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg px-3 py-1.5 hover:bg-blue-500/30 transition-colors"
                  >
                    Apply
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
