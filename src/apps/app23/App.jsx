import React, { useEffect, useMemo, useRef, useState } from "react";

const LS_KEY = "habit_reminder_v1";

// ---------- Helpers ----------
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toTimeStr(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function minutesFromHHMM(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function addMinutesToNow(mins) {
  return new Date(Date.now() + mins * 60 * 1000);
}

function safeJSONParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

// ---------- Notification + Sound ----------
async function ensurePermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  const res = await Notification.requestPermission();
  return res;
}

function fireSystemNotification(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(title, {
      body,
      // Android vibration (works in some browsers)
      vibrate: [200, 100, 200],
    });
  } catch (e) {
    // ignore
  }
}

function playRingtone(setStatus) {
  // Tip: Mobile browsers often require a user interaction first (tap)
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play().catch(() => {
    setStatus?.("⚠️ Sound blocked (mobile). Ek baar screen pe tap/click karke phir try karo.");
  });
}

// ---------- App ----------
export default function App() {
  const [permission, setPermission] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  const [status, setStatus] = useState("");
  const [nowStr, setNowStr] = useState(new Date().toLocaleString());

  // Popup state
  const [popup, setPopup] = useState(null); // {title, body}

  // Form states
  const [type, setType] = useState("fixed"); // fixed | timer
  const [habitName, setHabitName] = useState("");
  const [fixedTimes, setFixedTimes] = useState(["09:00"]); // multiple times/day
  const [timerMinutes, setTimerMinutes] = useState(25);

  // Habits list
  const [habits, setHabits] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    const data = safeJSONParse(raw, null);
    return data?.habits || [];
  });

  // Log of fired reminders (to avoid duplicate)
  const [firedLog, setFiredLog] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    const data = safeJSONParse(raw, null);
    return data?.firedLog || {}; // { "YYYY-MM-DD": { reminderId: true } }
  });

  const intervalRef = useRef(null);

  // Persist
  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        habits,
        firedLog,
      })
    );
  }, [habits, firedLog]);

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setNowStr(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Request permission
  const askPermission = async () => {
    const res = await ensurePermission();
    setPermission(res);
    if (res === "granted") setStatus("✅ Notifications allowed!");
    else if (res === "denied") setStatus("❌ Notifications blocked (browser settings me allow karo).");
    else setStatus("⚠️ Notifications unsupported on this browser.");
  };

  // ---------- Create reminders for today ----------
  const today = todayKey();
  const todayFired = firedLog[today] || {};

  const todaysReminders = useMemo(() => {
    const list = [];

    for (const h of habits) {
      if (h.repeat !== "daily") continue;

      if (h.type === "fixed") {
        for (const t of h.times) {
          const rid = `${h.id}|${today}|fixed|${t}`;
          list.push({
            reminderId: rid,
            habitId: h.id,
            habitName: h.name,
            type: "fixed",
            timeHHMM: t,
            dueMinutes: minutesFromHHMM(t),
            fired: !!todayFired[rid],
          });
        }
      }

      if (h.type === "timer") {
        // timer-based: it repeats daily based on "startTimeHHMM"
        // If start time exists: next due is start + every X minutes (until day ends)
        // If not, we won't schedule
        if (!h.startTimeHHMM) continue;

        const startMin = minutesFromHHMM(h.startTimeHHMM);
        const step = h.everyMinutes;

        // Generate due times for today (max 24h / step)
        for (let m = startMin; m < 24 * 60; m += step) {
          const hh = Math.floor(m / 60);
          const mm = m % 60;
          const t = `${pad2(hh)}:${pad2(mm)}`;
          const rid = `${h.id}|${today}|timer|${t}`;

          list.push({
            reminderId: rid,
            habitId: h.id,
            habitName: h.name,
            type: "timer",
            timeHHMM: t,
            dueMinutes: m,
            fired: !!todayFired[rid],
          });
        }
      }
    }

    // sort by due time
    list.sort((a, b) => a.dueMinutes - b.dueMinutes);
    return list;
  }, [habits, today, todayFired]);

  // ---------- Core checker (runs every 1s) ----------
  const checkReminders = () => {
    const currentMin = nowMinutes();
    const day = todayKey();
    const dayLog = firedLog[day] || {};

    // Trigger window: if time matches current minute (and within 20 seconds of that minute)
    // We'll do minute-level match to be stable on mobile.
    const now = new Date();
    const currentHHMM = toTimeStr(now);

    // find reminders due at currentHHMM
    const dueNow = todaysReminders.filter((r) => r.timeHHMM === currentHHMM && !dayLog[r.reminderId]);

    if (dueNow.length === 0) return;

    // Fire all due (if multiple)
    const updated = { ...dayLog };

    for (const r of dueNow) {
      updated[r.reminderId] = true;

      const title = "⏰ Habit Reminder";
      const body = `${r.habitName} (${r.type === "fixed" ? "Fixed Time" : "Timer"})`;

      // System notification
      fireSystemNotification(title, body);

      // In-app popup + sound
      setPopup({ title, body });
      playRingtone(setStatus);
    }

    setFiredLog((prev) => ({
      ...prev,
      [day]: updated,
    }));

    setStatus(`✅ Reminder fired at ${currentHHMM}`);
  };

  // Start/Stop background checker
  const [running, setRunning] = useState(false);

  const startChecker = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(checkReminders, 1000);
    setRunning(true);
    setStatus("🟢 Reminder checker ON (app open rakho).");
  };

  const stopChecker = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    setStatus("🔴 Reminder checker OFF.");
  };

  // Auto-start checker when app opens (best for your use case)
  useEffect(() => {
    startChecker();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup old logs (keep last 7 days)
  useEffect(() => {
    const keys = Object.keys(firedLog);
    if (keys.length <= 10) return;

    const sorted = keys.sort(); // YYYY-MM-DD lexicographic works
    const keep = sorted.slice(-7);
    const next = {};
    for (const k of keep) next[k] = firedLog[k];
    setFiredLog(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Add habit ----------
  const addFixedTime = () => {
    setFixedTimes((prev) => [...prev, "12:00"]);
  };

  const removeFixedTime = (idx) => {
    setFixedTimes((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateFixedTime = (idx, value) => {
    setFixedTimes((prev) => prev.map((t, i) => (i === idx ? value : t)));
  };

  const addHabit = () => {
    if (!habitName.trim()) {
      setStatus("⚠️ Habit name likho");
      return;
    }

    if (type === "fixed") {
      const cleaned = fixedTimes
        .map((t) => t?.trim())
        .filter(Boolean)
        .filter((t) => /^\d{2}:\d{2}$/.test(t));

      if (cleaned.length === 0) {
        setStatus("⚠️ At least 1 time add karo (HH:MM)");
        return;
      }

      const newHabit = {
        id: uid(),
        name: habitName.trim(),
        type: "fixed",
        repeat: "daily",
        times: Array.from(new Set(cleaned)).sort(),
        createdAt: Date.now(),
      };

      setHabits((prev) => [newHabit, ...prev]);
      setHabitName("");
      setFixedTimes(["09:00"]);
      setStatus("✅ Fixed-time habit added!");
      return;
    }

    if (type === "timer") {
      const mins = Number(timerMinutes);
      if (!mins || mins < 1) {
        setStatus("⚠️ Timer minutes 1+ rakho");
        return;
      }

      const start = toTimeStr(new Date()); // start from now
      const newHabit = {
        id: uid(),
        name: habitName.trim(),
        type: "timer",
        repeat: "daily",
        everyMinutes: mins,
        startTimeHHMM: start, // daily schedule begins from this time
        createdAt: Date.now(),
      };

      setHabits((prev) => [newHabit, ...prev]);
      setHabitName("");
      setTimerMinutes(25);
      setStatus(`✅ Timer habit added! (Every ${mins} min from ${start})`);
      return;
    }
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setStatus("🗑️ Habit deleted");
  };

  const resetTodayFired = () => {
    setFiredLog((prev) => {
      const next = { ...prev };
      delete next[today];
      return next;
    });
    setStatus("♻️ Today reminders reset");
  };

  const clearAll = () => {
    if (!confirm("Clear all habits + logs?")) return;
    setHabits([]);
    setFiredLog({});
    setStatus("🧹 Cleared all data");
  };

  // ---------- UI ----------
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.h1}>Habit Reminder 🔥</div>
          <div style={styles.sub}>Modern habit notifications (daily + timer)</div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.chip}>🕒 {nowStr}</div>
          <div
            style={{
              ...styles.chip,
              borderColor: permission === "granted" ? "rgba(0,0,0,0.12)" : "rgba(255,0,0,0.25)",
            }}
          >
            🔔 {permission}
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left: Create */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>➕ Create Habit</div>

          <div style={styles.row}>
            <button style={styles.btn} onClick={askPermission}>
              Allow Notifications
            </button>

            <button
              style={{
                ...styles.btn,
                background: running ? "#111" : "#2563eb",
              }}
              onClick={running ? stopChecker : startChecker}
            >
              {running ? "Stop Checker" : "Start Checker"}
            </button>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Habit Name</div>
            <input
              style={styles.input}
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g. Pani pina / Gym / Walk"
            />
          </div>

          <div style={styles.tabs}>
            <button
              onClick={() => setType("fixed")}
              style={{
                ...styles.tab,
                background: type === "fixed" ? "#111" : "transparent",
                color: type === "fixed" ? "white" : "#111",
              }}
            >
              📅 Fixed Time
            </button>
            <button
              onClick={() => setType("timer")}
              style={{
                ...styles.tab,
                background: type === "timer" ? "#111" : "transparent",
                color: type === "timer" ? "white" : "#111",
              }}
            >
              ⏱️ Timer Repeat
            </button>
          </div>

          {type === "fixed" ? (
            <div style={{ marginTop: 12 }}>
              <div style={styles.label}>Times (Daily)</div>

              {fixedTimes.map((t, idx) => (
                <div key={idx} style={styles.timeRow}>
                  <input
                    type="time"
                    style={styles.input}
                    value={t}
                    onChange={(e) => updateFixedTime(idx, e.target.value)}
                  />
                  <button style={styles.iconBtn} onClick={() => removeFixedTime(idx)}>
                    ✖
                  </button>
                </div>
              ))}

              <button style={styles.btnGhost} onClick={addFixedTime}>
                + Add another time
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={styles.label}>Repeat every (minutes)</div>
              <input
                type="number"
                min={1}
                style={styles.input}
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
                placeholder="e.g. 180 (3 hours)"
              />

              <div style={styles.smallNote}>
                Starts from <b>now</b> and repeats daily from that time.
              </div>
            </div>
          )}

          <button style={styles.btnPrimary} onClick={addHabit}>
            ✅ Add Habit
          </button>

          {status && <div style={styles.status}>{status}</div>}

          <div style={styles.row}>
            <button style={styles.btnGhost} onClick={resetTodayFired}>
              ♻️ Reset Today
            </button>
            <button style={styles.btnDanger} onClick={clearAll}>
              🧹 Clear All
            </button>
          </div>

          <div style={styles.smallNote}>
            📌 Tip: Mobile me best result ke liye app open rakho.  
            App open hote hi reminders auto-check honge.
          </div>
        </div>

        {/* Right: List */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>📌 Your Habits</div>

          {habits.length === 0 ? (
            <div style={styles.empty}>
              No habits yet. Add one like <b>“Pani pina”</b> or <b>“Gym 7:00 AM”</b> 😄
            </div>
          ) : (
            <div style={styles.list}>
              {habits.map((h) => (
                <div key={h.id} style={styles.habitCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={styles.habitName}>{h.name}</div>
                      <div style={styles.habitMeta}>
                        {h.type === "fixed" ? (
                          <>
                            📅 Daily at:{" "}
                            <b>{h.times.join(", ")}</b>
                          </>
                        ) : (
                          <>
                            ⏱️ Every <b>{h.everyMinutes} min</b> from{" "}
                            <b>{h.startTimeHHMM}</b>
                          </>
                        )}
                      </div>
                    </div>

                    <button style={styles.iconBtn} onClick={() => deleteHabit(h.id)}>
                      🗑️
                    </button>
                  </div>

                  <div style={styles.badges}>
                    <span style={styles.badge}>Daily</span>
                    <span style={styles.badge}>{h.type === "fixed" ? "Fixed" : "Timer"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: Today Reminders */}
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardTitle}>🗓️ Today Reminders</div>

          {todaysReminders.length === 0 ? (
            <div style={styles.empty}>No reminders for today yet.</div>
          ) : (
            <div style={styles.reminderGrid}>
              {todaysReminders.slice(0, 40).map((r) => (
                <div key={r.reminderId} style={styles.reminderCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={styles.remTime}>{r.timeHHMM}</div>
                      <div style={styles.remTitle}>{r.habitName}</div>
                      <div style={styles.remMeta}>
                        {r.type === "fixed" ? "Fixed time" : "Timer repeat"}
                      </div>
                    </div>
                    <div style={{ fontSize: 12 }}>
                      {r.fired ? (
                        <span style={{ ...styles.badge, background: "rgba(0,0,0,0.08)" }}>Done</span>
                      ) : (
                        <span style={styles.badge}>Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={styles.smallNote}>
            (Showing max 40 reminders for performance)
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{popup.title}</div>
            <div style={{ marginTop: 8, fontSize: 14 }}>{popup.body}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                style={styles.btnPrimary}
                onClick={() => setPopup(null)}
              >
                ✅ OK
              </button>

              <button
                style={styles.btnGhost}
                onClick={() => {
                  playRingtone(setStatus);
                  setStatus("🔁 Ringtone replayed");
                }}
              >
                🔊 Play Sound
              </button>
            </div>

            <div style={styles.smallNote}>
              Sound tabhi chalega jab aapne page pe interact kiya ho (mobile rule).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Styles ----------
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#111",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerRight: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  h1: {
    fontSize: 22,
    fontWeight: 900,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.75,
  },
  chip: {
    fontSize: 12,
    padding: "8px 10px",
    borderRadius: 999,
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  },
  card: {
    background: "white",
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontWeight: 900,
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  field: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.8,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.14)",
    outline: "none",
    fontSize: 14,
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    fontWeight: 800,
    cursor: "pointer",
  },
  timeRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "#111",
    color: "white",
    fontWeight: 900,
  },
  btnPrimary: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: 900,
    marginTop: 12,
  },
  btnGhost: {
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    cursor: "pointer",
    background: "transparent",
    fontWeight: 900,
    marginTop: 10,
    flex: 1,
  },
  btnDanger: {
    padding: 12,
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
    fontWeight: 900,
    marginTop: 10,
    flex: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
    fontSize: 16,
  },
  status: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.18)",
    fontSize: 13,
  },
  smallNote: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 1.35,
  },
  empty: {
    padding: 14,
    borderRadius: 14,
    background: "rgba(0,0,0,0.04)",
    border: "1px dashed rgba(0,0,0,0.15)",
    fontSize: 13,
  },
  list: {
    display: "grid",
    gap: 10,
  },
  habitCard: {
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(0,0,0,0.02)",
  },
  habitName: {
    fontWeight: 900,
    fontSize: 15,
  },
  habitMeta: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.8,
  },
  badges: {
    marginTop: 10,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    fontSize: 11,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.10)",
    border: "1px solid rgba(37,99,235,0.18)",
    fontWeight: 800,
  },
  reminderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 10,
  },
  reminderCard: {
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "white",
  },
  remTime: {
    fontWeight: 900,
    fontSize: 18,
  },
  remTitle: {
    marginTop: 4,
    fontWeight: 900,
    fontSize: 13,
  },
  remMeta: {
    marginTop: 2,
    fontSize: 11,
    opacity: 0.7,
  },
  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  popupBox: {
    width: "100%",
    maxWidth: 360,
    background: "white",
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(0,0,0,0.12)",
  },
};
