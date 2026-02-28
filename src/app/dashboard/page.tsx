"use client";

// TODO (Phase 4 - Team Task): Implement the full Professional Identity Dashboard
// Components needed: SkillRadarChart, StrengthCards, CareerClusterHeatmap, OpportunityCards, AudioBriefingButton
// See PRD Section 4.2, 7.2, and Task 4.1-4.4 in README.md

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Your Career Profile</h1>
          <p className="text-slate-400 mt-2">
            AI-powered insights based on your CV, personality, and interests
          </p>
        </div>

        {/* Top section: Radar + Strength Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TODO: Implement SkillRadarChart with Recharts RadarChart */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Skill Radar</h2>
            <div className="h-64 flex items-center justify-center text-slate-600">
              Recharts RadarChart goes here
            </div>
          </div>

          {/* TODO: Implement StrengthSummaryCards */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Your Strengths</h2>
            <div className="space-y-3">
              {["Strength 1", "Strength 2", "Strength 3"].map((s) => (
                <div key={s} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-slate-400">
                  {s} card placeholder
                </div>
              ))}
              {["Growth Area 1", "Growth Area 2"].map((g) => (
                <div key={g} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-slate-400">
                  {g} card placeholder
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Career Clusters */}
        {/* TODO: Implement CareerClusterHeatmap */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Career Cluster Alignment</h2>
          <div className="h-24 flex items-center justify-center text-slate-600">
            Career cluster heatmap / bar chart goes here
          </div>
        </div>

        {/* Bottom: Top 5 Opportunities */}
        {/* TODO: Implement expandable OpportunityCards */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Matches</h2>
            {/* TODO: AudioBriefingButton */}
            <button className="flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg px-4 py-2 text-sm hover:bg-blue-500/30 transition-colors">
              ▶ Play Career Briefing
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 text-slate-400">
                Opportunity card {i} placeholder
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
