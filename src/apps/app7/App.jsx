import { useState, useEffect, useRef } from "react";

const FORM_SRC =
  "https://docs.google.com/forms/d/e/1FAIpQLSczg5mSqp9_ry1z6uRRiRsARYKT54hWFu4LgDG1t4r7c6GGvw/viewform?embedded=true";

/* ── tiny confetti ── */
function Confetti({ run }) {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    color: ["#6C63FF", "#FF6584", "#43D9AD", "#FFD166", "#F77F00"][i % 5],
    size: 7 + Math.random() * 7,
    rot: Math.random() * 360,
  }));
  if (!run) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: "-20px",
          width: p.size, height: p.size, borderRadius: p.size / 3,
          background: p.color, transform: `rotate(${p.rot}deg)`,
          animation: `fall 2.4s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

/* ── step pill ── */
function StepPill({ n, label, active, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800,
        transition: "all .35s",
        background: done ? "#43D9AD" : active ? "#6C63FF" : "rgba(255,255,255,.18)",
        color: done || active ? "#fff" : "rgba(255,255,255,.5)",
        boxShadow: active ? "0 0 0 5px rgba(108,99,255,.35)" : "none",
      }}>
        {done ? "✓" : n}
      </div>
      <span style={{
        fontSize: 13, fontWeight: 700, letterSpacing: .3,
        color: done || active ? "#fff" : "rgba(255,255,255,.45)",
        transition: "color .35s",
      }}>{label}</span>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);   // 0=welcome  1=form  2=done
  const [confetti, setConfetti] = useState(false);
  const [pulse, setPulse] = useState(false);
  const iframeRef = useRef(null);

  /* after iframe loads stop skeleton */
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    if (confetti) setTimeout(() => setConfetti(false), 3200);
  }, [confetti]);

  /* pulsate the card on arrival */
  useEffect(() => {
    if (step === 1) { setPulse(true); setTimeout(() => setPulse(false), 700); }
  }, [step]);

  const handleDone = () => {
    setStep(2);
    setConfetti(true);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(155deg,#1a1040 0%,#0d1b4b 50%,#0a2540 100%)", fontFamily: "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflowX: "hidden" }}>
      <Confetti run={confetti} />

      {/* ─── HERO HEADER ─── */}
      <div style={{ padding: "52px 24px 28px", textAlign: "center", position: "relative" }}>
        {/* glow blob */}
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 260, height: 120, background: "radial-gradient(ellipse,rgba(108,99,255,.45) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ fontSize: 42, marginBottom: 10 }}>📋</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -.5 }}>
          Quick Response
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
          Fill the form below in just a few taps.
        </p>

        {/* step pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 24 }}>
          <StepPill n={1} label="Welcome" active={step === 0} done={step > 0} />
          <div style={{ width: 28, height: 2, background: "rgba(255,255,255,.18)", alignSelf: "center", borderRadius: 2 }} />
          <StepPill n={2} label="Fill Form" active={step === 1} done={step > 1} />
          <div style={{ width: 28, height: 2, background: "rgba(255,255,255,.18)", alignSelf: "center", borderRadius: 2 }} />
          <StepPill n={3} label="Done" active={step === 2} done={step === 2} />
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ padding: "0 16px 48px", maxWidth: 520, margin: "0 auto" }}>

        {/* ══ STEP 0 — WELCOME CARD ══ */}
        {step === 0 && (
          <div style={{ animation: "slideUp .5s cubic-bezier(.22,1,.36,1)" }}>
            {[
              { icon: "⚡", title: "Super Fast", sub: "Takes less than 2 minutes" },
              { icon: "🔒", title: "100% Secure", sub: "Your data is safe with Google" },
              { icon: "📱", title: "Mobile Friendly", sub: "Optimised for touch screens" },
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                background: "rgba(255,255,255,.06)", borderRadius: 18, marginBottom: 12,
                border: "1px solid rgba(255,255,255,.09)", backdropFilter: "blur(12px)",
                animation: `slideUp .5s ${i * .1 + .1}s cubic-bezier(.22,1,.36,1) both`,
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(108,99,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{f.sub}</div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setStep(1)}
              style={{
                width: "100%", padding: "18px", marginTop: 8, border: "none", borderRadius: 18,
                background: "linear-gradient(135deg,#6C63FF,#a78bfa)",
                color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer", letterSpacing: .3,
                boxShadow: "0 8px 32px rgba(108,99,255,.5)", transition: "transform .15s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Start Filling → 
            </button>
          </div>
        )}

        {/* ══ STEP 1 — GOOGLE FORM ══ */}
        {step === 1 && (
          <div style={{ animation: "slideUp .45s cubic-bezier(.22,1,.36,1)" }}>

            {/* form card */}
            <div style={{
              borderRadius: 24, overflow: "hidden",
              border: "1.5px solid rgba(108,99,255,.3)",
              boxShadow: `0 24px 64px rgba(0,0,0,.45)${pulse ? ",0 0 0 8px rgba(108,99,255,.25)" : ""}`,
              transition: "box-shadow .5s",
              background: "#fff",
            }}>
              {/* card top bar */}
              <div style={{ background: "linear-gradient(90deg,#6C63FF,#a78bfa)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "block" }} />)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.85)", marginLeft: 4 }}>Google Form</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,.55)", background: "rgba(255,255,255,.15)", padding: "3px 10px", borderRadius: 20 }}>🔒 Secure</span>
              </div>

              {/* skeleton while loading */}
              {!iframeReady && (
                <div style={{ padding: 24 }}>
                  {[80, 50, 80, 50, 80].map((w, i) => (
                    <div key={i} style={{ height: 14, borderRadius: 7, background: "#f0f0f0", marginBottom: 14, width: `${w}%`, animation: "shimmer 1.4s infinite" }} />
                  ))}
                </div>
              )}

              <iframe
                ref={iframeRef}
                src={FORM_SRC}
                width="100%"
                height="1700"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                onLoad={() => setIframeReady(true)}
                style={{ display: iframeReady ? "block" : "none" }}
                title="Response Form"
              />
            </div>

            {/* "I submitted" button */}
            <div style={{ marginTop: 20, padding: "16px", background: "rgba(255,255,255,.05)", borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", textAlign: "center" }}>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
                Once you hit <strong style={{ color: "rgba(255,255,255,.8)" }}>Submit</strong> inside the form above, tap below to complete.
              </p>
              <button
                onClick={handleDone}
                style={{
                  width: "100%", padding: "16px", border: "2px solid #43D9AD", borderRadius: 14,
                  background: "rgba(67,217,173,.12)", color: "#43D9AD", fontSize: 16,
                  fontWeight: 800, cursor: "pointer", letterSpacing: .3, transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#43D9AD"; e.currentTarget.style.color = "#0a2540"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(67,217,173,.12)"; e.currentTarget.style.color = "#43D9AD"; }}
              >
                ✓ I've Submitted the Form
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2 — SUCCESS ══ */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "24px 0", animation: "slideUp .5s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%", margin: "0 auto 24px",
              background: "linear-gradient(135deg,#43D9AD,#0a9b6e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 44, boxShadow: "0 12px 40px rgba(67,217,173,.4)",
              animation: "pop .5s cubic-bezier(.22,1,.36,1)",
            }}>
              ✓
            </div>

            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff" }}>Response Received!</h2>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
              Thank you for taking the time.<br />Your response has been recorded.
            </p>

            {/* result card */}
            <div style={{
              marginTop: 28, padding: "24px", borderRadius: 20,
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              textAlign: "left",
            }}>
              {[
                { label: "Status", val: "✅ Submitted" },
                { label: "Form", val: "Google Form" },
                { label: "Time", val: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)", fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{r.val}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setStep(0); setIframeReady(false); }}
              style={{
                marginTop: 24, width: "100%", padding: "16px", border: "none", borderRadius: 16,
                background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.7)",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}
            >
              ↩ Submit Another Response
            </button>
          </div>
        )}
      </div>

      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        @keyframes slideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity:0; } }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        button:active { opacity:.82 !important; }
        ::-webkit-scrollbar { width:0; }
      `}</style>
    </div>
  );
        }
