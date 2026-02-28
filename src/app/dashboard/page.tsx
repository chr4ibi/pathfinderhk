"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Profile, Recommendation } from "@/types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

type RecommendationWithOpp = Recommendation & { opportunity: import("@/types").Opportunity };

function fitColor(score: number) {
  if (score >= 80) return "bg-green-500/20 text-green-300 border-green-500/30";
  if (score >= 60) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationWithOpp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const uid = sessionStorage.getItem("pfhk_session_id");
    if (!uid) {
      router.replace("/onboard");
      return;
    }

    (async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", uid)
        .single();

      if (!profileData) {
        router.replace("/onboard");
        return;
      }

      setProfile(profileData as Profile);

      let { data: recs } = await supabase
        .from("recommendations")
        .select("*, opportunity:opportunities(*)")
        .eq("user_id", uid)
        .order("fit_score", { ascending: false })
        .limit(5);

      if (!recs || recs.length === 0) {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: uid }),
        });
        const json = await res.json();
        recs = json.recommendations?.slice(0, 5) ?? [];
      }

      setRecommendations((recs ?? []) as RecommendationWithOpp[]);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const { rich_profile: rp, insights } = profile;

  const radarData = insights
    ? [
        { subject: "Technical", value: insights.skill_dimensions.technical },
        { subject: "Communication", value: insights.skill_dimensions.communication },
        { subject: "Leadership", value: insights.skill_dimensions.leadership },
        { subject: "Creativity", value: insights.skill_dimensions.creativity },
        { subject: "Analytical", value: insights.skill_dimensions.analytical },
        { subject: "Domain", value: insights.skill_dimensions.domain_expertise },
        { subject: "Collaboration", value: insights.skill_dimensions.collaboration },
        { subject: "Adaptability", value: insights.skill_dimensions.adaptability },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Your Career Profile</h1>
          {rp && (
            <p className="text-slate-300 mt-2 max-w-3xl">{rp.summary}</p>
          )}
        </div>

        {/* Radar + Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Skill Radar</h2>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Radar
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.25}
                    dot={false}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-600">
                No skill data yet
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Your Strengths</h2>
            <div className="space-y-3">
              {insights?.strengths.map((s) => (
                <div
                  key={s.title}
                  className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
                >
                  <p className="font-medium text-green-300">{s.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{s.description}</p>
                </div>
              ))}
              {insights?.growth_areas.map((g) => (
                <div
                  key={g.title}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
                >
                  <p className="font-medium text-amber-300">{g.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{g.description}</p>
                </div>
              ))}
              {!insights && (
                <p className="text-slate-600">No insights available yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Career Clusters */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Career Cluster Alignment</h2>
          {insights && insights.career_clusters.length > 0 ? (
            <div className="space-y-3">
              {insights.career_clusters
                .sort((a, b) => b.score - a.score)
                .map((cluster) => (
                  <div key={cluster.name} className="flex items-center gap-4">
                    <span className="text-slate-300 w-36 text-sm capitalize shrink-0">
                      {cluster.name}
                    </span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${cluster.score}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm w-10 text-right shrink-0">
                      {cluster.score}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-slate-600">No career cluster data yet</p>
          )}
        </div>

        {/* Top Matches */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Matches</h2>
            <a
              href="/opportunities"
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recommendations.length === 0 && (
              <p className="text-slate-600">No recommendations yet</p>
            )}
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{rec.opportunity.title}</h3>
                      <Badge className={`text-xs border ${fitColor(rec.fit_score)}`}>
                        {rec.fit_score}% fit
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{rec.opportunity.org}</p>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Badge className="bg-slate-700 text-slate-300 text-xs capitalize">
                        {rec.opportunity.type.replace("_", " ")}
                      </Badge>
                      <Badge className="bg-slate-700 text-slate-300 text-xs capitalize">
                        {rec.opportunity.industry.replace("_", " ")}
                      </Badge>
                      <Badge className="bg-slate-700 text-slate-300 text-xs capitalize">
                        {rec.opportunity.location.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mt-3">{rec.fit_explanation}</p>
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
    </div>
  );
}
