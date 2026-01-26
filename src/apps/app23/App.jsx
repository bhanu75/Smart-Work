import React, { useEffect, useState } from "react";

export default function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [message, setMessage] = useState("Hey! Time ho gaya 😄");
  const [dateTime, setDateTime] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setStatus("✅ Notification permission granted!");
    } else {
      setStatus("❌ Permission denied!");
    }
  };

  const scheduleNotification = () => {
    if (permission !== "granted") {
      setStatus("⚠️ Pehle notification permission allow karo!");
      return;
    }

    if (!dateTime) {
      setStatus("⚠️ Date & time select karo!");
      return;
    }

    const targetTime = new Date(dateTime).getTime();
    const now = Date.now();
    const delay = targetTime - now;

    if (delay <= 0) {
      setStatus("⚠️ Future ka time select karo!");
      return;
    }

    setStatus(`⏳ Scheduled! Notification will show at: ${new Date(dateTime).toLocaleString()}`);

    setTimeout(() => {
      new Notification("⏰ Reminder", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
      });

      setStatus("✅ Notification sent!");
    }, delay);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📅 Date & Time Notification Scheduler</h2>

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
            placeholder="Enter notification message..."
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
          ⏰ Schedule Notification
        </button>

        {status && <p style={styles.status}>{status}</p>}

        <p style={styles.note}>
          ⚠️ Note: Ye notification tabhi aayega jab browser/tab open ho.  
          (Background/closed ke liye Service Worker + Push chahiye)
        </p>
      </div>
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
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 450,
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
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
    marginTop: 15,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 14,
  },
  btn: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  status: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    background: "#eef2ff",
    fontSize: 14,
  },
  note: {
    marginTop: 15,
    fontSize: 12,
    color: "#555",
    lineHeight: 1.4,
  },
};
