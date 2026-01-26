import React from "react";

export default function StreakGlassUI() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/40 blur-3xl" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-orange-500/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      {/* Phone frame */}
      <div className="relative w-full max-w-[420px] rounded-[38px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold">
              Hey Bhanu! <span className="inline-block">👋</span>
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Keep the momentum going! <span>🔥</span>
            </p>
          </div>

          <button className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
            👤
          </button>
        </div>

        {/* Main Card */}
        <div className="mt-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              💻
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">Trading</p>
              <p className="text-white/60 text-sm">1 / 21 days</p>
            </div>
          </div>

          {/* Streak */}
          <div className="mt-4 text-center">
            <div className="text-white text-5xl font-bold leading-none">
              1 <span className="text-4xl">🔥</span>
            </div>
            <div className="text-white/80 text-sm mt-1">Day Streak</div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Progress</span>
              <span className="text-orange-300 font-medium">5%</span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[5%] rounded-full bg-gradient-to-r from-orange-400 to-pink-400" />
            </div>
          </div>

          {/* Calendar */}
          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button className="text-white/60 hover:text-white transition">
                ‹
              </button>
              <p className="text-white/80 font-medium">April 2026</p>
              <button className="text-white/60 hover:text-white transition">
                ›
              </button>
            </div>

            {/* Week header */}
            <div className="mt-3 grid grid-cols-7 gap-2 text-[11px] text-white/50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="mt-2 grid grid-cols-7 gap-2">
              {days.map((day) => {
                const isActive = day === 18; // highlighted day
                const isMuted = day === 1 || day === 2 || day === 3;

                return (
                  <div
                    key={day}
                    className={[
                      "aspect-square rounded-xl flex items-center justify-center text-sm select-none",
                      "border border-white/10",
                      isActive
                        ? "bg-green-400/30 text-white shadow-md shadow-green-400/20"
                        : "bg-white/5 text-white/70",
                      isMuted ? "opacity-60" : "opacity-100",
                    ].join(" ")}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/90 font-semibold">
              <span className="text-white/70">⚙️</span>
              <span>Milestones</span>
            </div>

            <button className="text-white/60 text-sm hover:text-white transition">
              Hide
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MilestoneCard
              icon="🔥"
              title="Week Warrior"
              subtitle="7 days"
              active
            />
            <MilestoneCard icon="🏆" title="Two Week..." subtitle="14 days" />
            <MilestoneCard icon="🏅" title="Habit Former" subtitle="21 days" />
            <MilestoneCard
              icon="⚪"
              title="Quarter Legend"
              subtitle="62 days"
              muted
            />
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-4 text-center text-xs text-white/40">
          Hidden zone in settings
        </div>

        {/* Bottom label */}
        <div className="mt-4 text-center text-white/70 text-sm">
          ✅ iOS Glassmorphism <span className="text-white/50">(Premium + Modern)</span>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ icon, title, subtitle, active, muted }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl",
        "flex items-center gap-3",
        active ? "ring-1 ring-orange-400/40" : "",
        muted ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-lg">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-white/90 font-semibold text-sm truncate">
          {title}
        </div>
        <div className="text-white/60 text-xs">{subtitle}</div>
      </div>
    </div>
  );
}
