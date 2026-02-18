import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

const FORM_SRC =
  "https://docs.google.com/forms/d/e/1FAIpQLSczg5mSqp9_ry1z6uRRiRsARYKT54hWFu4LgDG1t4r7c6GGvw/viewform?embedded=true";

const SHEET_ID = "1Snmcgdnur6UUWcJTbzd8WLky3LN0WjTagxX2cmSeEQU";
const GID      = "88419242";
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

const C = {
  bg:     "linear-gradient(155deg,#0f0c29,#1a1040,#0d1b4b)",
  card:   "rgba(255,255,255,.06)",
  border: "rgba(255,255,255,.1)",
  purple: "#6C63FF",
  teal:   "#43D9AD",
  red:    "#FF6584",
  yellow: "#FFD166",
  txt:    "#fff",
  sub:    "rgba(255,255,255,.5)",
};

/* ── confetti ── */
function Confetti({ run }) {
  if (!run) return null;
  const ps = Array.from({ length: 28 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 1.2,
    color: [C.purple,"#FF6584",C.teal,C.yellow][i % 4],
    size: 7 + Math.random() * 7,
  }));
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden" }}>
      {ps.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,top:"-20px",
          width:p.size,height:p.size,borderRadius:p.size/3,
          background:p.color,animation:`fall 2.6s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
    </div>
  );
}

/* ── avatar ── */
const Avatar = ({ name, size=44 }) => (
  <div style={{
    width:size,height:size,borderRadius:size*.3,flexShrink:0,
    background:`hsl(${(name.charCodeAt(0)*41)%360},60%,48%)`,
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*.42,fontWeight:800,color:"#fff",
  }}>
    {name.trim().charAt(0).toUpperCase()}
  </div>
);

/* ── pill badge ── */
const Badge = ({ color="#43D9AD", children }) => (
  <span style={{
    fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,
    background:`${color}22`,color,border:`1px solid ${color}44`,
    whiteSpace:"nowrap",
  }}>{children}</span>
);

export default function App() {
  const [tab,        setTab]        = useState("form");
  const [iframeReady,setIframeReady]= useState(false);
  const [confetti,   setConfetti]   = useState(false);

  /* sheet data */
  const [rows,       setRows]       = useState([]);
  const [headers,    setHeaders]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [lastSync,   setLastSync]   = useState(null);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");

  useEffect(()=>{ if(confetti){ const t=setTimeout(()=>setConfetti(false),3000); return()=>clearTimeout(t); } },[confetti]);

  /* fetch sheet */
  const fetchSheet = useCallback(async (quiet=false) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const { data } = Papa.parse(text, { skipEmptyLines:true });
      if (data.length < 1) { setRows([]); setHeaders([]); return; }
      setHeaders(data[0]);
      setRows(data.slice(1).reverse()); // newest first
      setLastSync(new Date());
    } catch(e) {
      setError("Could not load sheet. Make sure it's public (Anyone with link → Viewer).");
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  /* auto-refresh every 30s */
  useEffect(() => {
    fetchSheet();
    const id = setInterval(() => fetchSheet(true), 30000);
    return () => clearInterval(id);
  }, [fetchSheet]);

  /* filtered rows */
  const filtered = rows.filter(r =>
    r.some(cell => cell.toLowerCase().includes(search.toLowerCase()))
  );

  const TabBar = () => (
    <div style={{ display:"flex",gap:6,padding:"0 16px 18px" }}>
      {[["form","📝 Form"],["data",`📊 Data${rows.length?` (${rows.length})`:""}` ]].map(([v,l])=>(
        <button key={v} onClick={()=>{ setTab(v); if(v==="data") fetchSheet(); }} style={{
          flex:1,padding:"12px 0",borderRadius:14,border:"none",fontWeight:700,fontSize:14,
          cursor:"pointer",transition:"all .25s",
          background:tab===v ? C.purple : C.card,
          color:tab===v ? "#fff" : C.sub,
          boxShadow:tab===v ? "0 4px 20px rgba(108,99,255,.4)" : "none",
          border:`1px solid ${tab===v?"transparent":C.border}`,
        }}>{l}</button>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight:"100dvh",background:C.bg,fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",overflowX:"hidden" }}>
      <Confetti run={confetti}/>

      {/* header */}
      <div style={{ padding:"52px 20px 20px",textAlign:"center",position:"relative" }}>
        <div style={{ position:"absolute",top:20,left:"50%",transform:"translateX(-50%)",width:280,height:120,background:"radial-gradient(ellipse,rgba(108,99,255,.4) 0%,transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ fontSize:40,marginBottom:8 }}>📋</div>
        <h1 style={{ margin:0,fontSize:24,fontWeight:900,color:C.txt,letterSpacing:-.5 }}>Response Tracker</h1>
        <p style={{ margin:"6px 0 20px",fontSize:13,color:C.sub }}>Live Google Sheet · Auto-refreshes every 30s</p>
      </div>

      <TabBar/>

      <div style={{ padding:"0 16px 56px",maxWidth:600,margin:"0 auto" }}>

        {/* ══ FORM TAB ══ */}
        {tab==="form" && (
          <div style={{ animation:"slideUp .4s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{
              background:"#fff",borderRadius:20,overflow:"hidden",
              border:`1.5px solid rgba(108,99,255,.3)`,
              boxShadow:"0 20px 60px rgba(0,0,0,.4)",marginBottom:16,
            }}>
              {/* browser bar */}
              <div style={{ background:`linear-gradient(90deg,${C.purple},#a78bfa)`,padding:"12px 18px",display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ display:"flex",gap:5 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{ width:10,height:10,borderRadius:"50%",background:c,display:"block" }}/>)}
                </div>
                <span style={{ fontSize:13,fontWeight:700,color:"rgba(255,255,255,.85)",marginLeft:6 }}>Google Form</span>
                <span style={{ marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,.6)",background:"rgba(255,255,255,.15)",padding:"3px 10px",borderRadius:20 }}>🔒 Secure</span>
              </div>

              {!iframeReady && (
                <div style={{ padding:24 }}>
                  {[85,55,85,55,70].map((w,i)=>(
                    <div key={i} style={{ height:13,borderRadius:7,background:"#f0f0f0",marginBottom:14,width:`${w}%`,animation:"shimmer 1.4s infinite" }}/>
                  ))}
                </div>
              )}
              <iframe src={FORM_SRC} width="100%" height="1700" frameBorder="0"
                marginHeight="0" marginWidth="0" title="Google Form"
                onLoad={()=>setIframeReady(true)}
                style={{ display:iframeReady?"block":"none" }}
              />
            </div>

            {/* after submit hint */}
            <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:18,textAlign:"center" }}>
              <p style={{ margin:"0 0 12px",fontSize:14,color:C.sub,lineHeight:1.6 }}>
                Submitted the form? Your response will appear automatically in the <strong style={{ color:C.txt }}>📊 Data</strong> tab within a few seconds.
              </p>
              <button
                onClick={()=>{ setConfetti(true); fetchSheet(); setTab("data"); }}
                style={{
                  width:"100%",padding:"14px",borderRadius:14,border:`2px solid ${C.teal}`,
                  background:`rgba(67,217,173,.1)`,color:C.teal,fontSize:15,fontWeight:800,cursor:"pointer",
                }}>
                ✅ I Submitted — Show My Response
              </button>
            </div>
          </div>
        )}

        {/* ══ DATA TAB ══ */}
        {tab==="data" && (
          <div style={{ animation:"slideUp .4s cubic-bezier(.22,1,.36,1)" }}>

            {/* toolbar */}
            <div style={{ display:"flex",gap:10,marginBottom:14,alignItems:"center" }}>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="🔍  Search entries…"
                style={{
                  flex:1,padding:"11px 16px",borderRadius:12,border:`1px solid ${C.border}`,
                  background:"rgba(255,255,255,.07)",color:C.txt,fontSize:14,outline:"none",
                  fontFamily:"inherit",
                }}
              />
              <button onClick={()=>fetchSheet()} disabled={loading} title="Refresh" style={{
                width:44,height:44,borderRadius:12,border:`1px solid ${C.border}`,
                background:C.card,color:C.txt,fontSize:18,cursor:"pointer",flexShrink:0,
                animation:loading?"spin 1s linear infinite":"none",
              }}>⟳</button>
            </div>

            {/* meta row */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <Badge color={C.teal}>✓ {filtered.length} Responses</Badge>
              {lastSync && <span style={{ fontSize:11,color:C.sub }}>Last sync: {lastSync.toLocaleTimeString()}</span>}
            </div>

            {/* error */}
            {error && (
              <div style={{ background:"rgba(255,101,132,.12)",border:`1px solid rgba(255,101,132,.3)`,borderRadius:14,padding:"14px 18px",fontSize:13,color:C.red,marginBottom:16,lineHeight:1.6 }}>
                ⚠️ {error}
              </div>
            )}

            {/* loading skeleton */}
            {loading && !rows.length && (
              <div>
                {[1,2,3].map(i=>(
                  <div key={i} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:18,marginBottom:12 }}>
                    {[70,45,55].map((w,j)=>(
                      <div key={j} style={{ height:12,borderRadius:6,background:"rgba(255,255,255,.08)",marginBottom:10,width:`${w}%`,animation:"shimmer 1.4s infinite" }}/>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* no data */}
            {!loading && !error && rows.length===0 && (
              <div style={{ textAlign:"center",padding:"60px 0" }}>
                <div style={{ fontSize:48 }}>📭</div>
                <div style={{ fontSize:18,fontWeight:800,color:C.txt,marginTop:12 }}>No Responses Yet</div>
                <div style={{ fontSize:13,color:C.sub,marginTop:6 }}>Submit the form and refresh.</div>
              </div>
            )}

            {/* no search results */}
            {!loading && rows.length>0 && filtered.length===0 && (
              <div style={{ textAlign:"center",padding:"40px 0",color:C.sub,fontSize:14 }}>
                No results for "<strong>{search}</strong>"
              </div>
            )}

            {/* cards */}
            {filtered.map((row, ri) => (
              <div key={ri} style={{
                background:C.card,border:`1px solid ${C.border}`,borderRadius:18,
                padding:"16px 18px",marginBottom:12,
                animation:`slideUp .3s ${ri*.05}s cubic-bezier(.22,1,.36,1) both`,
              }}>
                {/* card header */}
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${C.border}` }}>
                  <Avatar name={row[1] || row[0] || "?"} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:15,fontWeight:800,color:C.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {row[1] || "(No Name)"}
                    </div>
                    <div style={{ fontSize:11,color:C.sub,marginTop:2 }}>{row[0]}</div>
                  </div>
                  <Badge color={C.purple}>#{rows.length - ri}</Badge>
                </div>

                {/* all fields */}
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {headers.slice(2).map((h, ci) => {
                    const val = row[ci+2];
                    if (!val || !val.trim()) return null;
                    return (
                      <div key={ci} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                        <span style={{ fontSize:12,fontWeight:700,color:C.sub,minWidth:110,flexShrink:0,lineHeight:1.5,letterSpacing:.2 }}>
                          {h}
                        </span>
                        <span style={{ fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.5,wordBreak:"break-word" }}>
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* bottom note */}
            {rows.length>0 && (
              <div style={{ textAlign:"center",marginTop:8,fontSize:12,color:"rgba(255,255,255,.25)" }}>
                Live from Google Sheet · Auto-refreshes every 30s
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        * { -webkit-tap-highlight-color:transparent; box-sizing:border-box; }
        @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fall    { to{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes shimmer { 0%,100%{opacity:.3} 50%{opacity:.8} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        button:active{opacity:.75 !important;}
        input::placeholder{color:rgba(255,255,255,.25);}
        ::-webkit-scrollbar{width:0;}
      `}</style>
    </div>
  );
}
