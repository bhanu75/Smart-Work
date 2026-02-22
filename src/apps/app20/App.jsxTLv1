import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "tradelog_v3";

const DEFAULTS = {
  reasons: ["Breakout above resistance", "Support bounce", "Volume spike", "EMA crossover", "News catalyst"],
  tags: ["High Volatility", "Earnings Season", "Pre-market move", "Low Liquidity"],
  conditions: ["No trades after 3PM", "Max 3 trades/day", "Wait for confirmation candle", "Risk max 1% per trade"],
};

const TABS = ["Templates", "Reasons", "Risk Tags", "Conditions", "Settings"];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        reasons: p.reasons || [...DEFAULTS.reasons],
        tags: p.tags || [...DEFAULTS.tags],
        conditions: p.conditions || [...DEFAULTS.conditions],
        buy: { reasons: p.buy?.reasons || [], risk: p.buy?.risk || "No" },
        sell: { reasons: p.sell?.reasons || [], risk: p.sell?.risk || "No" },
        copies: p.copies || 0,
      };
    }
  } catch {}
  return {
    reasons: [...DEFAULTS.reasons],
    tags: [...DEFAULTS.tags],
    conditions: [...DEFAULTS.conditions],
    buy: { reasons: [], risk: "No" },
    sell: { reasons: [], risk: "No" },
    copies: 0,
  };
}

