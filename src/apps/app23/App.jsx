import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [message, setMessage] = useState("Time ho gaya 😄");
  const [dateTime, setDateTime] = useState("");
  const [status, setStatus] = useState("");
  const [popup, setPopup] = useState(false);

  const intervalRef = useRef(null);

  const requestPermission = async () => {
    const res = await Notification.requestPermission();
    setPermission(res);
    setStatus(res === "granted" ? "✅ Permission granted" : "❌ Permission denied");
  };

  const playSound = () => {
    // ringtone sound (online)
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    audio.play().catch(() => {
      setStatus("⚠️ Sound blocked! Pehle screen pe tap/click karo phir try karo.");
    });
  };

  const scheduleNotification = () => {
    if (permission !== "granted") {
      setStatus("⚠️ Pehle Notifications Allow karo");
      return;
    }

    if (!dateTime) {
      setStatus("⚠️ Date & time select karo");
      return;
    }

    const target = new Date(dateTime).getTime();
    if (target <= Date.now()) {
      setStatus("⚠️ Future ka time select karo");
      return;
    }

    setStatus("⏳ Scheduled! App open rakho (mobile background me stop ho sakta hai).");

    // Clear old timer
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const now = Date.now();

      // trigger within 1 second window
      if (now >= target) {
        clearInterval(intervalRef.current);

        // System notification
        new Notification("⏰ Reminder", {
          body: message,
          vibrate: [200, 100, 200], // mobile vibration (works sometimes)
        });

        // Popup + ringtone
        setPopup(true);
        playSound();

        setStatus("✅ Notification fired!");
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📱 Mobile Reminder App</h2>

        <p style={styles.small}>
          Permission:{" "}
          <b style={{ color: permission === "granted" ? "green" : "red" }}>
            {permission}
          </b>
        </p>

        <button style={styles.btn} onClick={requestPermission}>
          🔔 Allow Notifications
        </button>

        <div style={styles.field}>
          <label style={styles.label}>Message</label>
          <input
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Reminder message..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Select Date & Time</label>
          <input
            style={styles.input}
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        <button style={{ ...styles.btn, background: "#111" }} onClick={scheduleNotification}>
          ⏰ Start Reminder
        </button>

        {status && <p style={styles.status}>{status}</p>}

        <p style={styles.note}>
          ⚠️ Mobile me app/tab open rakho warna timer ruk sakta hai. <br />
          Background/lock screen ke liye PWA + Service Worker + Push chahiye.
        </p>
      </div>

      {/* Popup */}
      {popup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h3 style={{ margin: 0 }}>⏰ Reminder!</h3>
            <p style={{ marginTop: 8 }}>{message}</p>

            <button
              style={{ ...styles.btn, marginTop: 10 }}
              onClick={() => setPopup(false)}
            >
              ✅ OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: 16,
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
  },
  small: {
    marginBottom: 10,
    fontSize: 14,
  },
  field: {
    marginTop: 14,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 14,
  },
  btn: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  status: {
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    background: "#eef2ff",
    fontSize: 13,
  },
  note: {
    marginTop: 14,
    fontSize: 12,
    color: "#555",
    lineHeight: 1.4,
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  popupBox: {
    width: "100%",
    maxWidth: 320,
    background: "white",
    borderRadius: 14,
    padding: 16,
    textAlign: "center",
  },
};
