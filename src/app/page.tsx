import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm px-4 py-1">
          HackTheEast 2026 · AI Career Platform
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Discover Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Career Path
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed">
          PathfinderHK transforms your CV, interests, and personality into a
          personalized roadmap of Hong Kong&apos;s best opportunities — with
          AI-powered fit scores and actionable career advice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/onboard">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-xl"
            >
              Discover Your Path →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
            >
              View Demo Dashboard
            </Button>
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          {[
            {
              icon: "🎯",
              title: "Smart Matching",
              desc: "Semantic AI matches you to HK opportunities based on deep profile analysis, not just keywords",
            },
            {
              icon: "📊",
              title: "Identity Dashboard",
              desc: "Visual skill radar, strength cards, and career cluster heatmap — understand yourself at a glance",
            },
            {
              icon: "🎙️",
              title: "Audio Career Briefing",
              desc: "Get a personalized 60-second audio summary of your profile and top matches via MiniMax TTS",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left backdrop-blur-sm"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