function saveStorage(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ─── COPY UTIL ────────────────────────────────────────────────────────────────
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

// ─── BUILD TEMPLATE TEXT ──────────────────────────────────────────────────────
// Screenshot format from user:
// BUY
// Reason:
// 1. New one
// 2. News catalyst
// Risky:  No
function buildText(type, tradeState, note) {
  const typeName = type.toUpperCase();
  const { reasons, risk } = tradeState;
  let lines = [typeName, "Reason:"];
  if (reasons.length === 0) {
    lines.push("—");
  } else {
    reasons.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
  }
  lines.push(`Risky:  ${risk}`);
  if (note && note.trim()) lines.push(`Note:   ${note.trim()}`);
  return lines.join("\n");
}

// ─── STYLES (inline CSS-in-JS using a style tag injected once) ─────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  :root {
    --bg:   #000;
    --bg1:  #0c0c0e;
    --bg2:  #1c1c1e;
    --bg3:  #2c2c2e;
    --bg4:  #3a3a3c;
    --sep:  rgba(255,255,255,0.08);
    --t:    #fff;
    --t2:   rgba(255,255,255,0.58);
    --t3:   rgba(255,255,255,0.32);
    --g:    #30d158;
    --gd:   rgba(48,209,88,0.14);
    --r:    #ff453a;
    --rd:   rgba(255,69,58,0.14);
    --b:    #0a84ff;
    --bd:   rgba(10,132,255,0.14);
    --y:    #ffd60a;
    --yd:   rgba(255,214,10,0.11);
    --rad:  14px;
    --rad2: 10px;
    --rad3: 8px;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Sora', -apple-system, sans-serif;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--t);
    font-family: var(--sans);
    min-height: 100dvh;
    overscroll-behavior: none;
  }

  /* ── HEADER ── */
  .tl-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(0,0,0,0.82);
    backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--sep);
    padding: 13px 20px 11px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .tl-logo { display: flex; align-items: center; gap: 10px; }
  .tl-logo-mark {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #30d158, #00b890);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 18px rgba(48,209,88,0.28);
  }
  .tl-logo-text { font-size: 17px; font-weight: 700; letter-spacing: -0.4px; }
  .tl-logo-text span { color: var(--g); }
  .tl-icon-btn {
    width: 34px; height: 34px;
    background: var(--bg2); border: 1px solid var(--sep); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px; color: var(--t2);
    transition: background .15s, transform .1s;
    user-select: none;
  }
  .tl-icon-btn:active { transform: scale(.92); background: var(--bg3); }

  /* ── TABS ── */
  .tl-tabs {
    display: flex; gap: 4px; padding: 11px 16px;
    background: var(--bg1); overflow-x: auto; scrollbar-width: none;
  }
  .tl-tabs::-webkit-scrollbar { display: none; }
  .tl-tab {
    flex-shrink: 0; padding: 7px 14px; border-radius: 20px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    background: transparent; color: var(--t3);
    border: 1px solid transparent;
    transition: all .18s;
    user-select: none;
  }
  .tl-tab.active { background: var(--bg3); color: var(--t); border-color: var(--sep); }

  /* ── MAIN ── */
  .tl-main { padding: 0 16px 100px; max-width: 520px; margin: 0 auto; }

  /* ── SECTION LABEL ── */
  .tl-slabel {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .8px; color: var(--t3); padding: 18px 4px 8px;
  }

  /* ── CARD ── */
  .tl-card {
    background: var(--bg2); border-radius: var(--rad);
    border: 1px solid var(--sep); overflow: hidden; margin-bottom: 10px;
  }
  .tl-card-row {
    display: flex; align-items: center; padding: 14px 16px;
    border-bottom: 1px solid var(--sep); gap: 12px;
  }
  .tl-card-row:last-child { border-bottom: none; }

  /* ── TEMPLATE BLOCK ── */
  .tl-tmpl {
    background: var(--bg2); border-radius: var(--rad);
    border: 1px solid var(--sep); overflow: hidden; margin-bottom: 12px;
  }
  .tl-tmpl-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px; border-bottom: 1px solid var(--sep);
  }
  .tl-tmpl-type { display: flex; align-items: center; gap: 8px; }

  /* ── BADGE ── */
  .tl-badge {
    padding: 3px 10px; border-radius: 20px; font-size: 12px;
    font-weight: 700; letter-spacing: .5px; font-family: var(--mono);
  }
  .tl-badge-buy  { background: var(--gd); color: var(--g); border: 1px solid rgba(48,209,88,.28); }
  .tl-badge-sell { background: var(--rd); color: var(--r); border: 1px solid rgba(255,69,58,.28); }

  /* ── COPY BTN ── */
  .tl-copy-btn {
    background: var(--bg3); border: 1px solid var(--sep);
    border-radius: var(--rad3); color: var(--t2);
    font-size: 12px; font-weight: 500; padding: 6px 13px;
    cursor: pointer; transition: all .15s;
    display: flex; align-items: center; gap: 5px;
    font-family: var(--sans); white-space: nowrap;
  }
  .tl-copy-btn:active { transform: scale(.93); }
  .tl-copy-btn.copied { background: var(--gd); color: var(--g); border-color: rgba(48,209,88,.3); }

  /* ── PREVIEW BOX ── */
  .tl-preview {
    margin: 14px 16px;
    background: var(--bg3); border: 1px solid var(--sep);
    border-radius: var(--rad3);
    padding: 12px 14px;
    font-family: var(--mono); font-size: 13px; line-height: 1.9;
  }
  .tl-preview-type { font-weight: 700; }
  .tl-preview-key  { color: var(--t3); }
  .tl-preview-val  { color: var(--t); }
  .tl-preview-reason-item {
    display: flex; gap: 6px; align-items: baseline;
    padding-left: 8px;
  }
  .tl-preview-num { color: var(--b); font-weight: 600; flex-shrink: 0; }

  /* note textarea inside preview */
  .tl-note-field {
    background: transparent; border: none; outline: none;
    font-family: var(--mono); font-size: 13px; color: var(--t2);
    resize: none; width: 100%; line-height: 1.6;
    min-height: 20px; padding: 0; display: block;
  }
  .tl-note-field::placeholder { color: var(--t3); }

  /* ── SUB LABEL ── */
  .tl-sublabel {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .7px; color: var(--t3);
    padding: 10px 16px 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .tl-sub-badge {
    font-size: 9px; padding: 2px 7px; border-radius: 10px;
    background: var(--bd); color: var(--b);
    border: 1px solid rgba(10,132,255,.3); font-weight: 600; letter-spacing: 0;
  }

  /* ── REASON PILLS ── */
  .tl-pills { padding: 4px 16px 12px; display: flex; flex-wrap: wrap; gap: 7px; }
  .tl-pill {
    padding: 7px 13px; border-radius: 20px; font-size: 12px; font-weight: 500;
    cursor: pointer; border: 1px solid var(--sep);
    background: var(--bg3); color: var(--t2);
    transition: all .18s; font-family: var(--sans); user-select: none;
    display: flex; align-items: center; gap: 4px;
  }
  .tl-pill:active { transform: scale(.94); }
  .tl-pill.sel { background: var(--bd); color: var(--b); border-color: rgba(10,132,255,.4); }
  .tl-pill-check { font-size: 10px; opacity: 0; transition: opacity .15s; }
  .tl-pill.sel .tl-pill-check { opacity: 1; }
  .tl-pill.clr { background: var(--rd); color: var(--r); border-color: rgba(255,69,58,.3); }

  /* ── RISK ROW ── */
  .tl-risk-row { display: flex; gap: 6px; padding: 0 16px 14px; }
  .tl-risk-opt {
    flex: 1; padding: 8px 4px; border-radius: var(--rad3); text-align: center;
    font-size: 12px; font-weight: 600; cursor: pointer;
    border: 1px solid var(--sep); background: var(--bg3); color: var(--t2);
    transition: all .15s; font-family: var(--sans); user-select: none;
  }
  .tl-risk-opt:active { transform: scale(.94); }
  .tl-risk-opt.ry { background: var(--rd); color: var(--r); border-color: rgba(255,69,58,.3); }
  .tl-risk-opt.rn { background: var(--gd); color: var(--g); border-color: rgba(48,209,88,.3); }
  .tl-risk-opt.rp { background: var(--yd); color: var(--y); border-color: rgba(255,214,10,.3); }

  /* ── QUICK CHIPS ── */
  .tl-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
  .tl-chip {
    background: var(--bg2); border: 1px solid var(--sep);
    border-radius: var(--rad); padding: 14px;
    cursor: pointer; transition: all .15s;
    display: flex; flex-direction: column; gap: 4px; user-select: none;
  }
  .tl-chip:active { transform: scale(.96); }
  .tl-chip-lbl { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .5px; color: var(--t3); }
  .tl-chip-val { font-size: 14px; font-weight: 600; color: var(--t); font-family: var(--mono); }
  .tl-chip.gc { border-color: rgba(48,209,88,.2); }
  .tl-chip.gc .tl-chip-val { color: var(--g); }
  .tl-chip.rc { border-color: rgba(255,69,58,.2); }
  .tl-chip.rc .tl-chip-val { color: var(--r); }
  .tl-chip.flash { background: var(--gd); border-color: rgba(48,209,88,.3); }

  /* ── LIST ITEMS ── */
  .tl-list-item {
    display: flex; align-items: center;
    padding: 0 16px; border-bottom: 1px solid var(--sep);
    gap: 8px; min-height: 52px;
  }
  .tl-list-item:last-child { border-bottom: none; }
  .tl-list-text {
    flex: 1; font-size: 14px; color: var(--t);
    font-family: var(--mono); padding: 14px 0;
    cursor: pointer; word-break: break-word;
  }
  .tl-list-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

  /* ── INLINE EDIT ── */
  .tl-inline-input {
    flex: 1; min-width: 0;
    background: var(--bg3); border: 1px solid var(--b);
    border-radius: var(--rad3); padding: 8px 10px;
    font-size: 14px; color: var(--t);
    font-family: var(--mono); outline: none; margin: 8px 0;
  }
  .tl-save-btn {
    background: var(--gd); border: 1px solid rgba(48,209,88,.3);
    border-radius: var(--rad3); color: var(--g);
    font-size: 12px; font-weight: 600; padding: 6px 10px;
    cursor: pointer; font-family: var(--sans); white-space: nowrap;
    transition: all .15s;
  }
  .tl-save-btn:active { transform: scale(.93); }

  /* ── ACTION BUTTONS ── */
  .tl-act-copy {
    background: var(--bg3); border: 1px solid var(--sep);
    border-radius: var(--rad3); color: var(--t2);
    font-size: 13px; padding: 5px 10px; cursor: pointer;
    font-family: var(--sans); transition: all .15s; white-space: nowrap;
  }
  .tl-act-copy:active { transform: scale(.93); }
  .tl-act-copy.copied { background: var(--gd); color: var(--g); border-color: rgba(48,209,88,.3); }
  .tl-act-edit {
    width: 28px; height: 28px;
    background: var(--bd); border: 1px solid rgba(10,132,255,.2);
    border-radius: 8px; color: var(--b);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 12px; transition: all .15s;
  }
  .tl-act-edit:active { transform: scale(.9); }
  .tl-act-del {
    width: 28px; height: 28px;
    background: var(--rd); border: 1px solid rgba(255,69,58,.2);
    border-radius: 8px; color: var(--r);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: all .15s;
  }
  .tl-act-del:active { transform: scale(.9); }

  /* ── ADD ROW ── */
  .tl-add-row {
    display: flex; gap: 8px; padding: 12px 16px;
    border-top: 1px solid var(--sep); align-items: center;
  }
  .tl-add-input {
    flex: 1; background: var(--bg3); border: 1px solid var(--sep);
    border-radius: var(--rad3); padding: 9px 12px;
    font-size: 14px; color: var(--t);
    font-family: var(--mono); outline: none; transition: border-color .2s;
  }
  .tl-add-input:focus { border-color: var(--b); }
  .tl-add-input::placeholder { color: var(--t3); }
  .tl-add-btn {
    background: var(--b); border: none; border-radius: var(--rad3);
    color: #fff; font-size: 22px; font-weight: 300;
    width: 36px; height: 36px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s; font-family: var(--sans); flex-shrink: 0;
  }
  .tl-add-btn:active { transform: scale(.93); background: #0070e0; }

  /* ── EMPTY ── */
  .tl-empty { padding: 28px 16px; text-align: center; color: var(--t3); font-size: 13px; }

  /* ── EXPORT CARD ── */
  .tl-exp-card {
    background: var(--bg2); border-radius: var(--rad);
    border: 1px solid var(--sep); overflow: hidden; margin-bottom: 10px;
  }
  .tl-exp-row {
    display: flex; align-items: center; padding: 16px; gap: 12px;
    border-bottom: 1px solid var(--sep); cursor: pointer; transition: background .15s;
  }
  .tl-exp-row:last-child { border-bottom: none; }
  .tl-exp-row:active { background: var(--bg3); }
  .tl-exp-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .tl-exp-info { flex: 1; }
  .tl-exp-title { font-size: 15px; font-weight: 500; }
  .tl-exp-sub { font-size: 12px; color: var(--t3); margin-top: 2px; }
  .tl-exp-arr { color: var(--t3); font-size: 16px; }

  /* ── STATS ── */
  .tl-stats { display: flex; gap: 8px; margin-bottom: 10px; }
  .tl-stat {
    flex: 1; background: var(--bg2); border: 1px solid var(--sep);
    border-radius: var(--rad); padding: 14px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .tl-stat-val { font-size: 24px; font-weight: 700; font-family: var(--mono); }
  .tl-stat-lbl { font-size: 11px; color: var(--t3); font-weight: 500; text-transform: uppercase; letter-spacing: .5px; }

  /* ── TOAST ── */
  .tl-toast {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%) translateY(12px);
    background: rgba(28,28,30,0.96); border: 1px solid var(--sep);
    border-radius: 22px; padding: 10px 22px;
    font-size: 14px; font-weight: 500; color: var(--t);
    backdrop-filter: blur(20px); z-index: 999; opacity: 0;
    transition: all .22s cubic-bezier(0.34,1.56,0.64,1);
    white-space: nowrap; pointer-events: none;
  }
  .tl-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ── MODAL ── */
  .tl-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.72);
    z-index: 200; display: flex; align-items: flex-end;
    opacity: 0; pointer-events: none; transition: opacity .22s;
  }
  .tl-modal-overlay.show { opacity: 1; pointer-events: all; }
  .tl-modal {
    background: var(--bg2); border-radius: 20px 20px 0 0;
    width: 100%; padding: 20px 20px 36px;
    transform: translateY(100%);
    transition: transform .28s cubic-bezier(0.32,0.72,0,1);
    border-top: 1px solid var(--sep);
  }
  .tl-modal-overlay.show .tl-modal { transform: translateY(0); }
  .tl-modal-handle { width: 36px; height: 4px; background: var(--bg4); border-radius: 2px; margin: 0 auto 20px; }
  .tl-modal-title { font-size: 17px; font-weight: 600; margin-bottom: 14px; }
  .tl-modal-close {
    width: 100%; padding: 13px; background: var(--b); border: none;
    border-radius: var(--rad3); color: #fff; font-size: 15px;
    font-weight: 600; cursor: pointer; font-family: var(--sans); margin-top: 18px;
  }

  .tl-hint { font-size: 11px; color: var(--t3); padding: 0 4px 8px; font-style: italic; }
