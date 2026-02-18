import { useState, useEffect } from "react";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSczg5mSqp9_ry1z6uRRiRsARYKT54hWFu4LgDG1t4r7c6GGvw/viewform?embedded=true";

const STORAGE_KEY = "gform-submissions";

const ios = {
  bg: "#F2F2F7",
  card: "#FFFFFF",
  accent: "#007AFF",
  danger: "#FF3B30",
  label: "#8E8E93",
  text: "#1C1C1E",
  border: "rgba(60,60,67,0.12)",
  success: "#34C759",
};

export default function App() {
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ name: "", note: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("form"); // form | logs

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res) setSubmissions(JSON.parse(res.value));
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleLog = async () => {
    if (!form.name.trim()) return showToast("Please enter your name", "error");
    setSaving(true);
    const entry = {
      id: Date.now(),
      name: form.name.trim(),
      note: form.note.trim(),
      time: new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    };
    const updated = [entry, ...submissions];
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated));
      setSubmissions(updated);
      setForm({ name: "", note: "" });
      showToast("Logged successfully ✓");
      setActiveTab("logs");
    } catch (_) {
      showToast("Failed to save", "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const updated = submissions.filter((s) => s.id !== id);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated));
      setSubmissions(updated);
      showToast("Deleted", "error");
    } catch (_) {}
  };

  return (
    <div style={{ minHeight: "100vh", background: ios.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" }}>
      {/* Status Bar */}
      <div style={{ background: ios.accent, height: 4 }} />

      {/* Header */}
      <div style={{ background: ios.card, borderBottom: `1px solid ${ios.border}`, padding: "16px 20px 12px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, color: ios.label, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>Google Form</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ios.text, marginTop: 2 }}>Response Tracker</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: ios.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>📋</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: "flex", marginTop: 14, background: ios.bg, borderRadius: 10, padding: 2 }}>
          {["form", "logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "7px 0", border: "none", borderRadius: 8, cursor: "pointer",
                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: activeTab === tab ? ios.card : "transparent",
                color: activeTab === tab ? ios.text : ios.label,
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
              }}>
              {tab === "form" ? "📝 Form" : `📊 Logs ${submissions.length > 0 ? `(${submissions.length})` : ""}`}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? ios.danger : "#1C1C1E",
          color: "#fff", padding: "10px 20px", borderRadius: 20, fontSize: 14,
          fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ padding: "20px 16px", maxWidth: 680, margin: "0 auto" }}>

        {/* FORM TAB */}
        {activeTab === "form" && (
          <div>
            {/* Google Form Embed */}
            <div style={{ background: ios.card, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${ios.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840", display: "inline-block" }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: ios.label, fontWeight: 500 }}>Google Form</span>
              </div>
              <iframe
                src={FORM_URL}
                width="100%"
                height="1656"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                style={{ display: "block" }}
                title="Google Form"
              >
                Loading…
              </iframe>
            </div>

            {/* Log Submission Card */}
            <div style={{ background: ios.card, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: ios.text, marginBottom: 4 }}>Log Your Submission</div>
              <div style={{ fontSize: 13, color: ios.label, marginBottom: 16 }}>After filling the form above, log your entry here to track it.</div>

              <label style={{ fontSize: 13, fontWeight: 600, color: ios.label, textTransform: "uppercase", letterSpacing: 0.5 }}>Your Name *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Enter your name"
                style={{
                  display: "block", width: "100%", marginTop: 6, marginBottom: 14,
                  padding: "12px 14px", borderRadius: 10, border: `1px solid ${ios.border}`,
                  fontSize: 16, outline: "none", boxSizing: "border-box", color: ios.text,
                  background: ios.bg,
                }}
              />

              <label style={{ fontSize: 13, fontWeight: 600, color: ios.label, textTransform: "uppercase", letterSpacing: 0.5 }}>Note (optional)</label>
              <textarea
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Any note about your submission…"
                rows={3}
                style={{
                  display: "block", width: "100%", marginTop: 6, marginBottom: 18,
                  padding: "12px 14px", borderRadius: 10, border: `1px solid ${ios.border}`,
                  fontSize: 16, outline: "none", resize: "none", boxSizing: "border-box",
                  color: ios.text, background: ios.bg, fontFamily: "inherit",
                }}
              />

              <button
                onClick={handleLog}
                disabled={saving}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: saving ? ios.label : ios.accent, color: "#fff",
                  fontSize: 16, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s", letterSpacing: 0.3,
                }}>
                {saving ? "Saving…" : "✓ Log Submission"}
              </button>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === "logs" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: ios.label }}>
                <div style={{ fontSize: 32 }}>⏳</div>
                <div style={{ marginTop: 8, fontSize: 15 }}>Loading…</div>
              </div>
            ) : submissions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: ios.text, marginTop: 12 }}>No Submissions Yet</div>
                <div style={{ fontSize: 14, color: ios.label, marginTop: 6 }}>Fill the form and log your first entry.</div>
                <button onClick={() => setActiveTab("form")} style={{ marginTop: 20, padding: "12px 28px", borderRadius: 12, border: "none", background: ios.accent, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Go to Form</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: ios.label, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {submissions.length} Submission{submissions.length !== 1 ? "s" : ""}
                </div>
                {submissions.map((s, i) => (
                  <div key={s.id} style={{
                    background: ios.card, borderRadius: 14, padding: "16px", marginBottom: 12,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.07)", display: "flex", alignItems: "flex-start", gap: 14,
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                      background: `hsl(${(s.name.charCodeAt(0) * 37) % 360}, 70%, 60%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 18, fontWeight: 700,
                    }}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: ios.text }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: ios.label }}>{s.time}</div>
                      </div>
                      {s.note && <div style={{ fontSize: 14, color: "#3C3C43", marginTop: 4, lineHeight: 1.4 }}>{s.note}</div>}
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, background: ios.success + "22", color: ios.success, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>✓ Submitted</span>
                        <span style={{ fontSize: 11, color: ios.label }}>#{submissions.length - i}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: ios.danger, fontSize: 18, padding: "0 0 0 4px", flexShrink: 0 }}>
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        input:focus, textarea:focus { border-color: ${ios.accent} !important; box-shadow: 0 0 0 3px ${ios.accent}33; }
        button:active { opacity: 0.7; }
      `}</style>
    </div>
  );
}