`;

// ─── INJECT CSS ───────────────────────────────────────────────────────────────
function useGlobalCSS() {
  useEffect(() => {
    const id = "tl-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = CSS;
    document.head.appendChild(s);
  }, []);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return <div className={`tl-toast${msg ? " show" : ""}`}>{msg}</div>;
}

function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef(null);
  const show = useCallback((text) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 1800);
  }, []);
  return [msg, show];
}

// ─── COPY BUTTON (reusable, shows ✓ on copy) ─────────────────────────────────
function CopyBtn({ text, label = "⎘", className = "tl-act-copy", onCopied }) {
  const [copied, setCopied] = useState(false);
  const handle = async (e) => {
    e.stopPropagation();
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
    if (onCopied) onCopied();
  };
  return (
    <button className={`${className}${copied ? " copied" : ""}`} onClick={handle}>
      {copied ? "✓" : label}
    </button>
  );
}

// ─── TEMPLATE PREVIEW ─────────────────────────────────────────────────────────
function PreviewBox({ type, tradeState, note, setNote }) {
  const { reasons, risk } = tradeState;
  const riskColor = risk === "Yes" ? "var(--r)" : risk === "Partial" ? "var(--y)" : "var(--g)";
  const typeColor = type === "buy" ? "var(--g)" : "var(--r)";

  const noteRef = useRef(null);
  useEffect(() => {
    if (noteRef.current) {
      noteRef.current.style.height = "auto";
      noteRef.current.style.height = noteRef.current.scrollHeight + "px";
    }
  }, [note]);

  return (
    <div className="tl-preview">
      {/* BUY / SELL */}
      <div className="tl-preview-type" style={{ color: typeColor }}>
        {type.toUpperCase()}
      </div>

      {/* Reason: */}
      <div>
        <span className="tl-preview-key">Reason:</span>
        {reasons.length === 0 && <span className="tl-preview-val"> —</span>}
      </div>

      {/* Numbered reasons each on new line */}
      {reasons.map((r, i) => (
        <div key={i} className="tl-preview-reason-item">
          <span className="tl-preview-num">{i + 1}.</span>
          <span className="tl-preview-val">{r}</span>
        </div>
      ))}

      {/* Risky */}
      <div>
        <span className="tl-preview-key">Risky: </span>
        <span style={{ color: riskColor, fontWeight: 600 }}>{risk}</span>
      </div>

      {/* Note */}
      <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
        <span className="tl-preview-key" style={{ marginTop: 2 }}>Note: </span>
        <textarea
          ref={noteRef}
          className="tl-note-field"
          rows={1}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional — add anything specific…"
        />
      </div>
    </div>
  );
}

// ─── REASON PILLS ─────────────────────────────────────────────────────────────
function ReasonPills({ type, allReasons, selected, onToggle, onClear }) {
  if (!allReasons.length)
    return (
      <div className="tl-pills">
        <div style={{ fontSize: 12, color: "var(--t3)", padding: "4px 0 8px" }}>
          Go to Reasons tab to add your entry signals.
        </div>
      </div>
    );

  return (
    <div className="tl-pills">
      {allReasons.map((r) => {
        const isSel = selected.includes(r);
        return (
          <button
            key={r}
            className={`tl-pill${isSel ? " sel" : ""}`}
            onClick={() => onToggle(r)}
          >
            <span className="tl-pill-check">✓</span>
            {r}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button className="tl-pill clr" onClick={onClear}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}

// ─── RISK BUTTONS ─────────────────────────────────────────────────────────────
function RiskRow({ value, onChange }) {
  const opts = [
    { val: "Yes", cls: "ry", label: "⚠ Yes" },
    { val: "No", cls: "rn", label: "✓ No" },
    { val: "Partial", cls: "rp", label: "~ Partial" },
  ];
  return (
    <div className="tl-risk-row">
      {opts.map((o) => (
        <button
          key={o.val}
          className={`tl-risk-opt${value === o.val ? " " + o.cls : ""}`}
          onClick={() => onChange(o.val)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── TEMPLATE BLOCK ───────────────────────────────────────────────────────────
function TemplateBlock({ type, allReasons, tradeState, setTradeState, onCopied }) {
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const isBuy = type === "buy";

  const toggleReason = (r) => {
    setTradeState((prev) => {
      const sel = prev.reasons.includes(r)
        ? prev.reasons.filter((x) => x !== r)
        : [...prev.reasons, r];
      return { ...prev, reasons: sel };
    });
  };

  const clearReasons = () => setTradeState((prev) => ({ ...prev, reasons: [] }));
  const setRisk = (risk) => setTradeState((prev) => ({ ...prev, risk }));

  const handleCopy = async () => {
    const text = buildText(type, tradeState, note);
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    onCopied();
  };

  return (
    <div className="tl-tmpl">
      {/* Header */}
      <div className="tl-tmpl-header">
        <div className="tl-tmpl-type">
          <span className={`tl-badge tl-badge-${type}`}>
            {type.toUpperCase()}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--t2)" }}>
            {isBuy ? "Long Position" : "Short / Exit"}
          </span>
        </div>
        <button
          className={`tl-copy-btn${copied ? " copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied!" : "⎘ Copy"}
        </button>
      </div>

      {/* Preview */}
      <PreviewBox
        type={type}
        tradeState={tradeState}
        note={note}
        setNote={setNote}
      />

      {/* Reasons */}
      <div className="tl-sublabel">
        Select Reasons{" "}
        <span className="tl-sub-badge">MULTI-SELECT</span>
      </div>
      <ReasonPills
        type={type}
        allReasons={allReasons}
        selected={tradeState.reasons}
        onToggle={toggleReason}
        onClear={clearReasons}
      />

      {/* Risk */}
      <div className="tl-sublabel">Risk</div>
      <RiskRow value={tradeState.risk} onChange={setRisk} />
    </div>
  );
}

// ─── LIST ITEM (with inline edit) ─────────────────────────────────────────────
function ListItem({ item, onCopy, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(item);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Keep val in sync if item changes externally
  useEffect(() => { setVal(item); }, [item]);

  const handleSave = () => {
    const trimmed = val.trim();
    if (!trimmed) return;
    onEdit(trimmed);
    setEditing(false);
  };

  const handleCopyClick = async (e) => {
    e.stopPropagation();
    await copyText(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
    onCopy();
  };

  return (
    <div className="tl-list-item">
      {editing ? (
        <input
          ref={inputRef}
          className="tl-inline-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleSave(); }
            if (e.key === "Escape") { setEditing(false); setVal(item); }
          }}
          maxLength={120}
        />
      ) : (
        <div className="tl-list-text" onClick={() => setEditing(true)}>
          {item}
        </div>
      )}

      <div className="tl-list-actions">
        {editing ? (
          <button className="tl-save-btn" onClick={handleSave}>Save</button>
        ) : (
          <>
            <button
              className={`tl-act-copy${copied ? " copied" : ""}`}
              onClick={handleCopyClick}
            >
              {copied ? "✓" : "⎘"}
            </button>
            <button className="tl-act-edit" onClick={(e) => { e.stopPropagation(); setEditing(true); }}>✏</button>
            <button className="tl-act-del" onClick={(e) => { e.stopPropagation(); onDelete(); }}>✕</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── GENERIC LIST PAGE ────────────────────────────────────────────────────────
function ListPage({ type, items, setItems, placeholder, hint, onItemsChange }) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);
  const [, showToast] = useToast(); // local, but parent handles toast

  const add = () => {
    const v = inputVal.trim();
    if (!v) return;
    setItems((prev) => [...prev, v]);
    setInputVal("");
    if (onItemsChange) onItemsChange();
  };

  const edit = (i, newVal) => {
    setItems((prev) => {
      const next = [...prev];
      next[i] = newVal;
      return next;
    });
    if (onItemsChange) onItemsChange(i, newVal);
  };

  const del = (i) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    if (onItemsChange) onItemsChange();
  };

  return (
    <div>
      <div className="tl-slabel">{type === "reasons" ? "Trade Reasons" : type === "tags" ? "Risk Tags" : "Trading Conditions / Rules"}</div>
      {hint && <div className="tl-hint">{hint}</div>}
      <div className="tl-card">
        {items.length === 0 ? (
          <div className="tl-empty">No entries yet. Add one below.</div>
        ) : (
          items.map((item, i) => (
            <ListItem
              key={`${type}-${i}-${item}`}
              item={item}
              onCopy={() => {}}
              onEdit={(nv) => edit(i, nv)}
              onDelete={() => del(i)}
            />
          ))
        )}
        <div className="tl-add-row">
          <input
            ref={inputRef}
            className="tl-add-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder={placeholder}
            maxLength={120}
          />
          <button className="tl-add-btn" onClick={add}>+</button>
        </div>
      </div>

      {/* Conditions: one-tap copy chips */}
      {type === "conditions" && items.length > 0 && (
        <>
          <div className="tl-slabel">One-Tap Condition Copy</div>
          <div className="tl-card">
            {items.map((c, i) => (
              <div key={i} className="tl-list-item">
                <div className="tl-list-text" style={{ cursor: "default" }}>{c}</div>
                <CopyBtn text={c} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── QUICK CHIPS ──────────────────────────────────────────────────────────────
function QuickChips({ onCopied }) {
  const chips = [
    { label: "BUY Signal", value: "BUY", cls: "gc" },
    { label: "SELL Signal", value: "SELL", cls: "rc" },
    { label: "Risky: Yes", value: "Risky: Yes", cls: "" },
    { label: "Risky: No", value: "Risky: No", cls: "" },
  ];
  const [flashed, setFlashed] = useState(null);

  const handle = async (ch) => {
    await copyText(ch.value);
    setFlashed(ch.value);
    setTimeout(() => setFlashed(null), 900);
    onCopied(`✓ "${ch.value}" copied`);
  };

  return (
    <div className="tl-chips">
      {chips.map((ch) => (
        <div
          key={ch.value}
          className={`tl-chip ${ch.cls}${flashed === ch.value ? " flash" : ""}`}
          onClick={() => handle(ch)}
        >
          <div className="tl-chip-lbl">{ch.label}</div>
          <div className="tl-chip-val">{ch.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── HELP MODAL ───────────────────────────────────────────────────────────────
function HelpModal({ open, onClose }) {
  return (
    <div className={`tl-modal-overlay${open ? " show" : ""}`} onClick={onClose}>
      <div className="tl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tl-modal-handle" />
        <div className="tl-modal-title">How to Use TradeLog</div>
        <div style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: "var(--t)" }}>1. Multiple Reasons</strong>
            <br />Tap as many reason pills as needed. Preview shows numbered list. Copy gives clean text.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: "var(--t)" }}>2. Custom Note</strong>
            <br />Type anything trade-specific in the Note field — only for that one copy.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: "var(--t)" }}>3. Paste on Screenshot</strong>
            <br />Tap ⎘ Copy → open screenshot in Markup/Photos → Paste.
          </p>
          <p>
            <strong style={{ color: "var(--t)" }}>4. Edit Reasons</strong>
            <br />Reasons tab → tap ✏ or the text to edit inline instantly.
          </p>
        </div>
        <button className="tl-modal-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ state, setState, showToast }) {
  const fileRef = useRef(null);

  const exportData = () => {
    const data = { reasons: state.reasons, tags: state.tags, conditions: state.conditions, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradelog-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Exported successfully");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        setState((prev) => ({
          ...prev,
          reasons: d.reasons || prev.reasons,
          tags: d.tags || prev.tags,
          conditions: d.conditions || prev.conditions,
        }));
        showToast("✓ Import successful");
      } catch {
        showToast("⚠ Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const clearAll = () => {
    if (!confirm("Clear all custom reasons, tags, and conditions?")) return;
    setState((prev) => ({
      ...prev,
      reasons: [],
      tags: [],
      conditions: [],
      buy: { ...prev.buy, reasons: [] },
      sell: { ...prev.sell, reasons: [] },
    }));
    showToast("✓ All data cleared");
  };

  const resetCounter = () => {
    setState((prev) => ({ ...prev, copies: 0 }));
    showToast("✓ Counter reset");
  };

  const rows = [
    { icon: "📤", bg: "var(--bd)", title: "Export Settings", sub: "Download as JSON backup", fn: exportData },
    { icon: "📥", bg: "var(--gd)", title: "Import Settings", sub: "Restore from JSON file", fn: () => fileRef.current?.click() },
    { icon: "🗑", bg: "var(--rd)", title: "Clear All Data", sub: "Remove all reasons, tags & conditions", fn: clearAll },
  ];

  return (
    <div>
      <div className="tl-slabel">Data</div>
      <div className="tl-exp-card">
        {rows.map((r) => (
          <div key={r.title} className="tl-exp-row" onClick={r.fn}>
            <div className="tl-exp-icon" style={{ background: r.bg }}>{r.icon}</div>
            <div className="tl-exp-info">
              <div className="tl-exp-title">{r.title}</div>
              <div className="tl-exp-sub">{r.sub}</div>
            </div>
            <div className="tl-exp-arr">›</div>
          </div>
        ))}
      </div>

      <div className="tl-slabel">About</div>
      <div className="tl-card">
        <div className="tl-card-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>TradeLog Journal</div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>Version 3.0 · React · Works Offline</div>
          </div>
        </div>
        <div className="tl-card-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Storage</div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>All data saved locally in browser</div>
          </div>
          <div style={{ color: "var(--g)", fontSize: 12, fontWeight: 600 }}>LOCAL</div>
        </div>
      </div>

      <div className="tl-slabel">Reset Today's Counter</div>
      <div className="tl-card">
        <div className="tl-exp-row" onClick={resetCounter}>
          <div className="tl-exp-icon" style={{ background: "var(--yd)" }}>🔄</div>
          <div className="tl-exp-info">
            <div className="tl-exp-title">Reset Copy Counter</div>
            <div className="tl-exp-sub">Restart label count for new trading day</div>
          </div>
          <div className="tl-exp-arr">›</div>
        </div>
      </div>

      <input type="file" ref={fileRef} accept=".json" style={{ display: "none" }} onChange={importData} />
    </div>
  );
}

// ─── TEMPLATES PAGE ───────────────────────────────────────────────────────────
function TemplatesPage({ state, setState, showToast }) {
  const bumpCopies = (msg) => {
    setState((prev) => ({ ...prev, copies: prev.copies + 1 }));
    showToast(msg || "✓ Copied to clipboard");
  };

  const setBuyState = (updater) =>
    setState((prev) => ({ ...prev, buy: typeof updater === "function" ? updater(prev.buy) : updater }));

  const setSellState = (updater) =>
    setState((prev) => ({ ...prev, sell: typeof updater === "function" ? updater(prev.sell) : updater }));

  return (
    <div>
      <div className="tl-slabel">Quick Copy</div>
      <QuickChips onCopied={bumpCopies} />

      <div className="tl-slabel">BUY Template</div>
      <TemplateBlock
        type="buy"
        allReasons={state.reasons}
        tradeState={state.buy}
        setTradeState={setBuyState}
        onCopied={() => bumpCopies("✓ Copied to clipboard")}
      />

      <div className="tl-slabel">SELL Template</div>
      <TemplateBlock
        type="sell"
        allReasons={state.reasons}
        tradeState={state.sell}
        setTradeState={setSellState}
        onCopied={() => bumpCopies("✓ Copied to clipboard")}
      />

      <div className="tl-slabel">Today's Stats</div>
      <div className="tl-stats">
        <div className="tl-stat">
          <div className="tl-stat-val" style={{ color: "var(--g)" }}>{state.copies}</div>
          <div className="tl-stat-lbl">Labels Copied</div>
        </div>
        <div className="tl-stat">
          <div className="tl-stat-val">{state.reasons.length}</div>
          <div className="tl-stat-lbl">Custom Reasons</div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  useGlobalCSS();
  const [activeTab, setActiveTab] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toastMsg, showToast] = useToast();

  const [appState, setAppState] = useState(() => loadStorage());

  // Persist on every change
  useEffect(() => { saveStorage(appState); }, [appState]);

  const setReasons = (updater) =>
    setAppState((prev) => ({
      ...prev,
      reasons: typeof updater === "function" ? updater(prev.reasons) : updater,
      // clean up selected reasons in templates if deleted
    }));

  const setTags = (updater) =>
    setAppState((prev) => ({
      ...prev,
      tags: typeof updater === "function" ? updater(prev.tags) : updater,
    }));

  const setConditions = (updater) =>
    setAppState((prev) => ({
      ...prev,
      conditions: typeof updater === "function" ? updater(prev.conditions) : updater,
    }));

  const pages = [
    <TemplatesPage state={appState} setState={setAppState} showToast={showToast} />,
    <ListPage
      type="reasons"
      items={appState.reasons}
      setItems={setReasons}
      placeholder="e.g. Breakout above resistance"
      hint="Tap ✏ or the text to edit any reason inline."
    />,
    <ListPage
      type="tags"
      items={appState.tags}
      setItems={setTags}
      placeholder="e.g. High Volatility"
      hint="Tap ✏ or the text to edit any tag inline."
    />,
    <ListPage
      type="conditions"
      items={appState.conditions}
      setItems={setConditions}
      placeholder="e.g. No trades after 3PM"
      hint="Tap ✏ or the text to edit any rule inline."
    />,
    <SettingsPage state={appState} setState={setAppState} showToast={showToast} />,
  ];

  return (
    <>
      {/* Header */}
      <header className="tl-header">
        <div className="tl-logo">
          <div className="tl-logo-mark">📈</div>
          <div className="tl-logo-text">Trade<span>Log</span></div>
        </div>
        <div className="tl-icon-btn" onClick={() => setHelpOpen(true)}>?</div>
      </header>

      {/* Tabs */}
      <nav className="tl-tabs">
        {TABS.map((t, i) => (
          <div
            key={t}
            className={`tl-tab${activeTab === i ? " active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </div>
        ))}
      </nav>

      {/* Page content */}
      <main className="tl-main">{pages[activeTab]}</main>

      {/* Toast */}
      <Toast msg={toastMsg} />

      {/* Help modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
